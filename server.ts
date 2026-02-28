import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("simustock.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    userType TEXT DEFAULT 'Novice',
    balance REAL DEFAULT 100000,
    portfolio TEXT DEFAULT '{}',
    equityHistory TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS follows (
    followerId TEXT,
    followingId TEXT,
    PRIMARY KEY (followerId, followingId),
    FOREIGN KEY (followerId) REFERENCES users(id),
    FOREIGN KEY (followingId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    senderId TEXT,
    receiverId TEXT,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (receiverId) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth API
  app.post("/api/auth/register", (req, res) => {
    const { username, email, password, userType } = req.body;
    const id = `user_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const stmt = db.prepare("INSERT INTO users (id, username, email, password, userType) VALUES (?, ?, ?, ?, ?)");
      stmt.run(id, username, email, password, userType || 'Novice');
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  });

  // User API
  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare("SELECT id, username, email, userType, balance, portfolio, equityHistory FROM users WHERE id = ?").get(req.params.id);
    if (user) {
      // Get follow status
      const followers = db.prepare("SELECT COUNT(*) as count FROM follows WHERE followingId = ?").get(req.params.id) as any;
      const following = db.prepare("SELECT COUNT(*) as count FROM follows WHERE followerId = ?").get(req.params.id) as any;
      
      res.json({ 
        ...user, 
        portfolio: JSON.parse(user.portfolio as string),
        equityHistory: JSON.parse(user.equityHistory as string),
        followersCount: followers.count,
        followingCount: following.count
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/community/users", (req, res) => {
    const users = db.prepare("SELECT id, username, userType FROM users LIMIT 20").all();
    res.json(users);
  });

  // Social API
  app.post("/api/social/follow", (req, res) => {
    const { followerId, followingId } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO follows (followerId, followingId) VALUES (?, ?)");
      stmt.run(followerId, followingId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/social/message", (req, res) => {
    const { senderId, receiverId, content } = req.body;
    const id = uuidv4();
    try {
      const stmt = db.prepare("INSERT INTO messages (id, senderId, receiverId, content) VALUES (?, ?, ?, ?)");
      stmt.run(id, senderId, receiverId, content);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/social/messages/:userId", (req, res) => {
    const messages = db.prepare(`
      SELECT m.*, u.username as senderName 
      FROM messages m 
      JOIN users u ON m.senderId = u.id 
      WHERE m.receiverId = ? 
      ORDER BY m.createdAt DESC
    `).all(req.params.userId);
    res.json(messages);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

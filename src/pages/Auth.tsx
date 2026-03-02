import { useState } from 'react';
import { UserProfile } from '../types';
import { TrendingUp, ShieldCheck, Zap, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Auth({ onLogin, theme, onToggleTheme }: AuthProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'Novice' | 'Professional' | 'Institutional'>('Novice');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const generateId = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = Math.floor(Math.random() * 5) + 6; // 6-10
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedUsers = localStorage.getItem('simustock_all_users');
    const allUsers: UserProfile[] = savedUsers ? JSON.parse(savedUsers) : [];

    if (isRegistering) {
      if (!username.trim()) {
        setError('请输入用户名');
        return;
      }
      if (!email.trim()) {
        setError('请输入邮箱');
        return;
      }
      if (password.length < 6) {
        setError('密码长度至少为6位');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      // Check for duplicate username
      if (allUsers.some(u => u.username === username)) {
        setError('用户名已存在，请换一个');
        return;
      }

      const newUser: UserProfile = {
        id: generateId(),
        username,
        email,
        password,
        userType,
        balance: 100000,
        portfolio: {},
        trades: [],
        equityHistory: [{ time: new Date().toLocaleTimeString(), value: 100000 }],
        following: [],
        followers: []
      };

      allUsers.push(newUser);
      localStorage.setItem('simustock_all_users', JSON.stringify(allUsers));
      onLogin(newUser);
    } else {
      // Login mode: only use email
      if (!email.trim()) {
        setError('请输入邮箱');
        return;
      }
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('邮箱或密码错误');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 transition-colors duration-300 relative">
      {/* Theme Toggle in Auth Page */}
      <button
        onClick={onToggleTheme}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-rose-500 transition-all shadow-lg"
        title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      >
        {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </button>

      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/40 mb-6">
              <TrendingUp className="text-white w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Simustock</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-3 text-center leading-relaxed">
              行为金融 + 多智能体模拟 <br />
              开启您的专业投资模拟之旅
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 ml-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入您的用户名"
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 ml-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 ml-1">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  required
                />
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 ml-1">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2 ml-1">
                  用户类型
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Novice', 'Professional', 'Institutional'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                        userType === type 
                          ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                          : 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-rose-500/30'
                      }`}
                    >
                      {type === 'Novice' ? '新手' : type === 'Professional' ? '专业' : '机构'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-rose-500 text-xs font-bold text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] mt-4"
            >
              {isRegistering ? '立即注册' : '进入系统'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-[var(--muted-foreground)] hover:text-rose-500 text-xs font-bold transition-colors"
              >
                {isRegistering ? '已有账号？立即登录' : '没有账号？点击注册'}
              </button>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-[var(--muted)] rounded-2xl p-4 border border-[var(--border)]">
              <ShieldCheck className="w-5 h-5 text-rose-400 mb-2" />
              <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">零风险</p>
              <p className="text-[10px] text-[var(--muted-foreground)] opacity-70">全仿真交易环境</p>
            </div>
            <div className="bg-[var(--muted)] rounded-2xl p-4 border border-[var(--border)]">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">实时模拟</p>
              <p className="text-[10px] text-[var(--muted-foreground)] opacity-70">多智能体动态博弈</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

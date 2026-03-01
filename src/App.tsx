import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import AgentLab from './pages/AgentLab';
import Education from './pages/Education';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import MarketCenter from './pages/MarketCenter';
import DataReports from './pages/DataReports';
import Community from './pages/Community';
import MemberCenter from './pages/MemberCenter';
import HelpCenter from './pages/HelpCenter';
import Trade from './pages/Trade';
import Navbar from './components/Navbar';
import { useMarketSimulation } from './hooks/useMarketSimulation';
import { UserProfile } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mas_rl_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mas_rl_user');
    return saved ? JSON.parse(saved) : null;
  });

  const market = useMarketSimulation();

  useEffect(() => {
    localStorage.setItem('mas_rl_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('mas_rl_user', JSON.stringify(user));
    }
  }, [user]);

  // Update equity history every 10 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const currentStocks = market.stocks;
      const stockValue = Object.entries(user.portfolio).reduce((acc, [symbol, amount]) => {
        const stock = currentStocks.find((s: any) => s.symbol === symbol);
        return acc + (stock ? stock.price * amount : 0);
      }, 0);
      
      const totalValue = user.balance + stockValue;
      
      setUser(prev => {
        if (!prev) return null;
        const newHistory = [...prev.equityHistory.slice(-19), { 
          time: new Date().toLocaleTimeString(), 
          value: totalValue 
        }];
        return { ...prev, equityHistory: newHistory };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [user, market.stocks]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans relative transition-colors duration-300">
        <Navbar user={user} theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto py-8 custom-scrollbar transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard user={user} setUser={setUser} market={market} />} />
            <Route path="/market" element={<MarketCenter market={market} />} />
            <Route path="/trade" element={<Trade user={user} setUser={setUser} market={market} />} />
            <Route path="/lab" element={<AgentLab market={market} />} />
            <Route path="/reports" element={<DataReports />} />
            <Route path="/education" element={<Education user={user} setUser={setUser} market={market} />} />
            <Route path="/community" element={<Community user={user} setUser={setUser} />} />
            <Route path="/member" element={<MemberCenter />} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

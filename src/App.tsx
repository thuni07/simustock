import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

import { 
  Keyboard,
  X,
  Zap,
  ShoppingCart,
  Microscope,
  LineChart,
  HelpCircle
} from 'lucide-react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // Find the main scroll container
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mas_rl_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const [showShortcuts, setShowShortcuts] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setShowShortcuts(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) {
    return <Auth onLogin={setUser} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <Router>
      <ScrollToTop />
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

        {/* Global Shortcut Help Modal */}
        {showShortcuts && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
            <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-xl">
                      <Keyboard className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">快捷键清单</h3>
                  </div>
                  <button onClick={() => setShowShortcuts(false)} className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors">
                    <X className="w-5 h-5 text-[var(--muted-foreground)]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">全局操作</h4>
                    <div className="space-y-4">
                      <ShortcutItem keys={['?']} label="显示/隐藏此帮助" />
                      <ShortcutItem keys={['Esc']} label="关闭当前弹窗" />
                      <ShortcutItem keys={['Alt', 'T']} label="切换深色模式" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">交易页面</h4>
                    <div className="space-y-4">
                      <ShortcutItem keys={['B']} label="聚焦买入区域" />
                      <ShortcutItem keys={['S']} label="聚焦卖出区域" />
                      <ShortcutItem keys={['1-4']} label="切换图表周期" />
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-center gap-4">
                  <HelpCircle className="w-6 h-6 text-rose-500" />
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    快捷键仅在未聚焦输入框时有效。部分快捷键可能因浏览器冲突而失效。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

function ShortcutItem({ keys, label }: { keys: string[], label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <div className="flex gap-1">
        {keys.map(key => (
          <kbd key={key} className="px-1.5 py-0.5 bg-[var(--muted)] border border-[var(--border)] rounded text-[10px] font-mono font-bold text-[var(--foreground)] shadow-sm">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

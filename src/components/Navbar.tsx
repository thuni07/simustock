import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown,
  LayoutDashboard,
  LineChart,
  Wallet2,
  Cpu,
  FileText,
  GraduationCap,
  Users2,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import AccountModal from './AccountModal';

interface NavbarProps {
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ user, theme, onToggleTheme }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { label: '首页', path: '/' },
    { label: '行情中心', path: '/market' },
    { label: '模拟交易', path: '/trade' },
    { label: '智能体实验室', path: '/lab' },
    { label: '数据研报', path: '/reports' },
    { label: '教育中心', path: '/education' },
    { label: '社区', path: '/community' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('mas_rl_user');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--border)] h-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-white tracking-tight leading-none">Simustock</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Behavioral Finance</p>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "text-rose-500 bg-rose-500/5" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              )}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right: Theme Toggle + User Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all"
            title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-[var(--muted)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-xs font-bold text-white group-hover:scale-105 transition-transform shadow-lg shadow-rose-500/10">
                {user.username[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                {user.username}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-[var(--border)] mb-2">
                  <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest mb-1">账户余额</p>
                  <p className="text-lg font-mono font-bold text-rose-400">${user.balance.toLocaleString()}</p>
                </div>

                <button 
                  onClick={() => { setIsAccountModalOpen(true); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
                >
                  <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                  账户信息
                </button>
                <NavLink 
                  to="/member" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  会员中心
                </NavLink>
                <NavLink 
                  to="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
                >
                  <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
                  设置
                </NavLink>
                <NavLink 
                  to="/help" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-[var(--muted-foreground)]" />
                  帮助中心
                </NavLink>

                <div className="h-px bg-[var(--border)] my-2" />

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AccountModal 
        user={user} 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
      />
    </nav>
  );
}

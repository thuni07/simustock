import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  GraduationCap, 
  Settings as SettingsIcon, 
  LogOut,
  TrendingUp,
  LineChart,
  FileText,
  Users2,
  Crown,
  HelpCircle,
  Wallet2,
  ChevronRight,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import AccountModal from './AccountModal';

interface SidebarProps {
  user: UserProfile;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Sidebar({ user, theme, setTheme }: SidebarProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  const navItems = [
    { icon: LayoutDashboard, label: '首页看板', path: '/' },
    { icon: LineChart, label: '行情中心', path: '/market' },
    { icon: Wallet2, label: '模拟交易', path: '/trade' },
    { icon: Cpu, label: '智能体实验室', path: '/lab' },
    { icon: FileText, label: '数据研报', path: '/reports' },
    { icon: GraduationCap, label: '教育中心', path: '/education' },
    { icon: Users2, label: 'Simustock 社区', path: '/community' },
  ];

  const bottomNavItems = [
    { icon: Crown, label: '会员中心', path: '/member' },
    { icon: SettingsIcon, label: '设置', path: '/settings' },
    { icon: HelpCircle, label: '帮助中心', path: '/help' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0F0F12] flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Simustock</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Behavioral Finance</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">核心模块</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 transition-colors",
              "group-hover:text-emerald-400"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-white/5">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">账户与支持</p>
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-amber-500/10 text-amber-400" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                "group-hover:text-amber-400"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="flex bg-slate-200 dark:bg-white/5 rounded-xl p-1">
          <button 
            onClick={() => setTheme('light')}
            className={cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all",
              theme === 'light' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all",
              theme === 'dark' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => setIsAccountModalOpen(true)}
          className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all group text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white group-hover:scale-110 transition-transform">
              {user.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.username}</p>
              <p className="text-xs text-slate-500">
                {user.userType === 'Novice' ? '新手用户' : user.userType === 'Professional' ? '专业投资者' : '机构账户'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
              <span>Balance</span>
              <span className="text-emerald-400">${user.balance.toLocaleString()}</span>
            </div>
          </div>
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('mas_rl_user');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      <AccountModal 
        user={user} 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
      />
    </aside>
  );
}

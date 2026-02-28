import { UserProfile } from '../types';
import { User, Shield, Bell, Database, Trash2, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Settings({ user, setUser, theme, setTheme }: SettingsProps) {
  const sections = [
    { icon: User, label: '个人资料', desc: '管理您的公开身份和头像' },
    { icon: Shield, label: '安全设置', desc: '配置多因素身份验证和密钥' },
    { icon: Bell, label: '通知设置', desc: '设置市场冲击和价格波动的提醒' },
    { icon: Database, label: '数据与隐私', desc: '导出交易历史或重置模拟数据' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">设置</h2>
        <p className="text-slate-500">配置您的模拟环境和账户信息</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">外观设置</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">选择您喜欢的界面主题。</p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'light', label: '浅色模式', icon: Sun },
              { id: 'dark', label: '深色模式', icon: Moon },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all",
                  theme === t.id 
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10" 
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10"
                )}
              >
                <t.icon className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <button
              key={section.label}
              className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-3xl p-6 text-left flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <section.icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{section.label}</h4>
                <p className="text-sm text-slate-500">{section.desc}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                配置
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8 flex items-center justify-between">
          <div>
            <h4 className="text-rose-400 font-bold mb-1 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> 危险区域
            </h4>
            <p className="text-sm text-slate-500">重置将清除所有交易历史和持仓数据。</p>
          </div>
          <button 
            onClick={() => {
              if (confirm('确定要重置您的模拟数据吗？')) {
                setUser({
                  ...user,
                  balance: 100000,
                  portfolio: {},
                  trades: []
                } as any);
                alert('模拟重置成功');
              }
            }}
            className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20"
          >
            重置模拟
          </button>
        </div>
      </div>
    </div>
  );
}

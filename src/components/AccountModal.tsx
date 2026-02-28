import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  TrendingUp, 
  Award, 
  Activity,
  Target,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface AccountModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ user, isOpen, onClose }: AccountModalProps) {
  const stats = [
    { label: '总交易次数', value: user.trades.length, icon: Activity, color: 'text-blue-400' },
    { label: '胜率', value: '64%', icon: Target, color: 'text-emerald-400' },
    { label: '最高收益率', value: '+12.5%', icon: TrendingUp, color: 'text-emerald-400' },
    { label: '智能体对抗等级', value: 'Lv.8', icon: Zap, color: 'text-amber-400' },
  ];

  const achievements = [
    { name: '恐慌大师', desc: '在市场恐慌指数 > 80 时成功抄底', icon: Award, color: 'text-rose-400' },
    { name: 'RL 先锋', desc: '完成 10 次强化学习模型训练', icon: Award, color: 'text-blue-400' },
    { name: '理性之光', desc: '连续 5 次交易未受羊群效应影响', icon: Award, color: 'text-emerald-400' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
            <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-300"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center px-8 border-b border-slate-100 dark:border-white/5">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-emerald-500/20">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      {user.userType === 'Novice' ? '新手用户' : user.userType === 'Professional' ? '专业投资者' : '机构账户'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 注册于 2026-01-15
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Info & Stats */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">基本信息</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-300">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-300">用户 ID：<span className="font-mono">{user.id}</span></span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">模拟盘表现</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</p>
                        <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Achievements & Behavioral */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">获得成就</h3>
                  <div className="space-y-3">
                    {achievements.map((ach) => (
                      <div key={ach.name} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-emerald-500/20 transition-all">
                        <div className={cn("w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm", ach.color)}>
                          <ach.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{ach.name}</p>
                          <p className="text-[10px] text-slate-500">{ach.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                  <h4 className="text-sm font-bold text-emerald-500 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> 行为画像
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "您的交易风格趋向于**理性稳健型**。在最近的 10 次模拟中，您成功识别了 3 次羊群效应陷阱，展现了极强的独立思考能力。"
                  </p>
                  <button className="mt-4 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                    查看详细行为研报 <ChevronRight className="w-3 h-3" />
                  </button>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500">账户状态：正常</span>
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-all"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

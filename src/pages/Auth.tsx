import { useState } from 'react';
import { UserProfile } from '../types';
import { TrendingUp, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'Novice' | 'Professional' | 'Institutional'>('Novice');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isRegistering && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = isRegistering 
        ? { username, email, password, userType }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.user;
        onLogin({
          ...userData,
          portfolio: typeof userData.portfolio === 'string' ? JSON.parse(userData.portfolio) : userData.portfolio,
          equityHistory: typeof userData.equityHistory === 'string' ? JSON.parse(userData.equityHistory) : userData.equityHistory,
          trades: [] // Initialize empty trades for new session
        });
      } else {
        setError(data.error || '认证失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-6">
              <TrendingUp className="text-white w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Simustock</h1>
            <p className="text-slate-500 text-sm mt-3 text-center leading-relaxed">
              行为金融 + 多智能体模拟 <br />
              开启您的专业投资模拟之旅
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入您的用户名"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  电子邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入您的密码"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  required
                />
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required
                  />
                </div>
              )}

              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
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
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                        }`}
                      >
                        {type === 'Novice' ? '新手' : type === 'Professional' ? '专业' : '机构'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] mt-4"
            >
              {isLoading ? '处理中...' : (isRegistering ? '立即注册' : '进入系统')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
            >
              {isRegistering ? '已有账号？立即登录' : '没有账号？立即注册'}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">零风险</p>
              <p className="text-[10px] text-slate-400">全仿真交易环境</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">实时模拟</p>
              <p className="text-[10px] text-slate-400">多智能体动态博弈</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

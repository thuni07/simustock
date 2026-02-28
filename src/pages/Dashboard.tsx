import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Flame,
  Globe,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';
import MarketAnalyst from '../components/MarketAnalyst';
import { Stock, UserProfile } from '../types';
import { NavLink } from 'react-router-dom';

interface DashboardProps {
  user: UserProfile;
  setUser: any;
  market: any;
}

export default function Dashboard({ user, setUser, market }: DashboardProps) {
  const { stocks, shocks, agents } = market;

  const marketIndexes = [
    { name: 'Simustock 300', value: 3842.15, change: 1.25, color: 'emerald' },
    { name: '智能体情绪', value: 68, change: 5.4, color: 'blue' },
    { name: '恐慌指数', value: 18.2, change: -2.1, color: 'rose' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Market Indexes - Tonghuashun Style Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketIndexes.map((index) => (
          <motion.div 
            key={index.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex justify-between items-center group hover:border-emerald-500/20 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{index.name}</p>
              <h3 className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tighter">{index.value.toLocaleString()}</h3>
            </div>
            <div className={cn(
              "text-right px-3 py-1 rounded-lg font-bold text-sm",
              index.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}>
              {index.change >= 0 ? '+' : ''}{index.change}%
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">大盘看板</h3>
                  <p className="text-xs text-slate-500">实时模拟市场波动与智能体博弈</p>
                </div>
              </div>
              <div className="flex gap-2">
                {['1H', '1D', '1W', '1M'].map(t => (
                  <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">{t}</button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stocks[0].history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> 热门个股
                </h3>
                <NavLink to="/market" className="text-xs text-slate-500 hover:text-emerald-500 transition-colors">查看全部</NavLink>
              </div>
              <div className="space-y-4">
                {stocks.slice(0, 4).map((stock: Stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:text-emerald-500 transition-colors">
                        {stock.symbol[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{stock.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-slate-900 dark:text-white">${stock.price.toFixed(2)}</p>
                      <p className={cn(
                        "text-[10px] font-bold",
                        stock.change >= 0 ? "text-emerald-500" : "text-rose-400"
                      )}>
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" /> 市场冲击
                </h3>
                <NavLink to="/lab" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">进入实验室</NavLink>
              </div>
              <div className="space-y-4">
                {shocks.slice(0, 3).map((shock: any) => (
                  <div key={shock.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-white/10 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{shock.type}</span>
                      <span className="text-[10px] text-slate-500">{new Date(shock.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{shock.description}</p>
                  </div>
                ))}
                {shocks.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-8">当前市场运行平稳，无重大冲击事件</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">我的账户</p>
                <h3 className="text-2xl font-mono font-bold text-white">${user.balance.toLocaleString()}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">今日盈亏</p>
                <p className="text-sm font-bold text-emerald-400">+$1,240</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">持仓市值</p>
                <p className="text-sm font-bold text-white">$42,850</p>
              </div>
            </div>
            <NavLink 
              to="/trade" 
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              立即交易 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </section>

          <section className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" /> 智能体动态
              </h3>
            </div>
            <div className="space-y-4">
              {agents.map((agent: any) => (
                <div key={agent.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      agent.sentiment > 0 ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{agent.type}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-bold",
                    agent.sentiment > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {(agent.sentiment * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-4">
              <TrendingUp className="w-5 h-5 text-amber-500/30 group-hover:text-amber-500 transition-colors" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">新手训练营</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              亏损后想学习？参加互动训练营，提升您的策略对抗能力。
            </p>
            <NavLink to="/education" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              立即参加 <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <MarketAnalyst 
          market={{ 
            ...market, 
            userBalance: user.balance, 
            userTrades: user.trades 
          }} 
        />
      </div>
    </div>
  );
}

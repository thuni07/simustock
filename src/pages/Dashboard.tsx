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
    { name: '上证指数', value: 3242.15, change: 1.25, points: '+40.12', color: 'rose' },
    { name: '深证成指', value: 11042.85, change: 0.85, points: '+92.45', color: 'rose' },
    { name: '创业板指', value: 2242.15, change: -0.45, points: '-10.12', color: 'emerald' },
  ];

  const risingCount = stocks.filter((s: Stock) => s.changePercent > 0).length;
  const fallingCount = stocks.filter((s: Stock) => s.changePercent < 0).length;
  const neutralCount = stocks.length - risingCount - fallingCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Market Indices - Professional Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketIndexes.map((index) => (
          <motion.div 
            key={index.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col hover:bg-[var(--muted)] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-[var(--muted-foreground)]">{index.name}</span>
              <div className={cn(
                "text-xs font-bold px-2 py-0.5 rounded",
                index.change >= 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                {index.change >= 0 ? '+' : ''}{index.change}%
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className={cn(
                "text-2xl font-mono font-bold tracking-tighter",
                index.change >= 0 ? "text-rose-500" : "text-emerald-500"
              )}>
                {index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <span className={cn(
                "text-sm font-mono font-bold",
                index.change >= 0 ? "text-rose-500" : "text-emerald-500"
              )}>
                {index.points}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Market Heat & Main Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Market Heat Indicator */}
          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> 市场温度
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className="text-rose-500">上涨 {risingCount}</span>
                <span className="text-[var(--muted-foreground)]">平盘 {neutralCount}</span>
                <span className="text-emerald-500">下跌 {fallingCount}</span>
              </div>
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
              <div className="bg-rose-500 transition-all duration-1000" style={{ width: `${(risingCount / stocks.length) * 100}%` }} />
              <div className="bg-slate-700 transition-all duration-1000" style={{ width: `${(neutralCount / stocks.length) * 100}%` }} />
              <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${(fallingCount / stocks.length) * 100}%` }} />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-xs text-slate-500 italic">当前市场情绪：<span className="text-white font-bold">活跃</span></p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={cn(
                    "w-1 h-3 rounded-full",
                    i < 7 ? "bg-orange-500" : "bg-white/10"
                  )} />
                ))}
              </div>
            </div>
          </section>

          {/* Main Chart */}
          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-[var(--foreground)]">分时走势</h3>
              </div>
              <div className="flex bg-[var(--muted)] p-1 rounded-xl">
                {['分时', '5日', '日K', '周K'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                    t === '分时' ? "bg-rose-500 text-white shadow-lg" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stocks[0].history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f43f5e' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f43f5e" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Sector & Hot Stocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" /> 领涨板块
              </h3>
              <div className="space-y-3">
                {[
                  { name: '人工智能', change: '+3.45%', leader: 'TECH' },
                  { name: '半导体', change: '+2.82%', leader: 'CHIP' },
                  { name: '生物医药', change: '+1.95%', leader: 'BIO' },
                  { name: '新能源车', change: '+1.54%', leader: 'EV' },
                ].map((sector) => (
                  <div key={sector.name} className="flex justify-between items-center p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--border)] transition-all cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)]">{sector.name}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">领涨股: {sector.leader}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-rose-500">{sector.change}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> 热门个股
              </h3>
              <div className="space-y-3">
                {stocks.slice(0, 4).map((stock: Stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--border)] transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center font-bold text-xs text-[var(--muted-foreground)]">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">{stock.symbol}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-[var(--foreground)]">${stock.price.toFixed(2)}</p>
                      <p className={cn(
                        "text-[10px] font-bold",
                        stock.changePercent >= 0 ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column - Account & News */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-gradient-to-br from-rose-600 to-orange-700 rounded-3xl p-6 shadow-xl shadow-rose-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-rose-200 uppercase tracking-widest">我的总资产</p>
                <h3 className="text-2xl font-mono font-bold text-white">${user.balance.toLocaleString()}</h3>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-200">今日盈亏</span>
                <span className="text-white font-bold">+$1,240.50 (+1.2%)</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white w-2/3" />
              </div>
            </div>
            <NavLink 
              to="/trade" 
              className="w-full py-3 bg-white text-rose-600 font-bold rounded-xl transition-all hover:bg-rose-50 flex items-center justify-center gap-2"
            >
              去交易 <ChevronRight className="w-4 h-4" />
            </NavLink>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> 7x24 快讯
            </h3>
            <div className="space-y-6 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-[var(--border)]">
              {[
                { time: '10:24', text: 'Simustock 300 指数早盘拉升，人工智能板块领涨。', type: '行情' },
                { time: '10:15', text: '某机构智能体触发大额买入指令，市场情绪回暖。', type: '异动' },
                { time: '09:50', text: '政策智能体发布最新指引，鼓励长期价值投资。', type: '政策' },
              ].map((news, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{news.time}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded font-bold">{news.type}</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{news.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-[10px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">查看更多快讯</button>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" /> 智能体情绪分布
            </h3>
            <div className="space-y-4">
              {agents.map((agent: any) => (
                <div key={agent.id} className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[var(--muted-foreground)] font-bold uppercase tracking-wider">{agent.type}</span>
                    <span className={cn(
                      "font-mono font-bold",
                      agent.sentiment > 0 ? "text-rose-500" : "text-emerald-500"
                    )}>
                      {agent.sentiment > 0 ? '看多' : '看空'} {(Math.abs(agent.sentiment) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden flex">
                    <div 
                      className={cn("h-full transition-all duration-1000", agent.sentiment > 0 ? "bg-rose-500" : "bg-emerald-500")} 
                      style={{ width: `${(Math.abs(agent.sentiment) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6">
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

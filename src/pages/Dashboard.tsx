import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  ShieldAlert
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
import { useNavigate, NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import MarketAnalyst from '../components/MarketAnalyst';
import { Stock, UserProfile } from '../types';
import { MARKET_NEWS } from '../constants';

interface DashboardProps {
  user: UserProfile;
  setUser: any;
  market: any;
}

export default function Dashboard({ user, setUser, market }: DashboardProps) {
  const navigate = useNavigate();
  const { stocks, shocks, agents } = market;
  const [chartType, setChartType] = useState('分时');
  const [selectedStockSymbol, setSelectedStockSymbol] = useState('TECH');
  const sliderRef = useRef<HTMLDivElement>(null);

  const selectedStock = useMemo(() => 
    stocks.find((s: Stock) => s.symbol === selectedStockSymbol) || stocks[0]
  , [stocks, selectedStockSymbol]);

  const generateIntradayData = (finalChange: number, basePrice: number) => {
    const data = [];
    const startPrice = basePrice / (1 + finalChange / 100);
    
    for (let i = 0; i < 60; i++) {
      const progress = i / 59;
      const noise = (Math.random() - 0.5) * (startPrice * 0.01);
      const trend = (finalChange / 100) * progress * startPrice;
      data.push({
        time: `${9 + Math.floor(i / 15)}:${((i % 15) * 4).toString().padStart(2, '0')}`,
        price: startPrice + trend + noise
      });
    }
    return data;
  };

  const getChartData = () => {
    if (chartType === '分时') {
      return generateIntradayData(selectedStock.changePercent, selectedStock.price);
    }
    
    const baseData = selectedStock.history;
    switch (chartType) {
      case '5日':
        return Array.from({ length: 100 }, (_, i) => ({
          time: `Day ${Math.floor(i / 20) + 1}`,
          price: baseData[i % 20].price + (Math.random() - 0.5) * 5
        }));
      case '日K':
        return Array.from({ length: 30 }, (_, i) => ({
          time: `2024-02-${i + 1}`,
          price: selectedStock.price * 0.9 + Math.sin(i / 5) * 20 + Math.random() * 10
        }));
      case '周K':
        return Array.from({ length: 12 }, (_, i) => ({
          time: `Week ${i + 1}`,
          price: selectedStock.price * 0.8 + i * 5 + Math.random() * 15
        }));
      default:
        return baseData;
    }
  };

  const marketIndexes = [
    { name: 'Simustock 300', value: 4523.67, change: 0.85, points: '+38.45', color: 'rose' },
    { name: 'Simustock 100', value: 3245.78, change: -1.25, points: '-40.57', color: 'emerald' },
    { name: 'Simustock 50', value: 2156.43, change: -2.30, points: '-50.75', color: 'emerald' },
  ];

  const totalSimulatedStocks = 3000;
  const risingCount = 1024;
  const fallingCount = 1742;
  const neutralCount = 234;

  const sectors = [
    { name: '人工智能', change: '-5.98%', leader: 'TECH' },
    { name: '半导体', change: '-5.53%', leader: 'CHIP' },
    { name: '生物医药', change: '-6.11%', leader: 'BIO' },
    { name: '新能源车', change: '-6.45%', leader: 'EV' },
    { name: '金融科技', change: '-7.18%', leader: 'BANK' },
    { name: '工业互联', change: '-5.39%', leader: 'IND' },
  ];

  const [currentAnomalyIndex, setCurrentAnomalyIndex] = useState(0);
  const anomalies = [
    { time: '10:24', text: '机构大单买入 TECH，成交量激增 300%', type: '大单', icon: <BarChart3 className="w-3 h-3" /> },
    { time: '10:15', text: '恐慌抛售警报：BIO 触发止损位，散户情绪极度看空', type: '恐慌', icon: <ShieldAlert className="w-3 h-3" /> },
    { time: '09:50', text: '板块集体拉升：半导体板块 12 只成分股全线上涨', type: '板块', icon: <TrendingUp className="w-3 h-3" /> },
    { time: '09:30', text: '智能体连续吸筹：机构智能体在 AI 底部持续挂单', type: '吸筹', icon: <Zap className="w-3 h-3" /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnomalyIndex(prev => (prev + 1) % anomalies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [anomalies.length]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 360;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Market Indices & Hot Stocks Slider */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
        {/* Indices Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[var(--border)]">
          {marketIndexes.map((index) => (
            <div 
              key={index.name}
              onClick={() => navigate('/market')}
              className="p-6 flex flex-col hover:bg-[var(--muted)] transition-all cursor-pointer group border-r last:border-r-0 border-[var(--border)]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-[var(--muted-foreground)] group-hover:text-rose-500 transition-colors">{index.name}</span>
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
            </div>
          ))}
        </div>

        {/* Hot Stocks Slider */}
        <div className="relative group/slider px-12 py-4 bg-[var(--muted)]/30">
          <button 
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-lg z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--foreground)]" />
          </button>
          
          <div 
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {stocks.slice(0, 10).map((stock: Stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStockSymbol(stock.symbol)}
                className={cn(
                  "flex-shrink-0 w-32 p-3 rounded-2xl border transition-all text-left",
                  selectedStockSymbol === stock.symbol 
                    ? "bg-rose-500 border-rose-600 shadow-lg shadow-rose-500/20" 
                    : "bg-[var(--card)] border-[var(--border)] hover:border-rose-500/50"
                )}
              >
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mb-1",
                  selectedStockSymbol === stock.symbol ? "text-rose-100" : "text-[var(--muted-foreground)]"
                )}>{stock.symbol}</p>
                <p className={cn(
                  "text-sm font-mono font-bold mb-1",
                  selectedStockSymbol === stock.symbol ? "text-white" : "text-[var(--foreground)]"
                )}>{stock.price.toFixed(2)}</p>
                <p className={cn(
                  "text-[10px] font-bold",
                  selectedStockSymbol === stock.symbol 
                    ? "text-rose-100" 
                    : stock.changePercent >= 0 ? "text-rose-500" : "text-emerald-500"
                )}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-lg z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-[var(--foreground)]" />
          </button>
        </div>
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
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-[var(--muted)]">
              <div className="bg-rose-500 transition-all duration-1000" style={{ width: `${(risingCount / totalSimulatedStocks) * 100}%` }} />
              <div className="bg-[var(--muted-foreground)] opacity-30 transition-all duration-1000" style={{ width: `${(neutralCount / totalSimulatedStocks) * 100}%` }} />
              <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${(fallingCount / totalSimulatedStocks) * 100}%` }} />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-xs text-[var(--muted-foreground)] italic">当前市场情绪：<span className="text-[var(--foreground)] font-bold">活跃</span></p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={cn(
                    "w-1 h-3 rounded-full",
                    i < 7 ? "bg-orange-500" : "bg-[var(--border)]"
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
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {selectedStock.name} ({selectedStock.symbol}) {chartType}走势
                </h3>
              </div>
              <div className="flex bg-[var(--muted)] p-1 rounded-xl">
                {['分时', '5日', '日K', '周K'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setChartType(t)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                      t === chartType ? "bg-rose-500 text-white shadow-lg" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f43f5e' }}
                  />
                  <Area 
                    key={chartType}
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f43f5e" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={2}
                    animationDuration={800}
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
                {sectors.map((sector) => (
                  <div 
                    key={sector.name} 
                    onClick={() => navigate(`/market?sector=${sector.name}`)}
                    className="flex justify-between items-center p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--border)] transition-all cursor-pointer group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)] group-hover:text-rose-500 transition-colors">{sector.name}</p>
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
                {stocks.slice(0, 6).map((stock: Stock) => (
                  <div 
                    key={stock.symbol} 
                    onClick={() => navigate(`/trade?symbol=${stock.symbol}`)}
                    className="flex justify-between items-center p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--border)] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        {stock.symbol[0]}
                      </div>
                      <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-rose-500 transition-colors">{stock.symbol}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-mono font-bold text-[var(--foreground)]">${stock.price.toFixed(2)}</p>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        stock.changePercent >= 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
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

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> 异动雷达
            </h3>
            <div className="relative h-24">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentAnomalyIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => navigate('/market#news-section')}
                  className="absolute inset-0 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl cursor-pointer hover:bg-amber-500/10 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-amber-500/20 rounded text-amber-500">
                        {anomalies[currentAnomalyIndex].icon}
                      </div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{anomalies[currentAnomalyIndex].type}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{anomalies[currentAnomalyIndex].time}</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{anomalies[currentAnomalyIndex].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <button 
              onClick={() => navigate('/market#news-section')}
              className="w-full mt-4 py-2 text-[10px] font-bold text-[var(--muted-foreground)] hover:text-rose-500 transition-colors flex items-center justify-center gap-1"
            >
              查看全部异动 <ChevronRight className="w-3 h-3" />
            </button>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> 7x24 快讯
            </h3>
            <div className="space-y-6 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-[var(--border)]">
              {MARKET_NEWS.slice(0, 3).map((news, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{news.time}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold">{news.type}</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{news.text}</p>
                </div>
              ))}
            </div>
            <NavLink 
              to="/market#news-section"
              className="w-full mt-6 py-2 text-[10px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors block text-center"
            >
              查看更多快讯 →
            </NavLink>
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  History,
  PieChart,
  ShoppingCart,
  Zap,
  AlertCircle
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
import { Stock, UserProfile } from '../types';

interface TradeProps {
  user: UserProfile;
  setUser: any;
  market: any;
}

export default function Trade({ user, setUser, market }: TradeProps) {
  const { stocks } = market;
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[0]);
  const [amount, setAmount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio' | 'history'>('trade');

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const totalCost = selectedStock.price * amount;
    
    if (type === 'BUY') {
      if (user.balance < totalCost) {
        alert('余额不足');
        return;
      }
      
      setUser((prev: UserProfile) => ({
        ...prev,
        balance: prev.balance - totalCost,
        portfolio: {
          ...prev.portfolio,
          [selectedStock.symbol]: (prev.portfolio[selectedStock.symbol] || 0) + amount
        },
        trades: [
          {
            id: Math.random().toString(36).substr(2, 9),
            symbol: selectedStock.symbol,
            type: 'BUY',
            price: selectedStock.price,
            amount,
            timestamp: Date.now()
          },
          ...prev.trades
        ]
      }));
    } else {
      const currentAmount = user.portfolio[selectedStock.symbol] || 0;
      if (currentAmount < amount) {
        alert('持仓不足');
        return;
      }
      
      setUser((prev: UserProfile) => ({
        ...prev,
        balance: prev.balance + totalCost,
        portfolio: {
          ...prev.portfolio,
          [selectedStock.symbol]: currentAmount - amount
        },
        trades: [
          {
            id: Math.random().toString(36).substr(2, 9),
            symbol: selectedStock.symbol,
            type: 'SELL',
            price: selectedStock.price,
            amount,
            timestamp: Date.now()
          },
          ...prev.trades
        ]
      }));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">模拟交易</h2>
          <p className="text-slate-500">实时博弈，测试您的投资策略与心理素质</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'trade', label: '交易界面', icon: ShoppingCart },
            { id: 'portfolio', label: '我的持仓', icon: PieChart },
            { id: 'history', label: '历史成交', icon: History }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'trade' && (
          <motion.div 
            key="trade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-2xl text-emerald-400">
                      {selectedStock.symbol[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedStock.name}</h3>
                      <p className="text-slate-500 font-mono">{selectedStock.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-mono font-bold text-white">${selectedStock.price.toFixed(2)}</p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 text-sm font-bold",
                      selectedStock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {selectedStock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(selectedStock.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedStock.history}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">恐慌指数</p>
                    <p className="text-xl font-mono font-bold text-white">{selectedStock.panicIndex.toFixed(0)}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">羊群效应</p>
                    <p className="text-xl font-mono font-bold text-white">{selectedStock.herdingIntensity.toFixed(0)}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">智能体情绪</p>
                    <p className={cn(
                      "text-xl font-bold",
                      selectedStock.sentiment > 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {selectedStock.sentiment > 0 ? '乐观' : '悲观'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-8">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> 快速交易
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">可用余额</span>
                      <span className="text-white font-bold">${user.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">当前持仓</span>
                      <span className="text-white font-bold">{user.portfolio[selectedStock.symbol] || 0} 股</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        placeholder="交易数量"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">股</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-slate-500">预计总额</span>
                      <span className="text-xl font-mono font-bold text-white">${(selectedStock.price * amount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => handleTrade('BUY')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      买入 {selectedStock.symbol}
                    </button>
                    <button 
                      onClick={() => handleTrade('SELL')}
                      className="flex-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                      卖出 {selectedStock.symbol}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-8">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> 市场自选
                </h4>
                <div className="space-y-4">
                  {stocks.map((stock: Stock) => (
                    <button 
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className={cn(
                        "w-full flex justify-between items-center p-4 rounded-2xl border transition-all group",
                        selectedStock.symbol === stock.symbol 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="text-left">
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{stock.symbol}</p>
                        <p className="text-[10px] text-slate-500">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-white">${stock.price.toFixed(2)}</p>
                        <p className={cn(
                          "text-[10px] font-bold",
                          stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-white">交易提示</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  当前处于模拟盘交易时段。请注意，智能体实验室正在模拟“宏观经济波动”，部分股票可能出现非理性波动。
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div 
            key="portfolio"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-10"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">账户总资产</p>
                <h3 className="text-4xl font-mono font-bold text-white">
                  ${(user.balance + Object.entries(user.portfolio).reduce((acc, [symbol, amount]) => {
                    const stock = stocks.find((s: any) => s.symbol === symbol);
                    return acc + (stock ? stock.price * amount : 0);
                  }, 0)).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">股票</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">持仓数量</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">当前价</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">持仓市值</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">盈亏</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(user.portfolio).filter(([_, amount]) => amount > 0).map(([symbol, amount]) => {
                    const stock = stocks.find((s: any) => s.symbol === symbol);
                    const marketValue = stock ? stock.price * amount : 0;
                    return (
                      <tr key={symbol} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-emerald-400">
                              {symbol[0]}
                            </div>
                            <span className="font-bold text-white">{symbol}</span>
                          </div>
                        </td>
                        <td className="py-6 font-mono text-slate-300">{amount}</td>
                        <td className="py-6 font-mono text-slate-300">${stock?.price.toFixed(2)}</td>
                        <td className="py-6 font-mono text-white font-bold">${marketValue.toLocaleString()}</td>
                        <td className="py-6">
                          <span className="text-emerald-400 font-bold">+12.4%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-10"
          >
            <div className="space-y-6">
              {user.trades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold",
                      trade.type === 'BUY' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                      {trade.type === 'BUY' ? '买' : '卖'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{trade.symbol}</h4>
                      <p className="text-xs text-slate-500">{new Date(trade.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-white font-bold">${(trade.price * trade.amount).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{trade.amount} 股 @ ${trade.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

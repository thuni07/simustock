import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Stock } from '../types';
import { cn } from '../lib/utils';

interface MarketCenterProps {
  market: any;
}

export default function MarketCenter({ market }: MarketCenterProps) {
  const { stocks } = market;
  const [activeTab, setActiveTab] = useState('A股');

  const tabs = ['自选', 'A股', '港股', '美股', '概念', '行业'];

  // Sort stocks for sidebars
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">行情中心</h2>
          <p className="text-[var(--muted-foreground)] text-sm">全市场实时行情数据与行为金融指标</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="搜索股票代码/名称" 
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
          </div>
          <button className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--muted-foreground)] flex items-center gap-2 hover:bg-[var(--muted)] transition-colors">
            <Filter className="w-4 h-4" /> 筛选
          </button>
        </div>
      </header>

      {/* Market Tabs */}
      <div className="flex border-b border-[var(--border)] gap-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === tab ? "text-rose-500" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stock List */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--muted)]">
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">代码名称</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-right">最新价</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-right">涨跌幅</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-right">成交额</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">市场情绪</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {stocks.map((stock: Stock) => (
                    <tr key={stock.symbol} className="hover:bg-[var(--muted)] transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg",
                            stock.changePercent >= 0 ? "bg-gradient-to-br from-rose-500 to-orange-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"
                          )}>
                            {stock.symbol[0]}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--foreground)] group-hover:text-rose-500 transition-colors">{stock.symbol}</p>
                            <p className="text-[10px] text-[var(--muted-foreground)]">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "px-6 py-4 font-mono font-bold text-right",
                        stock.changePercent >= 0 ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={cn(
                          "inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg",
                          stock.changePercent >= 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[var(--muted-foreground)] text-right text-sm">
                        {(stock.price * 1240).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden max-w-[80px]">
                            <div 
                              className={cn("h-full transition-all duration-1000", stock.sentiment > 0 ? "bg-rose-500" : "bg-emerald-500")}
                              style={{ width: `${(Math.abs(stock.sentiment) * 100)}%` }}
                            />
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold",
                            stock.sentiment > 0 ? "text-rose-500" : "text-emerald-500"
                          )}>
                            {stock.sentiment > 0 ? '看多' : '看空'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Rankings */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-[#16161A] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" /> 涨幅榜
              </h3>
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-4">
              {topGainers.map((stock, i) => (
                <div key={stock.symbol} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-rose-500 transition-colors">{stock.symbol}</p>
                      <p className="text-[10px] text-slate-500">{stock.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-500">+{stock.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#16161A] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" /> 跌幅榜
              </h3>
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-4">
              {topLosers.map((stock, i) => (
                <div key={stock.symbol} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-500 transition-colors">{stock.symbol}</p>
                      <p className="text-[10px] text-slate-500">{stock.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-500">{stock.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">异动雷达</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              检测到 <span className="text-white font-bold">TECH</span> 出现机构大单买入，羊群效应强度正在上升，建议关注。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

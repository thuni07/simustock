import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter
} from 'lucide-react';
import { Stock } from '../types';
import { cn } from '../lib/utils';

interface MarketCenterProps {
  market: any;
}

export default function MarketCenter({ market }: MarketCenterProps) {
  const { stocks } = market;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">行情中心</h2>
          <p className="text-slate-500">传统行情数据 + 行为金融特色指标</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索股票代码/名称" 
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" /> 筛选
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-none">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">股票名称</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">最新价</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">涨跌幅</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">恐慌指数</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">羊群效应</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">智能体情绪</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {stocks.map((stock: Stock) => (
              <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-emerald-500 dark:text-emerald-400">
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{stock.symbol}</p>
                      <p className="text-[10px] text-slate-500">{stock.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">${stock.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-bold",
                    stock.change >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                  )}>
                    {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                      <div 
                        className={cn("h-full transition-all duration-500", stock.panicIndex > 50 ? "bg-rose-500" : "bg-emerald-500")}
                        style={{ width: `${stock.panicIndex}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400">{stock.panicIndex.toFixed(0)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${stock.herdingIntensity}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400">{stock.herdingIntensity.toFixed(0)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md inline-block",
                    stock.sentiment > 0 ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                  )}>
                    {stock.sentiment > 0 ? '乐观' : '悲观'} ({(stock.sentiment * 100).toFixed(0)}%)
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h4 className="font-bold text-slate-900 dark:text-white">热门板块</h4>
          </div>
          <div className="space-y-3">
            {['人工智能', '生物医药', '绿色能源'].map(tag => (
              <div key={tag} className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">{tag}</span>
                <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">+2.45%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-slate-900 dark:text-white">异动提醒</h4>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">TECH 触发羊群效应警报，波动率激增</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">BIO 出现恐慌性抛售迹象，机构正在吸筹</p>
          </div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-slate-900 dark:text-white">市场温度</h4>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">68°C</div>
          <p className="text-xs text-slate-500">当前市场处于“活跃”状态，智能体情绪偏向乐观</p>
        </div>
      </div>
    </div>
  );
}

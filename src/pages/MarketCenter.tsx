import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  BarChart3,
  ShoppingCart,
  Zap,
  Microscope,
  ArrowUpDown,
  X,
  Info,
  Settings,
  LayoutGrid,
  List,
  Newspaper,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Stock } from '../types';
import { cn } from '../lib/utils';
import { MARKET_NEWS } from '../constants';

interface MarketCenterProps {
  market: any;
}

export default function MarketCenter({ market }: MarketCenterProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stocks } = market;
  
  const sectorParam = searchParams.get('sector');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || (sectorParam ? '行业' : 'A股'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Stock | 'volume_val', direction: 'asc' | 'desc' } | null>(null);
  const [selectedStockForPreview, setSelectedStockForPreview] = useState<Stock | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [newsFilter, setNewsFilter] = useState('全部');
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);
  const [newsScrollIndex, setNewsScrollIndex] = useState(0);

  const newsCategories = ['全部', '行情', '智能体', '异动', '政策', '板块', '大单', '热点'];

  const filteredNews = useMemo(() => {
    if (newsFilter === '全部') return MARKET_NEWS;
    return MARKET_NEWS.filter(n => n.type === newsFilter);
  }, [newsFilter]);

  useEffect(() => {
    if (isNewsExpanded) return;
    const timer = setInterval(() => {
      setNewsScrollIndex(prev => (prev + 1) % Math.max(1, filteredNews.length));
    }, 4000);
    return () => clearInterval(timer);
  }, [filteredNews.length, isNewsExpanded]);

  const tabs = ['自选', 'A股', '港股', '美股', '概念', '行业'];

  const handleSort = (key: keyof Stock | 'volume_val') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const suggestions = useMemo(() => {
    if (searchQuery.length < 1) return [];
    const q = searchQuery.toLowerCase();
    return stocks.filter(s => 
      s.symbol.toLowerCase().includes(q) || 
      s.name.toLowerCase().includes(q) ||
      s.code.includes(q)
    ).slice(0, 8);
  }, [stocks, searchQuery]);

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    // Search filtering (Highest priority)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.symbol.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) ||
        s.code.includes(q)
      );
    }

    // Sector filtering
    if (sectorParam) {
      result = result.filter((s: Stock) => s.sector === sectorParam);
    } else if (!searchQuery) {
      // Tab filtering only if no search and no sector param
      switch (activeTab) {
        case '自选':
          result = result.filter((_: any, i: number) => i % 5 === 0);
          break;
        case 'A股':
          result = result.filter((s: Stock) => s.code.startsWith('600'));
          break;
        case '港股':
          result = result.filter((s: Stock) => s.code.startsWith('00'));
          break;
        case '美股':
          result = result.filter((s: Stock) => s.sector === '人工智能' || s.sector === '半导体');
          break;
        case '概念':
          result = result.filter((s: Stock) => s.sector === '生物医药' || s.sector === '新能源车');
          break;
        case '行业':
          result = result.filter((s: Stock) => s.sector === '金融科技' || s.sector === '工业互联');
          break;
      }
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof Stock];
        let bVal: any = b[sortConfig.key as keyof Stock];
        
        if (sortConfig.key === 'volume_val') {
          aVal = a.price * a.volume;
          bVal = b.price * b.volume;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stocks, activeTab, searchQuery, sortConfig, sectorParam]);

  // Sort stocks for sidebars
  const topGainers = useMemo(() => [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10), [stocks]);
  const topLosers = useMemo(() => [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 10), [stocks]);

  const SortHeader = ({ label, sortKey, align = 'left', width }: { label: string, sortKey: keyof Stock | 'volume_val', align?: 'left' | 'right' | 'center', width?: string }) => (
    <th 
      className={cn(
        "px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest cursor-pointer hover:text-[var(--foreground)] transition-colors",
        align === 'right' && "text-right",
        align === 'center' && "text-center",
        width
      )}
      onClick={() => handleSort(sortKey)}
    >
      <div className={cn("flex items-center gap-1", align === 'right' && "justify-end", align === 'center' && "justify-center")}>
        {label}
        <ArrowUpDown className={cn("w-3 h-3 opacity-30", sortConfig?.key === sortKey && "opacity-100 text-rose-500")} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">行情中心</h2>
          <p className="text-[var(--muted-foreground)] text-sm">全市场实时行情数据与行为金融指标</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto relative">
          <div className="flex bg-[var(--muted)] p-1 rounded-xl border border-[var(--border)]">
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-rose-500 text-white shadow-sm" : "text-[var(--muted-foreground)]")}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-rose-500 text-white shadow-sm" : "text-[var(--muted-foreground)]")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="搜索代码/名称/缩写" 
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-10 pr-24 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <span className="text-[10px] font-bold text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded">
                  {filteredAndSortedStocks.length}
                </span>
              )}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-[var(--muted)] rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-[var(--muted-foreground)]" />
                </button>
              )}
            </div>
            
            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-20"
                  >
                    <div className="px-4 py-2 bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">搜索建议</div>
                    {suggestions.map(s => (
                      <button 
                        key={s.symbol}
                        onClick={() => {
                          setSearchQuery(s.symbol);
                          setShowSuggestions(false);
                          setSelectedStockForPreview(s);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--muted)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[var(--muted-foreground)]">{s.code}</span>
                          <div>
                            <span className="font-bold text-[var(--foreground)]">{s.name}</span>
                            <span className="ml-2 text-[10px] text-rose-500 font-bold">({s.symbol})</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--muted)] rounded text-[var(--muted-foreground)]">{s.sector}</span>
                      </button>
                    ))}
                    <button 
                      onClick={() => setShowSuggestions(false)}
                      className="w-full py-2 text-center text-[10px] font-bold text-rose-500 hover:bg-rose-500/5 transition-colors border-t border-[var(--border)]"
                    >
                      查看全部 {filteredAndSortedStocks.length} 条结果
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
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

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">热门筛选:</span>
          <button 
            onClick={() => {
              setSearchParams({});
              setSearchQuery('');
            }}
            className={cn(
              "px-3 py-1 border rounded-full text-[10px] font-bold transition-all",
              (!sectorParam && !searchQuery) ? "border-rose-500 text-rose-500 bg-rose-500/5" : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-rose-500/50 hover:text-rose-500"
            )}
          >
            全部股票
          </button>
          {['人工智能', '半导体', '生物医药', '新能源车', '金融科技', '工业互联'].map(s => (
            <button 
              key={s}
              onClick={() => setSearchParams({ sector: s })}
              className={cn(
                "px-3 py-1 bg-[var(--card)] border rounded-full text-[10px] font-bold transition-all",
                sectorParam === s ? "border-rose-500 text-rose-500 bg-rose-500/5" : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-rose-500/50 hover:text-rose-500"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        
        {(searchQuery || sectorParam) && (
          <div className="flex items-center gap-2">
            <div className="w-px h-4 bg-[var(--border)] mx-2" />
            <span className="text-[10px] text-[var(--muted-foreground)]">
              当前{searchQuery ? `搜索："${searchQuery}"` : `筛选：${sectorParam}板块`} · 共 {filteredAndSortedStocks.length} 只个股
            </span>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-[10px] font-bold text-rose-500 hover:underline"
            >
              [清除]
            </button>
          </div>
        )}
      </div>

      {sectorParam && (
        <div className="flex items-center justify-between p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
          <p className="text-sm text-[var(--foreground)] font-bold">
            当前板块：<span className="text-rose-500">{sectorParam}</span>
          </p>
          <button 
            onClick={() => setSearchParams({})}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            [返回全部]
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Main Stock List */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--muted)]">
                    <SortHeader label="代码" sortKey="code" width="w-[80px]" />
                    <SortHeader label="名称" sortKey="name" width="w-[200px]" />
                    <SortHeader label="最新价" sortKey="price" align="right" width="w-[100px]" />
                    <SortHeader label="涨跌幅" sortKey="changePercent" align="right" width="w-[100px]" />
                    <SortHeader label="成交额" sortKey="volume_val" align="right" width="w-[120px]" />
                    <SortHeader label="市场情绪" sortKey="sentiment" align="center" width="w-[100px]" />
                    <th className="px-6 py-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-center w-[100px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredAndSortedStocks.slice(0, 20).map((stock: Stock) => (
                    <tr 
                      key={stock.symbol} 
                      onClick={() => setSelectedStockForPreview(stock)}
                      className={cn(
                        "hover:bg-[var(--muted)] transition-colors group cursor-pointer",
                        selectedStockForPreview?.symbol === stock.symbol && "bg-[var(--muted)]"
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-[var(--muted-foreground)] w-[80px]">
                        {stock.code}
                      </td>
                      <td className="px-6 py-4 w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-[10px] shrink-0",
                            stock.changePercent >= 0 ? "bg-gradient-to-br from-rose-500 to-orange-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"
                          )}>
                            {stock.symbol[0]}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-sm text-[var(--foreground)] group-hover:text-rose-500 transition-colors truncate">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "px-6 py-4 font-mono font-bold text-right w-[100px]",
                        stock.changePercent >= 0 ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right w-[100px]">
                        <div className={cn(
                          "inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg",
                          stock.changePercent >= 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[var(--muted-foreground)] text-right text-sm w-[120px]">
                        {(stock.price * 1240).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden max-w-[60px]">
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
                      <td className="px-6 py-4 w-[100px]">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/trade?symbol=${stock.symbol}`);
                            }}
                            className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-500"
                            title="立即交易"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/lab?symbol=${stock.symbol}&mode=config`);
                            }}
                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-blue-500"
                            title="模拟此股"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/lab?symbol=${stock.symbol}&mode=pk`);
                            }}
                            className="p-2 hover:bg-amber-500/10 rounded-lg transition-colors text-amber-500"
                            title="策略对抗"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
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
          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" /> 涨幅榜
              </h3>
              <BarChart3 className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <div className="space-y-4">
              {topGainers.map((stock, i) => (
                <div 
                  key={stock.symbol} 
                  onClick={() => navigate(`/trade?symbol=${stock.symbol}`)}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] opacity-50 w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)] group-hover:text-rose-500 transition-colors">{stock.name} ({stock.symbol})</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-500">+{stock.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" /> 跌幅榜
              </h3>
              <BarChart3 className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <div className="space-y-4">
              {topLosers.map((stock, i) => (
                <div 
                  key={stock.symbol} 
                  onClick={() => navigate(`/trade?symbol=${stock.symbol}`)}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] opacity-50 w-4">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">{stock.name} ({stock.symbol})</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-500">{stock.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">异动雷达</h4>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                  检测到 <span className="text-[var(--foreground)] font-bold">TECH</span> 出现机构大单买入，成交量激增。
                </p>
                <button 
                  onClick={() => navigate('/trade?symbol=TECH&source=radar')}
                  className="p-1 hover:bg-rose-500/10 rounded text-rose-500"
                >
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                  <span className="text-[var(--foreground)] font-bold">BIO</span> 触发恐慌抛售警报，散户情绪极度看空。
                </p>
                <button 
                  onClick={() => navigate('/lab?mode=config&scenario=panic&symbol=BIO')}
                  className="p-1 hover:bg-blue-500/10 rounded text-blue-500"
                >
                  <Microscope className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                  <span className="text-[var(--foreground)] font-bold">半导体</span> 板块集体拉升，成分股全线上涨。
                </p>
                <button 
                  onClick={() => navigate('/market?tab=美股')}
                  className="p-1 hover:bg-amber-500/10 rounded text-amber-500"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market News Section */}
      <section id="news-section" className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Newspaper className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">市场快讯</h3>
              <p className="text-xs text-[var(--muted-foreground)]">实时追踪智能体动向与市场异动</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {newsCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setNewsFilter(cat);
                  setNewsScrollIndex(0);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold transition-all",
                  newsFilter === cat 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden",
            isNewsExpanded ? "max-h-[800px] overflow-y-auto custom-scrollbar" : "max-h-[80px]"
          )}>
            <div className="divide-y divide-[var(--border)]">
              {(isNewsExpanded ? filteredNews : [filteredNews[newsScrollIndex]]).map((news, idx) => (
                <motion.div 
                  key={news?.id || idx}
                  initial={!isNewsExpanded ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 flex items-start gap-4 hover:bg-[var(--muted)]/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (news.relatedStocks.length > 0) {
                      setSearchQuery(news.relatedStocks[0]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="text-xs font-mono text-[var(--muted-foreground)] pt-1 shrink-0">{news?.time}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{news?.icon}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{news?.type}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed group-hover:text-blue-500 transition-colors">
                      {news?.text}
                    </p>
                    {news?.relatedStocks.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {news.relatedStocks.map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-500/5 text-blue-500 rounded border border-blue-500/10 font-bold">
                            ${s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>

          {!isNewsExpanded && filteredNews.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none" />
          )}
        </div>

        <button 
          onClick={() => setIsNewsExpanded(!isNewsExpanded)}
          className="w-full py-4 bg-[var(--muted)]/30 hover:bg-[var(--muted)] transition-colors flex items-center justify-center gap-2 text-xs font-bold text-[var(--muted-foreground)] border-t border-[var(--border)]"
        >
          {isNewsExpanded ? (
            <>收起快讯 <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>查看更多快讯 ({filteredNews.length}) <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </section>

      {/* Stock Preview Drawer */}
      <AnimatePresence>
        {selectedStockForPreview && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStockForPreview(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {selectedStockForPreview.symbol[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--foreground)]">{selectedStockForPreview.name}</h3>
                      <p className="text-[var(--muted-foreground)] font-mono">{selectedStockForPreview.symbol}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStockForPreview(null)}
                    className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-[var(--muted-foreground)]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">最新价</p>
                    <p className="text-2xl font-mono font-bold text-[var(--foreground)]">${selectedStockForPreview.price.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">涨跌幅</p>
                    <p className={cn(
                      "text-2xl font-mono font-bold",
                      selectedStockForPreview.changePercent >= 0 ? "text-rose-500" : "text-emerald-500"
                    )}>
                      {selectedStockForPreview.changePercent >= 0 ? '+' : ''}{selectedStockForPreview.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" /> 智能体行为摘要
                  </h4>
                  <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      当前该股受到 <span className="text-[var(--foreground)] font-bold">机构智能体</span> 的持续关注。
                      羊群效应强度为 <span className="text-rose-500 font-bold">{selectedStockForPreview.herdingIntensity}%</span>，
                      暗示近期可能存在非理性波动。散户情绪目前处于 <span className="text-emerald-500 font-bold">看空</span> 状态。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8">
                  <button 
                    onClick={() => navigate(`/trade?symbol=${selectedStockForPreview.symbol}`)}
                    className="flex flex-col items-center gap-2 p-4 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all active:scale-95"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-xs font-bold">立即交易</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/lab?symbol=${selectedStockForPreview.symbol}&mode=config`)}
                    className="flex flex-col items-center gap-2 p-4 bg-[var(--muted)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] hover:bg-[var(--border)] transition-all active:scale-95"
                  >
                    <Microscope className="w-6 h-6" />
                    <span className="text-xs font-bold">模拟实验</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/lab?symbol=${selectedStockForPreview.symbol}&mode=pk`)}
                    className="flex flex-col items-center gap-2 p-4 bg-[var(--muted)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] hover:bg-[var(--border)] transition-all active:scale-95"
                  >
                    <Zap className="w-6 h-6 text-amber-500" />
                    <span className="text-xs font-bold">策略对抗</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

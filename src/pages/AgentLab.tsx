import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  ShieldAlert,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Save,
  Share2,
  Code,
  MousePointer2,
  Users,
  Search,
  History,
  Target,
  BookOpen,
  ChevronRight,
  Settings2,
  Database,
  LineChart as LineChartIcon,
  Activity,
  Flame,
  Trophy,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface AgentLabProps {
  market: any;
}

type TabType = 'simulator' | 'strategy' | 'visualization' | 'training' | 'community';

export default function AgentLab({ market }: AgentLabProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const { agents, stocks, triggerShock } = market;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'challenge') {
      setIsChallengeMode(true);
      setActiveTab('simulator');
    }
  }, [location]);

  const exitChallenge = () => {
    setIsChallengeMode(false);
    navigate('/lab', { replace: true });
  };

  const tabs = [
    { id: 'simulator', name: '冲击模拟器', icon: Zap },
    { id: 'strategy', name: '策略对抗', icon: Target },
    { id: 'visualization', name: '行为可视化', icon: Users },
    { id: 'training', name: 'RL 实验室', icon: Cpu },
    { id: 'community', name: '案例库', icon: BookOpen },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">智能体实验室</h2>
          <p className="text-[var(--muted-foreground)]">基于多智能体系统 (MAS) 与强化学习 (RL) 的金融沙盒</p>
        </div>
        
        <nav className="flex bg-[var(--muted)] border border-[var(--border)] p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </header>

      <AnimatePresence>
        {isChallengeMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30 rounded-3xl p-6 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">本周挑战赛：极度恐慌中的生还者</h3>
                  <p className="text-sm text-rose-200/70">规则：羊群效应强度已锁定为 90%。目标：在模拟中实现 10% 以上收益。</p>
                </div>
              </div>
              <button 
                onClick={exitChallenge}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'simulator' && <SimulatorModule key="simulator" triggerShock={triggerShock} isChallenge={isChallengeMode} />}
          {activeTab === 'strategy' && <StrategyModule key="strategy" />}
          {activeTab === 'visualization' && <VisualizationModule key="visualization" agents={agents} />}
          {activeTab === 'training' && <TrainingModule key="training" />}
          {activeTab === 'community' && <CommunityModule key="community" onStartChallenge={() => navigate('/lab?mode=challenge')} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Module 1: Market Shock Simulator ---
function SimulatorModule({ triggerShock, isChallenge }: { triggerShock: any, isChallenge?: boolean }) {
  const [params, setParams] = useState({
    policyIntensity: 50,
    eventImpact: 30,
    duration: 10,
    panicLevel: 20,
    contagionSpeed: 40,
    retailRatio: 60,
    instRatio: 30,
    herdingBias: 50,
    lossAversion: 70
  });

  useEffect(() => {
    if (isChallenge) {
      setParams(prev => ({ ...prev, herdingBias: 90 }));
    }
  }, [isChallenge]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runSimulation = () => {
    setIsSimulating(true);
    // Simulate data generation
    setTimeout(() => {
      const newData = Array.from({ length: 30 }).map((_, i) => ({
        time: i,
        price: 3800 + Math.random() * 200 - (params.panicLevel * 2),
        sentiment: 50 + Math.random() * 20 - (params.contagionSpeed / 2)
      }));
      setResults(newData);
      setIsSimulating(false);
      triggerShock('Simulated', -params.panicLevel / 100, 'Custom lab simulation');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Parameters Panel */}
      <div className="lg:col-span-1 space-y-6 bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings2 className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl font-bold text-white">模拟参数配置</h3>
        </div>

        <div className="space-y-6">
          <ParameterGroup title="外部冲击">
            <Slider label="政策强度" value={params.policyIntensity} onChange={(v) => setParams({...params, policyIntensity: v})} />
            <Slider label="冲击持续时间" value={params.duration} onChange={(v) => setParams({...params, duration: v})} />
          </ParameterGroup>

          <ParameterGroup title="情绪参数">
            <Slider label="初始恐慌水平" value={params.panicLevel} onChange={(v) => setParams({...params, panicLevel: v})} />
            <Slider label="情绪传染速度" value={params.contagionSpeed} onChange={(v) => setParams({...params, contagionSpeed: v})} />
          </ParameterGroup>

          <ParameterGroup title="智能体构成">
            <Slider label="散户比例" value={params.retailRatio} onChange={(v) => setParams({...params, retailRatio: v})} />
            <Slider label="机构比例" value={params.instRatio} onChange={(v) => setParams({...params, instRatio: v})} />
          </ParameterGroup>

          <ParameterGroup title="心理偏差">
            <Slider 
              label="羊群效应倾向" 
              value={isChallenge ? 90 : params.herdingBias} 
              onChange={(v) => !isChallenge && setParams({...params, herdingBias: v})} 
              disabled={isChallenge}
            />
            <Slider label="损失厌恶系数" value={params.lossAversion} onChange={(v) => setParams({...params, lossAversion: v})} />
          </ParameterGroup>
        </div>

        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-rose-500 hover:bg-rose-400 disabled:bg-rose-500/50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isSimulating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isSimulating ? '模拟运行中...' : '开始模拟'}
        </button>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">价格走势模拟 (K线/分时)</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><Save className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {results.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F0F12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f43f5e' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <LineChartIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>配置参数并点击“开始模拟”以生成结果</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="指数涨跌幅" value="-4.2%" color="text-emerald-400" />
          <MetricCard label="最大回撤" value="8.15%" color="text-emerald-400" />
          <MetricCard label="恐慌峰值" value="T+14" color="text-amber-400" />
          <MetricCard label="羊群爆发点" value="T+18" color="text-rose-400" />
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">情绪演化热图</h3>
          <div className="h-24 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-2xl relative overflow-hidden">
             <motion.div 
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
             />
             <div className="absolute inset-0 flex items-center justify-around text-[10px] font-bold text-white/50 uppercase tracking-widest">
                <span>Panic</span>
                <span>Neutral</span>
                <span>Greed</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Module 2: Strategy Confrontation ---
function StrategyModule() {
  const [mode, setMode] = useState<'simple' | 'code'>('simple');
  const [opponent, setOpponent] = useState('retail');

  const opponents = [
    { id: 'retail', name: '散户智能体', desc: '容易恐慌和追涨', difficulty: 2 },
    { id: 'inst', name: '机构智能体', desc: '相对理性，有风控', difficulty: 4 },
    { id: 'rl', name: 'RL 训练智能体', desc: '强化学习优化过的策略', difficulty: 5 },
    { id: 'history', name: '极端行情智能体', desc: '模拟历史股灾行为', difficulty: 5 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-rose-400" /> 策略构建器
            </h3>
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setMode('simple')}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'simple' ? "bg-rose-500 text-white" : "text-slate-500")}
              >简易模式</button>
              <button 
                onClick={() => setMode('code')}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'code' ? "bg-rose-500 text-white" : "text-slate-500")}
              >代码模式</button>
            </div>
          </div>

          {mode === 'simple' ? (
            <div className="space-y-4">
              <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-4">买入条件 (Buy Conditions)</p>
                <div className="flex flex-wrap gap-3">
                  <StrategyBlock label="恐慌指数 > 70" color="bg-emerald-500/20 text-emerald-400" />
                  <StrategyBlock label="买入 10% 仓位" color="bg-rose-500/20 text-rose-400" />
                  <button className="w-8 h-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/40">+</button>
                </div>
              </div>
              <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-4">卖出条件 (Sell Conditions)</p>
                <div className="flex flex-wrap gap-3">
                  <StrategyBlock label="收益率达到 15%" color="bg-rose-500/20 text-rose-400" />
                  <StrategyBlock label="止盈卖出" color="bg-amber-500/20 text-amber-400" />
                  <button className="w-8 h-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/40">+</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-rose-400/80 min-h-[200px]">
              <p><span className="text-purple-400">if</span> market.panic_index &gt; <span className="text-amber-400">70</span>:</p>
              <p className="ml-4">portfolio.buy(stock=<span className="text-amber-400">'000001'</span>, amount=<span className="text-amber-400">0.1</span>)</p>
              <p><span className="text-purple-400">if</span> portfolio.profit &gt; <span className="text-amber-400">0.15</span>:</p>
              <p className="ml-4">portfolio.sell_all()</p>
              <motion.div 
                animate={{ opacity: [0, 1] }} 
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-rose-500 ml-1"
              />
            </div>
          )}
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">收益率对比 (用户 vs 智能体)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.from({ length: 20 }).map((_, i) => ({
                name: i,
                user: 100 + i * 2 + Math.random() * 5,
                agent: 100 + i * 1.5 + Math.random() * 8
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0F0F12', border: 'none', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="user" stroke="#f43f5e" strokeWidth={3} dot={false} name="用户策略" />
                <Line type="monotone" dataKey="agent" stroke="#6366f1" strokeWidth={3} dot={false} name="智能体策略" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">选择对抗对手</h3>
          <div className="space-y-4">
            {opponents.map((op) => (
              <button 
                key={op.id}
                onClick={() => setOpponent(op.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all group",
                  opponent === op.id ? "bg-rose-500/10 border-rose-500/50" : "bg-white/5 border-transparent hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={cn("font-bold", opponent === op.id ? "text-rose-400" : "text-white")}>{op.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i < op.difficulty ? "bg-amber-400" : "bg-white/10")} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{op.desc}</p>
              </button>
            ))}
          </div>
          <button className="w-full mt-8 bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            开始对抗 PK
          </button>
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">行为分析报告</h3>
          <div className="space-y-4">
            <AnalysisItem label="胜率" value="65%" />
            <AnalysisItem label="盈亏比" value="1.82" />
            <AnalysisItem label="最大回撤" value="12.4%" />
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 italic">
                “你在 T+12 时刻表现出了明显的恐慌抛售倾向，而智能体在该点位选择了逆向买入。”
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Module 3: Agent Behavior Visualization ---
function VisualizationModule({ agents }: { agents: any[] }) {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Mock dots for Agent Plaza
  const dots = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    type: i % 3 === 0 ? 'panic' : i % 3 === 1 ? 'greedy' : 'wait'
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[3rem] p-8 relative overflow-hidden min-h-[500px]">
          <div className="absolute top-8 left-8 z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-400" /> 智能体广场
            </h3>
            <p className="text-xs text-slate-500">实时可视化群体情绪演化</p>
          </div>

          <div className="absolute top-8 right-8 z-10 flex gap-2">
            <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <LegendItem color="bg-emerald-500" label="恐慌抛售" />
              <LegendItem color="bg-rose-500" label="贪婪买入" />
              <LegendItem color="bg-blue-500" label="观望中" />
            </div>
          </div>

          {/* Agent Plaza Canvas Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {dots.map((dot) => (
              <motion.button
                key={dot.id}
                onClick={() => setSelectedAgent({
                  id: dot.id,
                  type: dot.id % 2 === 0 ? '散户' : '机构',
                  balance: 10000 + dot.id * 500,
                  position: '60%',
                  sentiment: dot.type === 'panic' ? '恐慌 (85%)' : dot.type === 'greedy' ? '贪婪 (70%)' : '冷静 (20%)',
                  lastAction: dot.type === 'panic' ? '卖出 500 股' : dot.type === 'greedy' ? '买入 200 股' : '持有'
                })}
                animate={isPlaying ? {
                  x: [dot.x - 5, dot.x + 5, dot.x],
                  y: [dot.y - 5, dot.y + 5, dot.y],
                } : {}}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                className={cn(
                  "absolute rounded-full cursor-pointer hover:ring-4 hover:ring-white/20 transition-all",
                  dot.type === 'panic' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : 
                  dot.type === 'greedy' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" : 
                  "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                )}
                style={{ 
                  width: dot.size, 
                  height: dot.size, 
                  left: `${dot.x}%`, 
                  top: `${dot.y}%` 
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-rose-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <div className="w-64 h-1 bg-white/10 rounded-full relative">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-rose-500 rounded-full" />
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">T+18 / T+30</span>
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">群体行为回放</h3>
          <div className="space-y-4">
            <TimelineItem time="T+5" event="政策发布：利好信号注入" type="positive" />
            <TimelineItem time="T+12" event="情绪拐点：机构开始获利了结" type="neutral" />
            <TimelineItem time="T+18" event="恐慌爆发：散户触发羊群效应" type="negative" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8 min-h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <Search className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">单个智能体探针</h3>
          </div>

          {selectedAgent ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                  #{selectedAgent.id}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedAgent.type}智能体</p>
                  <p className="text-xs text-slate-500">ID: agent_v3_{selectedAgent.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ProbeStat label="初始资金" value={selectedAgent.balance.toLocaleString()} />
                <ProbeStat label="当前持仓" value={selectedAgent.position} />
                <ProbeStat label="情绪状态" value={selectedAgent.sentiment} />
                <ProbeStat label="最近操作" value={selectedAgent.lastAction} />
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">决策逻辑 (Decision Logic)</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  检测到周围 3 个邻近智能体正在进行抛售操作，且市场恐慌指数超过阈值 (0.65)，触发羊群效应模块，执行减仓指令。
                </p>
              </div>

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: '理性', A: 40, fullMark: 100 },
                    { subject: '恐慌', A: 85, fullMark: 100 },
                    { subject: '贪婪', A: 20, fullMark: 100 },
                    { subject: '从众', A: 90, fullMark: 100 },
                    { subject: '风险', A: 60, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="Agent" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-20">
              <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">点击广场中的圆点<br />查看智能体决策细节</p>
            </div>
          )}
        </div>

        <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8">
          <h4 className="text-rose-400 font-bold mb-2">什么是情绪传染？</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            在 Simustock 中，智能体不仅受价格影响，还会观察邻近智能体的行为。当一定比例的邻居表现出恐慌时，该情绪会通过网络拓扑结构快速扩散，形成非理性的群体波动。
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Module 4: RL Training Lab ---
function TrainingModule() {
  const [model, setModel] = useState('PPO');
  const [params, setParams] = useState({
    lr: 30,
    gamma: 95,
    layers: 40,
    buffer: 60
  });
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400" /> 训练实时可视化
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-400 uppercase">Training...</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Epoch: 1,240 / 5,000</span>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.from({ length: 50 }).map((_, i) => ({
                epoch: i,
                reward: Math.log(i + 1) * 10 + Math.random() * 5,
                loss: 100 / (i + 1) + Math.random() * 2
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="epoch" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0F0F12', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="reward" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} name="累计奖励 (Reward)" />
                <Area type="monotone" dataKey="loss" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} name="损失函数 (Loss)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">策略收敛度</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-white">92.4%</span>
                <TrendingUp className="w-4 h-4 text-rose-400 mb-1" />
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">探索率 (Epsilon)</p>
              <span className="text-xl font-bold text-white">0.05</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">平均步数</p>
              <span className="text-xl font-bold text-white">420</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold text-white mb-6">模型库 (Model Zoo)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModelCard 
              name="PPO" 
              desc="近端策略优化，训练稳定，适合连续动作空间。" 
              active={model === 'PPO'} 
              onClick={() => setModel('PPO')}
            />
            <ModelCard 
              name="DQN" 
              desc="深度 Q 网络，适合离散动作空间，如买/卖/持仓。" 
              active={model === 'DQN'} 
              onClick={() => setModel('DQN')}
            />
            <ModelCard 
              name="A2C" 
              desc="优势 Actor-Critic，同步更新，效率极高。" 
              active={model === 'A2C'} 
              onClick={() => setModel('A2C')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <Settings2 className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">超参数调节</h3>
          </div>

          <div className="space-y-6">
            <Slider label="学习率 (Learning Rate)" value={params.lr} onChange={(v) => setParams({...params, lr: v})} />
            <Slider label="折扣因子 (Gamma)" value={params.gamma} onChange={(v) => setParams({...params, gamma: v})} />
            <Slider label="神经网络层数" value={params.layers} onChange={(v) => setParams({...params, layers: v})} />
            <Slider label="经验回放大小" value={params.buffer} onChange={(v) => setParams({...params, buffer: v})} />
          </div>

          <div className="mt-8 space-y-3">
            <button className="w-full bg-rose-500 text-white font-bold py-4 rounded-2xl hover:bg-rose-400 transition-all">
              保存并重新训练
            </button>
            <button className="w-full bg-white/5 text-slate-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all">
              导出模型文件 (.pth)
            </button>
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">训练数据集</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">当前使用：Simustock 300 历史波动数据 (2020-2025)</p>
          <button className="text-xs font-bold text-rose-400 hover:underline">上传自定义数据集</button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Module 5: Community & Cases ---
function CommunityModule({ onStartChallenge }: { onStartChallenge?: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <section>
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-bold text-white">热门模拟案例</h3>
          </div>
          <button className="text-rose-400 font-bold text-sm flex items-center gap-1 hover:underline">
            查看更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CaseCard 
            title="突发加息 + 恐慌传染场景模拟" 
            author="量化小牛" 
            stats={{ views: '1.2k', comments: 23 }}
            tags={['宏观冲击', '羊群效应']}
            impact="-15.4%"
          />
          <CaseCard 
            title="散户抱团对抗机构做空实验" 
            author="WallStreetBets_AI" 
            stats={{ views: '3.5k', comments: 86 }}
            tags={['策略对抗', '散户力量']}
            impact="+42.1%"
          />
          <CaseCard 
            title="黑天鹅事件下的流动性枯竭" 
            author="风险控制官" 
            stats={{ views: '890', comments: 12 }}
            tags={['黑天鹅', '流动性']}
            impact="-28.9%"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-6 h-6 text-amber-400" />
            <h3 className="text-2xl font-bold text-white">本周挑战赛</h3>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 rounded-[2rem] p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">在 90% 强度的羊群效应中获利</h4>
                <p className="text-sm text-slate-400">本周目标：构建一个能识别并利用羊群效应顶点的策略。</p>
              </div>
              <div className="bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">进行中</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">1. 山雨 (专业投资者)</span>
                <span className="text-emerald-400 font-bold">+23.4%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">2. 量化小牛 (机构)</span>
                <span className="text-emerald-400 font-bold">+18.2%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">3. 策略大师 (新手)</span>
                <span className="text-emerald-400 font-bold">+12.5%</span>
              </div>
            </div>

            <button 
              onClick={onStartChallenge}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-2xl hover:bg-amber-400 transition-all"
            >
              立即参与挑战
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <History className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">经典教学案例</h3>
          </div>
          <div className="space-y-4">
            <TeachingCase title="南海泡沫事件 (1720)" desc="历史上最早的羊群效应与群体狂热。" />
            <TeachingCase title="2008 金融危机 (恐慌传染)" desc="次贷危机引发的全球流动性枯竭模拟。" />
            <TeachingCase title="2020 疫情熔断 (突发冲击)" desc="极端外部事件对市场结构的瞬间破坏。" />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function ParameterGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Slider({ label, value, onChange, disabled }: { label: string, value: number, onChange?: (v: number) => void, disabled?: boolean }) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50 cursor-not-allowed")}>
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-emerald-400 font-mono font-bold">{value}%</span>
      </div>
      <div className="relative h-6 flex items-center group">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          disabled={disabled}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          className={cn(
            "w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 focus:outline-none",
            disabled && "cursor-not-allowed"
          )}
        />
        <div 
          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full h-1.5 pointer-events-none mt-[9px]" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-[#0F0F12] border border-white/5 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</p>
      <p className={cn("text-lg font-bold", color)}>{value}</p>
    </div>
  );
}

function StrategyBlock({ label, color }: { label: string, color: string }) {
  return (
    <div className={cn("px-4 py-2 rounded-xl text-xs font-bold border border-white/5", color)}>
      {label}
    </div>
  );
}

function AnalysisItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
    </div>
  );
}

function TimelineItem({ time, event, type }: { time: string, event: string, type: 'positive' | 'negative' | 'neutral' }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-xs font-mono text-slate-500 pt-1">{time}</span>
      <div className={cn(
        "flex-1 p-3 rounded-xl border text-xs",
        type === 'positive' ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" :
        type === 'negative' ? "bg-rose-500/5 border-rose-500/10 text-rose-400" :
        "bg-white/5 border-white/10 text-slate-300"
      )}>
        {event}
      </div>
    </div>
  );
}

function ProbeStat({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function ModelCard({ name, desc, active, onClick }: { name: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border text-left transition-all",
        active ? "bg-emerald-500/10 border-emerald-500/50" : "bg-white/5 border-transparent hover:border-white/10"
      )}
    >
      <h4 className={cn("font-bold mb-2", active ? "text-emerald-400" : "text-white")}>{name}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </button>
  );
}

function CaseCard({ title, author, stats, tags, impact }: { title: string, author: string, stats: any, tags: string[], impact: string }) {
  return (
    <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-6 hover:border-white/20 transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-slate-500 uppercase">{tag}</span>
          ))}
        </div>
        <span className={cn("text-xs font-bold", impact.startsWith('-') ? "text-rose-400" : "text-emerald-400")}>{impact}</span>
      </div>
      <h4 className="font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{title}</h4>
      <div className="flex justify-between items-center text-[10px] text-slate-500">
        <span>By {author}</span>
        <div className="flex gap-3">
          <span>{stats.views} 浏览</span>
          <span>{stats.comments} 评论</span>
        </div>
      </div>
    </div>
  );
}

function TeachingCase({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-all" />
      </div>
    </div>
  );
}

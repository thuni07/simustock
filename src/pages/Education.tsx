import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Target,
  ChevronRight,
  Lightbulb,
  Lock,
  TrendingUp,
  Trophy,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import BehavioralFeedback from '../components/BehavioralFeedback';

interface EducationProps {
  user: any;
  setUser: any;
  market: any;
}

export default function Education({ user, setUser, market }: EducationProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'training'>('courses');
  const [activeStep, setActiveStep] = useState(0);

  const courses = [
    { title: '行为金融学入门', level: '新手', duration: '45min', students: 1250, icon: BookOpen },
    { title: '多智能体系统原理', level: '进阶', duration: '60min', students: 840, icon: Target },
    { title: '强化学习交易策略', level: '专业', duration: '120min', students: 320, icon: Trophy },
  ];

  const trainingSteps = [
    {
      title: '市场基本面',
      description: '了解股票、价格、成交量等核心概念，以及市场是如何通过买卖双方博弈形成价格的。',
      icon: BookOpen,
      tasks: ['查看 TECH 的历史K线', '了解什么是市值', '观察成交量变化']
    },
    {
      title: '行为金融与心理偏差',
      description: '学习羊群效应、恐慌性抛售等非理性行为如何驱动市场波动。',
      icon: Target,
      tasks: ['识别一次羊群效应', '观察恐慌指数的变化', '了解损失厌恶心理']
    },
    {
      title: '实战模拟交易',
      description: '在无风险环境下进行买卖操作，测试你的投资策略。',
      icon: Play,
      tasks: ['完成首笔买入交易', '设置止损点', '查看持仓收益']
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">教育中心</h2>
          <p className="text-[var(--muted-foreground)]">从零开始，掌握行为金融与智能体模拟的奥秘</p>
        </div>
        <div className="flex bg-[var(--muted)] p-1 rounded-xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab('courses')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'courses' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            精品课程
          </button>
          <button 
            onClick={() => setActiveTab('training')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'training' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            互动训练营
          </button>
        </div>
      </header>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-8 hover:border-rose-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-6 group-hover:bg-rose-500/10 transition-colors">
                <course.icon className="w-7 h-7 text-[var(--muted-foreground)] group-hover:text-rose-500 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">{course.title}</h3>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">{course.level}</span>
                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><Play className="w-3 h-3" /> {course.duration}</span>
                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
              </div>
              <button 
                onClick={() => alert(`正在加载课程：${course.title}`)}
                className="w-full py-3 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] font-bold rounded-xl border border-[var(--border)] transition-all"
              >
                开始学习
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                      {activeStep === trainingSteps.length - 1 ? (
                        <Play className="w-6 h-6 text-rose-500" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Step {activeStep + 1} of {trainingSteps.length}</p>
                      <h3 className="text-2xl font-bold text-[var(--foreground)]">{trainingSteps[activeStep].title}</h3>
                    </div>
                  </div>

                  <p className="text-[var(--muted-foreground)] leading-relaxed mb-10 text-lg">
                    {trainingSteps[activeStep].description}
                  </p>

                  <div className="space-y-4 mb-10">
                    <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">今日任务</p>
                    {trainingSteps[activeStep].tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)] group hover:border-rose-500/30 transition-all">
                        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] flex items-center justify-center group-hover:border-rose-500 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-transparent group-hover:text-rose-500" />
                        </div>
                        <span className="text-[var(--foreground)] font-medium">{task}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-[var(--border)]">
                    <button 
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="text-[var(--muted-foreground)] font-bold hover:text-[var(--foreground)] disabled:opacity-30 transition-colors"
                    >
                      上一步
                    </button>
                    <button 
                      onClick={() => {
                        if (activeStep === trainingSteps.length - 1) {
                          alert('恭喜！你已完成互动训练营的所有课程。');
                          setActiveTab('courses');
                        } else {
                          setActiveStep(Math.min(trainingSteps.length - 1, activeStep + 1));
                        }
                      }}
                      className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                      {activeStep === trainingSteps.length - 1 ? '完成训练' : '下一步'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  <h4 className="font-bold text-[var(--foreground)]">投资锦囊</h4>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed italic">
                  "在模拟盘中，最宝贵的不是你赚了多少虚拟货币，而是你观察到了多少次智能体的非理性行为，并学会了如何利用它们。"
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-8">
                <h4 className="font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> 训练营排行榜
                </h4>
                <div className="space-y-4">
                  {[
                    { name: '王牌交易员', roi: '+45.2%' },
                    { name: '量化先锋', roi: '+32.8%' },
                    { name: '稳健之星', roi: '+12.5%' }
                  ].map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[var(--muted-foreground)] opacity-50">0{idx + 1}</span>
                        <span className="text-sm text-[var(--muted-foreground)]">{user.name}</span>
                      </div>
                      <span className="text-sm font-bold text-rose-500">{user.roi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BehavioralFeedback user={user} />
            
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                绩效分析 (ROI)
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={user.equityHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      itemStyle={{ color: '#f43f5e' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f43f5e" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

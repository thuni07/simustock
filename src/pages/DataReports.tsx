import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Lock, 
  Eye, 
  BarChart, 
  PieChart, 
  TrendingUp,
  Clock,
  Database
} from 'lucide-react';

export default function DataReports() {
  const reports = [
    { 
      title: '2026 Q1 MAS市场波动深度报告', 
      date: '2026-02-28', 
      type: '深度研报', 
      isPremium: false,
      desc: '基于多智能体系统模拟的季度市场波动分析及未来预测。'
    },
    { 
      title: '行为金融：羊群效应下的散户心理博弈', 
      date: '2026-02-25', 
      type: '专题研究', 
      isPremium: true,
      desc: '深入探讨散户智能体在极端行情下的决策偏差。'
    },
    { 
      title: 'RL策略对抗：机构智能体调仓路径追踪', 
      date: '2026-02-20', 
      type: '策略报告', 
      isPremium: true,
      desc: '追踪机构级智能体在强化学习模型下的最优调仓逻辑。'
    },
    { 
      title: '黑天鹅事件模拟：压力测试与风险对冲', 
      date: '2026-02-15', 
      type: '风险评估', 
      isPremium: false,
      desc: '模拟全球政策突变对模拟盘流动性的冲击测试。'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">数据研报中心</h2>
          <p className="text-slate-500">B端专业价值输出，深度洞察模拟市场动态</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 hover:border-emerald-500/20 dark:hover:border-white/10 transition-all group relative overflow-hidden shadow-sm dark:shadow-none"
          >
            {report.isPremium && (
              <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-bl-2xl flex items-center gap-2 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> 会员专属
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Clock className="w-3 h-3" /> {report.date}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">{report.title}</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">{report.desc}</p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {report.type}
              </span>
              <div className="flex gap-4">
                <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 text-xs font-bold">
                  <Eye className="w-4 h-4" /> 预览
                </button>
                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 text-xs font-bold">
                  <Download className="w-4 h-4" /> 下载
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">申请 API 接口</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              我们为机构客户提供完整的模拟盘数据 API，支持毫秒级智能体行为追踪及情绪原始数据导出。通过 API，您可以将 Simustock 的行为金融数据集成到您的量化交易系统中。
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">实时情绪流</span>
              </div>
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">智能体持仓分布</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">RL策略预测数据</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">快速申请</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">机构名称</label>
                <input type="text" className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-colors" placeholder="输入您的机构或团队名称" />
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                提交申请
              </button>
              <p className="text-[10px] text-slate-500 text-center">提交后我们的技术团队将在 24 小时内与您联系</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

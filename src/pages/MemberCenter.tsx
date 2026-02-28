import { motion } from 'motion/react';
import { 
  Crown, 
  Check, 
  Zap, 
  Shield, 
  Cpu, 
  BarChart, 
  Headphones,
  ArrowRight
} from 'lucide-react';

export default function MemberCenter() {
  const plans = [
    {
      name: '基础版',
      price: '免费',
      desc: '适合新手入门，体验基础模拟交易。',
      features: [
        '基础行情数据',
        '模拟交易 (基础版)',
        '社区访问权限',
        '基础投教课程'
      ],
      isPopular: false,
      buttonText: '当前版本',
      buttonClass: 'bg-white/5 text-slate-400 cursor-default'
    },
    {
      name: '专业版',
      price: '¥99/月',
      desc: '解锁智能体实验室，深度洞察行为金融。',
      features: [
        '实时行为金融指标',
        '智能体实验室 (全功能)',
        '高级回测工具',
        '深度研报下载',
        '专属策略对抗模式'
      ],
      isPopular: true,
      buttonText: '立即订阅',
      buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
    },
    {
      name: '企业版',
      price: '联系销售',
      desc: '为金融机构提供定制化培训与数据服务。',
      features: [
        '定制化模拟盘环境',
        '企业级 API 接口',
        '员工交易行为分析',
        '1对1 技术支持',
        '私有化部署选项'
      ],
      isPopular: false,
      buttonText: '咨询详情',
      buttonClass: 'bg-white/10 hover:bg-white/20 text-white'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Crown className="w-4 h-4" /> Freemium 商业模式
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">选择适合您的计划</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          从基础模拟到深度量化分析，Simustock 为您提供全方位的金融成长路径。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative bg-[#0F0F12] border rounded-[2.5rem] p-10 flex flex-col h-full transition-all duration-300",
              plan.isPopular ? "border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-105 z-10" : "border-white/5 hover:border-white/10"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                最受欢迎
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.price.includes('¥') && <span className="text-slate-500 text-sm">/月</span>}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{plan.desc}</p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button className={cn(
              "w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98]",
              plan.buttonClass
            )}>
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#0F0F12] border border-white/5 rounded-[3rem] p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Zap className="w-8 h-8 text-amber-400" />
            <h4 className="font-bold text-white">极速行情</h4>
            <p className="text-xs text-slate-500">毫秒级智能体行为同步，抢占模拟先机。</p>
          </div>
          <div className="space-y-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h4 className="font-bold text-white">安全保障</h4>
            <p className="text-xs text-slate-500">多重加密保护您的策略隐私与数据安全。</p>
          </div>
          <div className="space-y-3">
            <Cpu className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-white">AI 驱动</h4>
            <p className="text-xs text-slate-500">基于 DRL 的智能体实验室，探索无限可能。</p>
          </div>
          <div className="space-y-3">
            <Headphones className="w-8 h-8 text-purple-400" />
            <h4 className="font-bold text-white">专业支持</h4>
            <p className="text-xs text-slate-500">7x24小时在线客服，解决您的任何疑问。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';

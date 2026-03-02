import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Book, 
  Code, 
  MessageCircle, 
  ChevronRight,
  Search
} from 'lucide-react';

export default function HelpCenter() {
  const faqs = [
    { q: '如何开始第一笔模拟交易？', a: '在“模拟交易”页面选择股票，输入买入数量并确认即可。' },
    { q: '智能体实验室的参数如何调节？', a: '您可以调节宏观冲击强度、智能体情绪偏差等参数，点击“运行模拟”查看结果。' },
    { q: '我的模拟收益可以提现吗？', a: '本平台为虚拟模拟盘，所有收益均为虚拟资金，仅供学习与研究使用。' },
    { q: '如何申请企业版 API？', a: '请在“数据研报”页面点击“申请 API 接口”，我们的销售团队会与您联系。' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
      <header className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">帮助中心</h2>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <input 
            type="text" 
            placeholder="搜索您遇到的问题..." 
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-2xl pl-12 pr-6 py-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => alert('正在打开：新手指南')}
          className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 text-left hover:bg-[var(--muted)] transition-all group"
        >
          <Book className="w-8 h-8 text-rose-500 mb-4" />
          <h4 className="font-bold text-[var(--foreground)] mb-2">新手指南</h4>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">从零开始掌握 Simustock 的所有核心功能。</p>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-30 group-hover:text-rose-500 transition-all" />
        </button>
        <button 
          onClick={() => alert('正在打开：技术文档')}
          className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 text-left hover:bg-[var(--muted)] transition-all group"
        >
          <Code className="w-8 h-8 text-blue-500 mb-4" />
          <h4 className="font-bold text-[var(--foreground)] mb-2">技术文档</h4>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">了解 MAS 引擎背后的算法逻辑与 API 规范。</p>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-30 group-hover:text-blue-500 transition-all" />
        </button>
        <button 
          onClick={() => alert('正在打开：在线客服')}
          className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 text-left hover:bg-[var(--muted)] transition-all group"
        >
          <MessageCircle className="w-8 h-8 text-purple-500 mb-4" />
          <h4 className="font-bold text-[var(--foreground)] mb-2">在线客服</h4>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">遇到无法解决的问题？联系我们的技术支持。</p>
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-30 group-hover:text-purple-500 transition-all" />
        </button>
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-500" /> 常见问题
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h4 className="font-bold text-[var(--foreground)] mb-2">Q: {faq.q}</h4>
              <p className="text-sm text-[var(--muted-foreground)]">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

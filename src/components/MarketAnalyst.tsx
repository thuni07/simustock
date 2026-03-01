import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface MarketAnalystProps {
  market: any;
}

export default function MarketAnalyst({ market }: MarketAnalystProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMarket = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { stocks, agents, shocks } = market;
      
      const prompt = `
        作为一名专注于多智能体系统 (MAS) 和强化学习 (RL) 的资深金融分析师，请分析以下模拟市场状态并提供战略建议：

        股票数据:
        ${stocks.map((s: any) => `- ${s.symbol}: $${s.price.toFixed(2)} (${s.changePercent.toFixed(2)}%)`).join('\n')}

        活跃智能体:
        ${agents.map((a: any) => `- ${a.type} (策略: ${a.strategy}, 情绪: ${a.sentiment.toFixed(2)})`).join('\n')}

        近期冲击事件:
        ${shocks.map((s: any) => `- ${s.type}: ${s.description}`).join('\n')}

        用户交易行为:
        - 当前余额: $${market.userBalance}
        - 最近交易: ${market.userTrades.slice(0, 5).map((t: any) => `${t.type} ${t.symbol} 价格 $${t.price}`).join(', ')}

        请提供以下内容的中文报告：
        1. 市场情绪分析
        2. 潜在风险（基于智能体行为和冲击）
        3. 行为反馈：分析用户的近期交易。他们是否表现出 FOMO、恐慌性抛售或纪律严明的价值投资？
        4. 战略建议。
        保持简洁专业。
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "你是一名专业的金融分析师。请用清晰的 Markdown 格式提供报告。不要包含任何可能失效的外部图像或链接。专注于文本分析和使用 Markdown 表格进行数据展示。"
        }
      });

      setAnalysis(response.text || "暂无分析数据。");
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis("无法连接到 AI 分析师。请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-8 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">AI 市场分析师</h3>
            <p className="text-xs text-[var(--muted-foreground)]">由 Gemini 智能驱动</p>
          </div>
        </div>
        <button
          onClick={analyzeMarket}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-[var(--muted)] text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? '分析中...' : '生成研报'}
        </button>
      </div>

      {analysis ? (
        <div className="markdown-body bg-[var(--muted)] rounded-2xl p-6 border border-[var(--border)] max-h-[400px] overflow-y-auto">
          <Markdown
            components={{
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  referrerPolicy="no-referrer" 
                  className="rounded-xl border border-[var(--border)] my-4 max-w-full h-auto" 
                />
              )
            }}
          >
            {analysis}
          </Markdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
            点击上方按钮，获取当前 Simustock 市场动态的深度分析。
          </p>
        </div>
      )}
    </div>
  );
}

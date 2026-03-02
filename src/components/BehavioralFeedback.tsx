import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface BehavioralFeedbackProps {
  user: UserProfile;
}

export default function BehavioralFeedback({ user }: BehavioralFeedbackProps) {
  // Simple heuristic analysis of user trades
  const analyzeBehavior = () => {
    const feedback: { type: 'positive' | 'warning', text: string, icon: any }[] = [];
    
    if (user.trades.length < 3) {
      return [{ type: 'positive', text: '开始交易以接收行为分析。', icon: ShieldCheck }];
    }

    const buyTrades = user.trades.filter(t => t.type === 'BUY');
    const sellTrades = user.trades.filter(t => t.type === 'SELL');

    // Check for FOMO (Buying after price increase)
    const fomoTrades = buyTrades.filter((t, i) => {
      if (i === buyTrades.length - 1) return false;
      return t.price > buyTrades[i+1].price;
    });

    if (fomoTrades.length > buyTrades.length * 0.6) {
      feedback.push({ 
        type: 'warning', 
        text: '检测到 FOMO 倾向：您倾向于在价格见顶时买入。', 
        icon: AlertCircle 
      });
    }

    // Check for Panic Selling
    const panicTrades = sellTrades.filter((t, i) => {
      if (i === sellTrades.length - 1) return false;
      return t.price < sellTrades[i+1].price;
    });

    if (panicTrades.length > sellTrades.length * 0.5) {
      feedback.push({ 
        type: 'warning', 
        text: '潜在的恐慌性抛售：您经常在轻微回调期间退出头寸。', 
        icon: Zap 
      });
    }

    if (feedback.length === 0) {
      feedback.push({ 
        type: 'positive', 
        text: '纪律严明：您的交易模式显示出理性的决策能力。', 
        icon: TrendingUp 
      });
    }

    return feedback;
  };

  const insights = analyzeBehavior();

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-rose-500" />
        行为反馈 (Behavioral Feedback)
      </h3>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-4 rounded-2xl flex items-start gap-3 border",
              insight.type === 'positive' ? "bg-rose-500/5 border-rose-500/10" : "bg-amber-500/5 border-amber-500/10"
            )}
          >
            <insight.icon className={cn(
              "w-5 h-5 mt-0.5",
              insight.type === 'positive' ? "text-rose-500" : "text-amber-500"
            )} />
            <p className={cn(
              "text-sm font-medium",
              insight.type === 'positive' ? "text-[var(--foreground)]" : "text-amber-600 dark:text-amber-400"
            )}>
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-[var(--muted)] rounded-2xl border border-[var(--border)]">
        <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">Pro Tip</p>
        <p className="text-xs text-[var(--muted-foreground)] italic">
          "The investor's chief problem—and even his worst enemy—is likely to be himself." — Benjamin Graham
        </p>
      </div>
    </div>
  );
}

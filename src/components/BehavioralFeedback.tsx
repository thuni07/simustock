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
      return [{ type: 'positive', text: 'Start trading to receive behavioral analysis.', icon: ShieldCheck }];
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
        text: 'Detected FOMO tendencies: You tend to buy when prices are peaking.', 
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
        text: 'Potential Panic Selling: You often exit positions during minor downturns.', 
        icon: Zap 
      });
    }

    if (feedback.length === 0) {
      feedback.push({ 
        type: 'positive', 
        text: 'Disciplined approach: Your trading patterns show rational decision making.', 
        icon: TrendingUp 
      });
    }

    return feedback;
  };

  const insights = analyzeBehavior();

  return (
    <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        Behavioral Feedback
      </h3>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-4 rounded-2xl flex items-start gap-3 border",
              insight.type === 'positive' ? "bg-emerald-500/5 border-emerald-500/10" : "bg-amber-500/5 border-amber-500/10"
            )}
          >
            <insight.icon className={cn(
              "w-5 h-5 mt-0.5",
              insight.type === 'positive' ? "text-emerald-400" : "text-amber-400"
            )} />
            <p className={cn(
              "text-sm font-medium",
              insight.type === 'positive' ? "text-emerald-100" : "text-amber-100"
            )}>
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Pro Tip</p>
        <p className="text-xs text-slate-400 italic">
          "The investor's chief problem—and even his worst enemy—is likely to be himself." — Benjamin Graham
        </p>
      </div>
    </div>
  );
}

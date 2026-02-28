import { useState, useEffect, useCallback } from 'react';
import { Stock, Agent, MarketShock, PricePoint } from '../types';
import { INITIAL_STOCKS, INITIAL_AGENTS } from '../constants';

export function useMarketSimulation() {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [shocks, setShocks] = useState<MarketShock[]>([]);
  const [marketSentiment, setMarketSentiment] = useState(0.5); // 0 to 1

  const simulateTick = useCallback(() => {
    setStocks(prevStocks => prevStocks.map(stock => {
      const recentChange = (stock.price - stock.history[stock.history.length - 1].price) / stock.price;

      // Calculate average agent sentiment for Herding effect
      const avgSentiment = agents.reduce((acc, a) => acc + a.sentiment, 0) / agents.length;

      // Calculate influence from agents with behavioral biases
      const agentInfluence = agents.reduce((acc, agent) => {
        if (!agent.active) return acc;
        
        let effectiveSentiment = agent.sentiment;
        
        // Behavioral Logic: Herding
        if (agent.biases.includes('Herding')) {
          effectiveSentiment = effectiveSentiment * 0.7 + avgSentiment * 0.3;
        }

        // Behavioral Logic: Panic Selling
        if (recentChange < -0.02 && agent.biases.includes('LossAversion')) {
          effectiveSentiment -= 0.2; // Panic drop
        }

        // Simple model: higher sentiment + capital = more upward pressure
        const pressure = effectiveSentiment * (Math.log10(agent.capital) / 10);
        return acc + pressure;
      }, 0);

      // Calculate influence from shocks
      const shockInfluence = shocks.reduce((acc, shock) => {
        const timeDecay = Math.max(0, 1 - (Date.now() - shock.timestamp) / 300000); // 5 min decay
        return acc + (shock.intensity * timeDecay);
      }, 0);

      const volatility = 0.002;
      const randomWalk = (Math.random() - 0.5) * 2 * volatility;
      const drift = 0.0001 + (agentInfluence * 0.001) + (shockInfluence * 0.005);
      
      const newPrice = Math.max(0.01, stock.price * (1 + drift + randomWalk));
      const newHistory: PricePoint[] = [
        ...stock.history.slice(-29),
        { time: new Date().toLocaleTimeString(), price: newPrice }
      ];

      // Calculate Behavioral Indices
      const panicIndex = Math.min(100, Math.max(0, 
        (recentChange < -0.01 ? Math.abs(recentChange) * 1000 : stock.panicIndex * 0.95)
      ));
      
      const herdingIntensity = Math.min(100, Math.max(0,
        (Math.abs(avgSentiment) * 100)
      ));

      return {
        ...stock,
        price: newPrice,
        change: newPrice - stock.history[0].price,
        changePercent: ((newPrice - stock.history[0].price) / stock.history[0].price) * 100,
        history: newHistory,
        panicIndex,
        herdingIntensity,
        sentiment: avgSentiment
      };
    }));

    // Update agent sentiments based on RL (learning from price movements)
    setAgents(prevAgents => prevAgents.map(agent => {
      // RL: Agents adjust sentiment based on whether their "strategy" would have been profitable
      // For simplicity, we just add some drift and market correlation
      const marketTrend = stocks.reduce((acc, s) => acc + s.changePercent, 0) / stocks.length;
      const rlAdjustment = marketTrend * agent.learningRate;
      
      return {
        ...agent,
        sentiment: Math.max(-1, Math.min(1, agent.sentiment + rlAdjustment + (Math.random() - 0.5) * 0.05))
      };
    }));
  }, [agents, shocks, stocks]);

  useEffect(() => {
    const interval = setInterval(simulateTick, 2000);
    return () => clearInterval(interval);
  }, [simulateTick]);

  const triggerShock = (type: MarketShock['type'], intensity: number, description: string) => {
    const newShock: MarketShock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      intensity,
      description,
      timestamp: Date.now()
    };
    setShocks(prev => [...prev, newShock]);
    // Auto remove old shocks after 10 mins
    setTimeout(() => {
      setShocks(prev => prev.filter(s => s.id !== newShock.id));
    }, 600000);
  };

  return { stocks, agents, shocks, triggerShock, marketSentiment };
}

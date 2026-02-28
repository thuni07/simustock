import { Stock, Agent, MarketShock } from './types';

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'TECH',
    name: 'Future Tech Corp',
    price: 150.25,
    change: 2.45,
    changePercent: 1.65,
    volume: 1200000,
    panicIndex: 12,
    herdingIntensity: 45,
    sentiment: 0.3,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
      price: 145 + Math.random() * 10
    }))
  },
  {
    symbol: 'BIO',
    name: 'BioGen Solutions',
    price: 85.40,
    change: -1.20,
    changePercent: -1.38,
    volume: 450000,
    panicIndex: 25,
    herdingIntensity: 60,
    sentiment: -0.1,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
      price: 80 + Math.random() * 10
    }))
  },
  {
    symbol: 'NRG',
    name: 'EcoEnergy Systems',
    price: 210.15,
    change: 5.30,
    changePercent: 2.58,
    volume: 800000,
    panicIndex: 8,
    herdingIntensity: 30,
    sentiment: 0.5,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
      price: 200 + Math.random() * 20
    }))
  }
];

export const INITIAL_AGENTS: Agent[] = [
  { id: '1', type: 'Retail', sentiment: 0.2, strategy: 'Trend Following', biases: ['FOMO', 'Herding'], capital: 50000, active: true, learningRate: 0.05 },
  { id: '2', type: 'Institutional', sentiment: -0.1, strategy: 'Value Investing', biases: ['LossAversion', 'MeanReversion'], capital: 5000000, active: true, learningRate: 0.01 },
  { id: '3', type: 'MarketMaker', sentiment: 0, strategy: 'Arbitrage', biases: ['Neutral'], capital: 10000000, active: true, learningRate: 0.001 },
  { id: '4', type: 'HFT', sentiment: 0.05, strategy: 'Scalping', biases: ['Momentum'], capital: 2000000, active: true, learningRate: 0.1 },
];

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: PricePoint[];
  volume: number;
  panicIndex: number; // 0-100
  herdingIntensity: number; // 0-100
  sentiment: number; // -1 to 1
}

export interface PricePoint {
  time: string;
  price: number;
}

export interface Agent {
  id: string;
  type: 'Retail' | 'Institutional' | 'MarketMaker' | 'HFT';
  sentiment: number; // -1 to 1
  strategy: string;
  biases: string[]; // ['FOMO', 'LossAversion', 'Herding', 'Overconfidence']
  capital: number;
  active: boolean;
  learningRate: number;
}

export interface MarketShock {
  id: string;
  type: 'Macro' | 'Policy' | 'Sentiment' | 'BlackSwan';
  intensity: number;
  description: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  userType: 'Novice' | 'Professional' | 'Institutional';
  balance: number;
  portfolio: { [symbol: string]: number };
  trades: Trade[];
  performanceFeedback?: string[];
  equityHistory: { time: string, value: number }[];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: number;
}

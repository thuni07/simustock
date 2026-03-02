import { Stock, Agent, MarketShock } from './types';

const SECTORS_DATA = [
  {
    name: '人工智能',
    stocks: [
      { code: '600801', symbol: 'TECH', name: 'Future Tech Corp', price: 72.33, changePercent: -6.15 },
      { code: '600802', symbol: 'AI', name: 'Artificial Intel', price: 55.43, changePercent: -7.78 },
      { code: '600803', symbol: 'DATA', name: 'BigData AI', price: 70.11, changePercent: -5.97 },
      { code: '600804', symbol: 'ROBOT', name: 'Robotics Corp', price: 53.43, changePercent: -7.21 },
      { code: '600805', symbol: 'CYBER', name: 'Cyber Security', price: 91.86, changePercent: -7.69 },
    ]
  },
  {
    name: '半导体',
    stocks: [
      { code: '600806', symbol: 'CHIP', name: 'ChipMaker Inc', price: 55.35, changePercent: -6.74 },
      { code: '600007', symbol: 'SEMI', name: 'Semiconductor Co', price: 58.95, changePercent: -4.74 },
      { code: '600008', symbol: '5G', name: '5G Networks', price: 38.00, changePercent: -5.34 },
    ]
  },
  {
    name: '生物医药',
    stocks: [
      { code: '600809', symbol: 'BIO', name: 'BioGen Solutions', price: 41.86, changePercent: -6.87 },
      { code: '600010', symbol: 'DRUG', name: 'Drug Pharma', price: 132.45, changePercent: -5.16 },
      { code: '600011', symbol: 'VACC', name: 'VaccineBio', price: 57.77, changePercent: -5.96 },
      { code: '600012', symbol: 'GENE', name: 'GeneEdit Tech', price: 201.23, changePercent: 4.23 },
      { code: '600013', symbol: 'MED', name: 'Medical Devices', price: 76.54, changePercent: -5.29 },
    ]
  },
  {
    name: '金融科技',
    stocks: [
      { code: '600814', symbol: 'BANK', name: 'China Bank', price: 90.84, changePercent: -6.77 },
      { code: '600102', symbol: 'FIN', name: 'Finance Group', price: 55.49, changePercent: -6.31 },
      { code: '600103', symbol: 'INS', name: 'Insurance Group', price: 43.67, changePercent: -7.13 },
      { code: '600104', symbol: 'INVEST', name: 'Investment Corp', price: 108.88, changePercent: -7.16 },
      { code: '600105', symbol: 'PAY', name: 'Payment Corp', price: 42.24, changePercent: -7.58 },
    ]
  },
  {
    name: '新能源车',
    stocks: [
      { code: '600819', symbol: 'EV', name: 'EV Energy', price: 114.70, changePercent: -7.39 },
      { code: '600502', symbol: 'AUTO', name: 'Auto Manufacturer', price: 123.45, changePercent: -5.65 },
      { code: '600503', symbol: 'BATTERY', name: 'Battery Tech', price: 234.56, changePercent: -6.96 },
    ]
  },
  {
    name: '工业互联',
    stocks: [
      { code: '600401', symbol: 'IND', name: 'Industrial Corp', price: 193.28, changePercent: -5.39 },
      { code: '600402', symbol: 'IOT', name: 'Industrial IoT', price: 88.88, changePercent: -4.21 },
    ]
  }
];

const generateStocks = (): Stock[] => {
  const stocks: Stock[] = [];
  const now = Date.now();

  SECTORS_DATA.forEach(sector => {
    sector.stocks.forEach(s => {
      const basePrice = s.price / (1 + s.changePercent / 100);
      const change = s.price - basePrice;
      
      stocks.push({
        symbol: s.symbol,
        code: s.code,
        name: s.name,
        sector: sector.name,
        price: s.price,
        change,
        changePercent: s.changePercent,
        volume: Math.floor(Math.random() * 2000000) + 100000,
        panicIndex: Math.floor(Math.random() * 30),
        herdingIntensity: Math.floor(Math.random() * 50),
        sentiment: (Math.random() - 0.5) * 0.6,
        peRatio: 10 + Math.random() * 40,
        pbRatio: 1 + Math.random() * 10,
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(now - (20 - i) * 60000).toLocaleTimeString(),
          price: basePrice + (Math.random() - 0.5) * (basePrice * 0.05)
        }))
      });
    });
  });

  return stocks;
};

export const INITIAL_STOCKS: Stock[] = generateStocks();

export const INITIAL_AGENTS: Agent[] = [
  { id: '1', type: 'Retail', sentiment: 0.2, strategy: 'Trend Following', biases: ['FOMO', 'Herding'], capital: 50000, active: true, learningRate: 0.05 },
  { id: '2', type: 'Institutional', sentiment: -0.1, strategy: 'Value Investing', biases: ['LossAversion', 'MeanReversion'], capital: 5000000, active: true, learningRate: 0.01 },
  { id: '3', type: 'MarketMaker', sentiment: 0, strategy: 'Arbitrage', biases: ['Neutral'], capital: 10000000, active: true, learningRate: 0.001 },
  { id: '4', type: 'HFT', sentiment: 0.05, strategy: 'Scalping', biases: ['Momentum'], capital: 2000000, active: true, learningRate: 0.1 },
];

export const MARKET_NEWS = [
  { id: 1, time: '10:24', type: '行情', icon: '📊', text: 'Simustock300指数早盘拉升，人工智能板块领涨', relatedStocks: ['TECH', 'AI', 'DATA'] },
  { id: 2, time: '10:15', type: '智能体', icon: '🤖', text: '机构智能体触发大额买入指令，TECH成交量激增300%', relatedStocks: ['TECH'] },
  { id: 3, time: '09:50', type: '异动', icon: '⚠️', text: 'BIO触发恐慌抛售警报，5分钟内跌幅扩大至5%', relatedStocks: ['BIO'] },
  { id: 4, time: '09:30', type: '板块', icon: '📈', text: '半导体板块12只成分股全线上涨，板块指数涨2.3%', relatedStocks: ['CHIP', 'SEMI'] },
  { id: 5, time: '09:15', type: '政策', icon: '📰', text: '政策智能体发布最新指引，鼓励长期价值投资', relatedStocks: [] },
  { id: 6, time: '09:00', type: '大单', icon: '💰', text: 'CYBER出现机构大单买入，单笔成交200万股', relatedStocks: ['CYBER'] },
  { id: 7, time: '08:45', type: '热点', icon: '🔥', text: '新能源车成市场热点，资金净流入居前', relatedStocks: ['EV', 'AUTO'] },
  { id: 8, time: '08:30', type: '智能体', icon: '🤖', text: '散户智能体恐慌情绪上升，抛售生物医药板块', relatedStocks: ['BIO', 'DRUG'] },
  { id: 9, time: '08:15', type: '行情', icon: '📊', text: '创业板指翻红，科技股集体反弹', relatedStocks: ['TECH', 'AI'] },
  { id: 10, time: '08:00', type: '政策', icon: '📰', text: '监管智能体发布新规，金融科技板块承压', relatedStocks: ['BANK', 'PAY'] },
  { id: 11, time: '07:45', type: '异动', icon: '⚠️', text: 'CHIP出现异常拉升，5分钟涨幅达3%', relatedStocks: ['CHIP'] },
  { id: 12, time: '07:30', type: '板块', icon: '📈', text: '工业互联板块获资金关注，多只个股走强', relatedStocks: ['IND', 'IOT'] },
  { id: 13, time: '07:15', type: '大单', icon: '💰', text: '机构大单卖出金融股，银行板块资金流出', relatedStocks: ['BANK'] },
  { id: 14, time: '07:00', type: '智能体', icon: '🤖', text: '做市商智能体在AI底部挂出百万级买单', relatedStocks: ['AI'] },
  { id: 15, time: '06:45', type: '热点', icon: '🔥', text: '人工智能主题持续发酵，相关ETF溢价', relatedStocks: ['TECH', 'AI'] },
  { id: 16, time: '06:30', type: '行情', icon: '📊', text: '两市成交额突破千亿，市场情绪回暖', relatedStocks: [] },
  { id: 17, time: '06:15', type: '异动', icon: '⚠️', text: '5G概念股突发跳水，板块跌幅扩大', relatedStocks: ['5G'] },
  { id: 18, time: '06:00', type: '政策', icon: '📰', text: '产业政策利好医药研发，创新药受关注', relatedStocks: ['DRUG', 'MED'] },
  { id: 19, time: '05:45', type: '板块', icon: '📈', text: '消费板块逆势走强，资金防御心态显现', relatedStocks: [] },
  { id: 20, time: '05:30', type: '大单', icon: '💰', text: '海外智能体大额买入EV，看好新能源前景', relatedStocks: ['EV'] },
];

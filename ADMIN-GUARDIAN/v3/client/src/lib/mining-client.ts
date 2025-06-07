import { 
  HardwareStatus, 
  LaptopInfo,
  MiningCommand, 
  MiningProfitability, 
  MiningSettings, 
  MiningStats,
  MiningReward,
  OptimalCoins
} from '@shared/schema';
import { apiRequest } from './queryClient';

export async function fetchMiningSettings(): Promise<MiningSettings> {
  const res = await apiRequest('GET', '/api/mining/settings', undefined);
  return res.json();
}

export async function updateMiningSettings(settings: Partial<MiningSettings>): Promise<MiningSettings> {
  const res = await apiRequest('PATCH', '/api/mining/settings', settings);
  return res.json();
}

export async function startMining(): Promise<void> {
  const command: MiningCommand = { command: 'start' };
  await apiRequest('POST', '/api/mining/control', command);
}

export async function stopMining(): Promise<void> {
  const command: MiningCommand = { command: 'stop' };
  await apiRequest('POST', '/api/mining/control', command);
}

export async function fetchRewards(): Promise<MiningReward[]> {
  const res = await apiRequest('GET', '/api/mining/rewards', undefined);
  return res.json();
}

export interface MiningState {
  hardwareStatus: HardwareStatus;
  miningStats: MiningStats;
  profitability: MiningProfitability;
  laptopInfo: LaptopInfo;
  optimalCoins: OptimalCoins[];
  performanceHistory: { time: string; hashrate: number }[];
  rewards: MiningReward[];
  miningSettings: MiningSettings;
}

// Clean initial state - no fake data, only empty states
export const initialMiningState: MiningState = {
  hardwareStatus: {
    gpuTemp: 0,
    gpuUtilization: 0,
    powerConsumption: 0,
    fans: []
  },
  miningStats: {
    hashrate: 0,
    avgHashrate: 0,
    acceptedShares: 0,
    rejectedShares: 0,
    difficulty: 0,
    successRate: 0,
    isActive: false
  },
  profitability: {
    dailyEarning: 0,
    weeklyEarning: 0,
    monthlyEarning: 0,
    powerCost: 0
  },
  laptopInfo: {
    model: "",
    gpu: "",
    cpuCores: 0,
    memory: 0
  },
  optimalCoins: [],
  performanceHistory: [],
  rewards: [],
  miningSettings: {
    id: 1,
    userId: 1,
    miningType: "pool",
    walletAddress: "bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6",
    workerName: "",
    pool: "",
    serverRegion: "",
    optimization: "balanced",
    powerCost: 0,
    isActive: false
  }
};

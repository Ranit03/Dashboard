// Core BlockDAG Types
export interface Block {
  hash: string;
  number: number;
  timestamp: number;
  parentHash: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  gasLimit: string;
  gasUsed: string;
  transactions: Transaction[];
  transactionCount: number;
  uncles: string[];
  nonce: string;
  mixHash: string;
  extraData: string;
  baseFeePerGas?: string;
}

export interface Transaction {
  hash: string;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string | null;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed?: string;
  input: string;
  nonce: number;
  status: number;
  timestamp: number;
  logs: Log[];
  type: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface Log {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
}

export interface Address {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  contractCode?: string;
  contractName?: string;
  contractAbi?: any[];
  createdAt?: number;
  lastActivity?: number;
}

// Plugin System Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  component: React.ComponentType<PluginProps>;
  hooks?: PluginHooks;
  config?: PluginConfig;
  permissions: PluginPermission[];
}

export type PluginCategory = 
  | 'debugging' 
  | 'analysis' 
  | 'monitoring' 
  | 'visualization' 
  | 'utility';

export interface PluginProps {
  data?: any;
  onUpdate?: (data: any) => void;
  config?: Record<string, any>;
}

export interface PluginHooks {
  onTransactionView?: (transaction: Transaction) => void;
  onBlockView?: (block: Block) => void;
  onAddressView?: (address: Address) => void;
  onInit?: () => void;
  onDestroy?: () => void;
}

export interface PluginConfig {
  settings: PluginSetting[];
  defaultValues: Record<string, any>;
}

export interface PluginSetting {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
  required?: boolean;
  description?: string;
}

export type PluginPermission = 
  | 'read:blocks' 
  | 'read:transactions' 
  | 'read:addresses' 
  | 'write:storage' 
  | 'network:external';

// Developer Tools Types
export interface ContractDiff {
  oldContract: ContractInfo;
  newContract: ContractInfo;
  differences: ContractDifference[];
}

export interface ContractInfo {
  address: string;
  name: string;
  sourceCode: string;
  abi: any[];
  bytecode: string;
  version: string;
  compiler: string;
}

export interface ContractDifference {
  type: 'added' | 'removed' | 'modified';
  category: 'function' | 'event' | 'variable' | 'modifier';
  name: string;
  oldValue?: string;
  newValue?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface GasAnalysis {
  transactionHash: string;
  totalGasUsed: number;
  gasLimit: number;
  gasPrice: string;
  gasEfficiency: number;
  operations: GasOperation[];
  recommendations: GasRecommendation[];
}

export interface GasOperation {
  opcode: string;
  gasCost: number;
  stackBefore: string[];
  stackAfter: string[];
  memoryBefore?: string;
  memoryAfter?: string;
  storageChanges?: StorageChange[];
}

export interface StorageChange {
  slot: string;
  oldValue: string;
  newValue: string;
}

export interface GasRecommendation {
  type: 'optimization' | 'warning' | 'info';
  message: string;
  potentialSavings?: number;
  codeLocation?: string;
}

// Wallet Monitoring Types
export interface WalletMonitor {
  address: string;
  name?: string;
  tags: string[];
  alerts: WalletAlert[];
  statistics: WalletStatistics;
  isActive: boolean;
  createdAt: number;
}

export interface WalletAlert {
  id: string;
  type: 'transaction' | 'balance' | 'contract_interaction';
  condition: AlertCondition;
  isActive: boolean;
  lastTriggered?: number;
  triggerCount: number;
}

export interface AlertCondition {
  type: 'balance_change' | 'transaction_value' | 'gas_price' | 'contract_call';
  operator: 'gt' | 'lt' | 'eq' | 'contains';
  value: string;
  threshold?: string;
}

export interface WalletStatistics {
  totalTransactions: number;
  totalValue: string;
  averageGasPrice: string;
  mostActiveDay: string;
  topInteractions: ContractInteraction[];
}

export interface ContractInteraction {
  contractAddress: string;
  contractName?: string;
  interactionCount: number;
  totalValue: string;
  lastInteraction: number;
}

// Analytics Types
export interface NetworkStatistics {
  blockTime: number;
  hashRate: string;
  difficulty: string;
  totalTransactions: number;
  activeAddresses: number;
  totalSupply: string;
  marketCap?: string;
  price?: string;
}

export interface ChartData {
  timestamp: number;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  data: ChartData[];
  period: '1h' | '24h' | '7d' | '30d' | '1y';
  metric: string;
}

// Search Types
export interface SearchResult {
  type: 'block' | 'transaction' | 'address' | 'contract';
  hash: string;
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  type?: SearchResult['type'][];
  dateRange?: {
    from: Date;
    to: Date;
  };
  valueRange?: {
    min: string;
    max: string;
  };
  gasRange?: {
    min: number;
    max: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

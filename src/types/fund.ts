export type TransactionType = '입금' | '지출';

export type BrotherName = '첫째' | '둘째' | '셋째' | '예금 이자' | string;

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  member: string; // 첫째, 둘째, 셋째, 예금 이자, 또는 지출 담당자/부모님
  category: string; // 정기적립, 예금이자, 부모님용돈, 생신/기념일, 병원/건강, 가족식사/여행, 기타
  amount: number;
  note: string;
}

export interface BrotherStatus {
  key: 'brother1' | 'brother2' | 'brother3';
  defaultRole: string; // '첫째', '둘째', '셋째'
  displayName: string;
  totalContributed: number;
  expectedContribution: number;
  isCurrentMonthPaid: boolean;
  streakMonths: number;
  history: Record<string, boolean>; // '2025-01': true/false
}

export interface FundSummary {
  currentBalance: number;
  totalDeposit: number;
  totalExpense: number;
  monthlyTarget: number; // 600,000 KRW
  currentMonthDeposit: number;
  currentMonthExpense: number;
  startDate: string;
  totalMonths: number;
  depositRate: number; // percentage
}

export interface DataSourceConfig {
  mode: 'demo' | 'live';
  url: string;
  sheetId: string;
  sheetName: string;
  lastSyncedAt: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  writeUrl?: string; // Optional separate Apps Script URL for appending
  isWritable?: boolean; // True if an Apps Script URL is configured for writing
}

export interface MonthlyAggregation {
  monthKey: string; // YYYY-MM
  label: string; // '25년 1월'
  deposit: number;
  expense: number;
  net: number;
  balance: number;
  brother1Paid: boolean;
  brother2Paid: boolean;
  brother3Paid: boolean;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

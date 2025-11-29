export interface FinancialReport {
  period: ReportPeriod;
  startDate: Date;
  endDate: Date;
  summary: FinancialSummary;
  categoryBreakdown: CategoryBreakdown[];
  trends: TrendData[];
  insights: Insight[];
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // Percentage
  transactionCount: number;
  averageTransactionAmount: number;
  topCategory: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  icon: string;
  color: string;
}

export interface TrendData {
  date: Date;
  income: number;
  expense: number;
  balance: number;
}

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  icon: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export enum InsightType {
  SPENDING_PATTERN = 'SPENDING_PATTERN',
  BUDGET_PERFORMANCE = 'BUDGET_PERFORMANCE',
  SAVINGS_GOAL = 'SAVINGS_GOAL',
  UNUSUAL_ACTIVITY = 'UNUSUAL_ACTIVITY',
  RECOMMENDATION = 'RECOMMENDATION'
}

export enum ReportPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  alertThreshold?: number; // Percentage (e.g., 80 for 80%)
  createdAt: Date;
  updatedAt: Date;
}

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export interface BudgetProgress {
  budget: Budget;
  percentageUsed: number;
  remaining: number;
  daysRemaining: number;
  isOverBudget: boolean;
  shouldAlert: boolean;
}

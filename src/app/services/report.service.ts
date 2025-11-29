import { Injectable } from '@angular/core';
import { Observable, of, map, combineLatest } from 'rxjs';
import { 
  FinancialReport, 
  ReportPeriod, 
  FinancialSummary, 
  CategoryBreakdown, 
  TrendData,
  Insight,
  InsightType 
} from '../models/report.model';
import { TransactionService } from './transaction.service';
import { DEFAULT_CATEGORIES } from '../models/category.model';
import { TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private transactionService: TransactionService) { }

  generateReport(period: ReportPeriod, customStart?: Date, customEnd?: Date): Observable<FinancialReport> {
    const { startDate, endDate } = this.getPeriodDates(period, customStart, customEnd);

    return this.transactionService.getTransactions().pipe(
      map(allTransactions => {
        // Filter transactions for the period
        const transactions = allTransactions.filter(t => {
          const date = new Date(t.date);
          return date >= startDate && date <= endDate;
        });

        // Calculate summary
        const summary = this.calculateSummary(transactions);

        // Calculate category breakdown
        const categoryBreakdown = this.calculateCategoryBreakdown(transactions);

        // Generate trend data
        const trends = this.generateTrendData(transactions, startDate, endDate);

        // Generate insights
        const insights = this.generateInsights(summary, categoryBreakdown, transactions);

        return {
          period,
          startDate,
          endDate,
          summary,
          categoryBreakdown,
          trends,
          insights
        };
      })
    );
  }

  private getPeriodDates(period: ReportPeriod, customStart?: Date, customEnd?: Date): { startDate: Date, endDate: Date } {
    const today = new Date();
    let startDate: Date;
    let endDate = new Date(today);

    switch (period) {
      case ReportPeriod.WEEKLY:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case ReportPeriod.MONTHLY:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case ReportPeriod.QUARTERLY:
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
        break;
      case ReportPeriod.YEARLY:
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case ReportPeriod.CUSTOM:
        startDate = customStart || new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = customEnd || today;
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return { startDate, endDate };
  }

  private calculateSummary(transactions: any[]): FinancialSummary {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const categoryCount: Record<string, number> = {};
    transactions.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    const averageTransactionAmount = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      transactionCount: transactions.length,
      averageTransactionAmount,
      topCategory
    };
  }

  private calculateCategoryBreakdown(transactions: any[]): CategoryBreakdown[] {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: Record<string, { amount: number; count: number }> = {};

    expenseTransactions.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { amount: 0, count: 0 };
      }
      categoryMap[t.category].amount += t.amount;
      categoryMap[t.category].count += 1;
    });

    return Object.entries(categoryMap)
      .map(([categoryName, data]) => {
        const category = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
        return {
          category: categoryName,
          amount: data.amount,
          percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
          transactionCount: data.count,
          icon: category?.icon || '📊',
          color: category?.color || '#64748b'
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  private generateTrendData(transactions: any[], startDate: Date, endDate: Date): TrendData[] {
    const days: Record<string, { income: number; expense: number }> = {};

    // Initialize all days in the period
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      days[dateKey] = { income: 0, expense: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate transactions by day
    transactions.forEach(t => {
      const dateKey = new Date(t.date).toISOString().split('T')[0];
      if (days[dateKey]) {
        if (t.type === TransactionType.INCOME) {
          days[dateKey].income += t.amount;
        } else {
          days[dateKey].expense += t.amount;
        }
      }
    });

    // Convert to trend data with running balance
    let balance = 0;
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        balance += data.income - data.expense;
        return {
          date: new Date(date),
          income: data.income,
          expense: data.expense,
          balance
        };
      });
  }

  private generateInsights(
    summary: FinancialSummary, 
    breakdown: CategoryBreakdown[], 
    transactions: any[]
  ): Insight[] {
    const insights: Insight[] = [];

    // Savings rate insight
    if (summary.savingsRate > 20) {
      insights.push({
        type: InsightType.SAVINGS_GOAL,
        title: 'Great Savings Rate!',
        description: `You're saving ${summary.savingsRate.toFixed(1)}% of your income. Keep up the good work!`,
        icon: '🎯',
        severity: 'success'
      });
    } else if (summary.savingsRate < 10) {
      insights.push({
        type: InsightType.SAVINGS_GOAL,
        title: 'Low Savings Rate',
        description: `Your savings rate is ${summary.savingsRate.toFixed(1)}%. Consider reducing expenses to save more.`,
        icon: '⚠️',
        severity: 'warning'
      });
    }

    // Top spending category
    if (breakdown.length > 0) {
      const topCategory = breakdown[0];
      if (topCategory.percentage > 30) {
        insights.push({
          type: InsightType.SPENDING_PATTERN,
          title: 'High Spending in One Category',
          description: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your expenses.`,
          icon: topCategory.icon,
          severity: 'warning'
        });
      }
    }

    // Transaction frequency
    const avgTransactionsPerDay = transactions.length / 30;
    if (avgTransactionsPerDay > 5) {
      insights.push({
        type: InsightType.SPENDING_PATTERN,
        title: 'Frequent Transactions',
        description: `You're making an average of ${avgTransactionsPerDay.toFixed(1)} transactions per day.`,
        icon: '📊',
        severity: 'info'
      });
    }

    // Positive net savings
    if (summary.netSavings > 0) {
      insights.push({
        type: InsightType.BUDGET_PERFORMANCE,
        title: 'Positive Balance',
        description: `You have a positive balance of $${summary.netSavings.toFixed(2)} for this period.`,
        icon: '✅',
        severity: 'success'
      });
    } else {
      insights.push({
        type: InsightType.BUDGET_PERFORMANCE,
        title: 'Deficit Alert',
        description: `You're spending $${Math.abs(summary.netSavings).toFixed(2)} more than you earn.`,
        icon: '❌',
        severity: 'error'
      });
    }

    return insights;
  }
}

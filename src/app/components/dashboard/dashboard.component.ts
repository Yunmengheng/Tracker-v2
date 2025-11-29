import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TransactionService } from '../../services/transaction.service';
import { BudgetService } from '../../services/budget.service';
import { ReportService } from '../../services/report.service';
import { ReportPeriod } from '../../models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalIncome = signal(0);
  totalExpenses = signal(0);
  netSavings = signal(0);
  savingsRate = signal(0);
  recentTransactions = signal<any[]>([]);
  budgetProgress = signal<any[]>([]);
  loading = signal(true);

  // Chart configurations
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Income',
        fill: false,
        tension: 0.4,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981'
      },
      {
        data: [],
        label: 'Expenses',
        fill: false,
        tension: 0.4,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ef4444'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#10b981',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#06b6d4'
      ]
    }]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  public chartType: ChartType = 'line';

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    // Get current month date range
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Load financial summary
    this.transactionService.getTotalIncome(startOfMonth, endOfMonth).subscribe(income => {
      this.totalIncome.set(income);
    });

    this.transactionService.getTotalExpenses(startOfMonth, endOfMonth).subscribe(expenses => {
      this.totalExpenses.set(expenses);
      this.netSavings.set(this.totalIncome() - expenses);
      const rate = this.totalIncome() > 0 ? ((this.totalIncome() - expenses) / this.totalIncome()) * 100 : 0;
      this.savingsRate.set(rate);
    });

    // Load recent transactions
    this.transactionService.getRecentTransactions(5).subscribe(transactions => {
      this.recentTransactions.set(transactions);
    });

    // Load budget progress
    this.budgetService.getAllBudgetProgress().subscribe(progress => {
      this.budgetProgress.set(progress);
    });

    // Load report data for charts
    this.reportService.generateReport(ReportPeriod.MONTHLY).subscribe(report => {
      // Update line chart with trend data
      const last7Days = report.trends.slice(-7);
      this.lineChartData.labels = last7Days.map(t => 
        new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
      this.lineChartData.datasets[0].data = last7Days.map(t => t.income);
      this.lineChartData.datasets[1].data = last7Days.map(t => t.expense);

      // Update doughnut chart with category breakdown
      const topCategories = report.categoryBreakdown.slice(0, 7);
      this.doughnutChartData.labels = topCategories.map(c => c.category);
      this.doughnutChartData.datasets[0].data = topCategories.map(c => c.amount);
      this.doughnutChartData.datasets[0].backgroundColor = topCategories.map(c => c.color);

      this.loading.set(false);
    });
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '📄',
      'Healthcare': '🏥',
      'Housing': '🏠',
      'Salary': '💰',
      'Freelance': '💼'
    };
    return icons[category] || '💳';
  }

  getTransactionClass(type: string): string {
    return type === 'INCOME' ? 'income' : 'expense';
  }
}

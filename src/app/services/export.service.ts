import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Budget } from '../models/budget.model';
import { FinancialReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportTransactionsToCSV(transactions: Transaction[]): Observable<string> {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Payment Method'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.amount.toFixed(2),
      t.description,
      t.paymentMethod || 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return of(csv);
  }

  exportBudgetsToCSV(budgets: Budget[]): Observable<string> {
    const headers = ['Name', 'Category', 'Amount', 'Spent', 'Remaining', 'Period', 'Start Date', 'End Date'];
    const rows = budgets.map(b => [
      b.name,
      b.category,
      b.amount.toFixed(2),
      b.spent.toFixed(2),
      (b.amount - b.spent).toFixed(2),
      b.period,
      new Date(b.startDate).toLocaleDateString(),
      new Date(b.endDate).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return of(csv);
  }

  exportReportToCSV(report: FinancialReport): Observable<string> {
    const lines = [
      `Financial Report - ${report.period}`,
      `Period: ${new Date(report.startDate).toLocaleDateString()} to ${new Date(report.endDate).toLocaleDateString()}`,
      '',
      'Summary',
      `Total Income,${report.summary.totalIncome.toFixed(2)}`,
      `Total Expenses,${report.summary.totalExpenses.toFixed(2)}`,
      `Net Savings,${report.summary.netSavings.toFixed(2)}`,
      `Savings Rate,${report.summary.savingsRate.toFixed(2)}%`,
      '',
      'Category Breakdown',
      'Category,Amount,Percentage,Transactions',
      ...report.categoryBreakdown.map(c => 
        `"${c.category}",${c.amount.toFixed(2)},${c.percentage.toFixed(2)}%,${c.transactionCount}`
      )
    ];

    return of(lines.join('\n'));
  }

  downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(data: any, filename: string): Observable<boolean> {
    // In a real application, you would use a library like jsPDF
    console.log('PDF export would be implemented here', data, filename);
    alert('PDF export feature will be implemented with jsPDF library');
    return of(true);
  }
}

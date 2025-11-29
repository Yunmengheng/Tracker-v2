import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, delay, map } from 'rxjs';
import { Transaction, TransactionType, TransactionFilter, PaymentMethod } from '../models/transaction.model';
import { DEFAULT_CATEGORIES } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadMockTransactions();
  }

  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    let transactions = this.transactionsSubject.value;

    if (filter) {
      transactions = this.applyFilter(transactions, filter);
    }

    return of(transactions);
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    const transaction = this.transactionsSubject.value.find(t => t.id === id);
    return of(transaction).pipe(delay(300));
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Observable<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const transactions = [...this.transactionsSubject.value, newTransaction];
    this.transactionsSubject.next(transactions);
    this.saveToStorage(transactions);

    return of(newTransaction).pipe(delay(500));
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    const transactions = this.transactionsSubject.value.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    );

    this.transactionsSubject.next(transactions);
    this.saveToStorage(transactions);

    const updated = transactions.find(t => t.id === id)!;
    return of(updated).pipe(delay(500));
  }

  deleteTransaction(id: string): Observable<boolean> {
    const transactions = this.transactionsSubject.value.filter(t => t.id !== id);
    this.transactionsSubject.next(transactions);
    this.saveToStorage(transactions);

    return of(true).pipe(delay(500));
  }

  getRecentTransactions(limit: number = 10): Observable<Transaction[]> {
    const recent = [...this.transactionsSubject.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    return of(recent);
  }

  getTotalIncome(startDate?: Date, endDate?: Date): Observable<number> {
    const total = this.calculateTotal(TransactionType.INCOME, startDate, endDate);
    return of(total);
  }

  getTotalExpenses(startDate?: Date, endDate?: Date): Observable<number> {
    const total = this.calculateTotal(TransactionType.EXPENSE, startDate, endDate);
    return of(total);
  }

  private calculateTotal(type: TransactionType, startDate?: Date, endDate?: Date): number {
    return this.transactionsSubject.value
      .filter(t => {
        if (t.type !== type) return false;
        if (startDate && new Date(t.date) < startDate) return false;
        if (endDate && new Date(t.date) > endDate) return false;
        return true;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private applyFilter(transactions: Transaction[], filter: TransactionFilter): Transaction[] {
    return transactions.filter(t => {
      if (filter.type && t.type !== filter.type) return false;
      if (filter.category && t.category !== filter.category) return false;
      if (filter.dateFrom && new Date(t.date) < filter.dateFrom) return false;
      if (filter.dateTo && new Date(t.date) > filter.dateTo) return false;
      if (filter.minAmount && t.amount < filter.minAmount) return false;
      if (filter.maxAmount && t.amount > filter.maxAmount) return false;
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return t.description.toLowerCase().includes(searchLower) ||
               t.category.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  private loadMockTransactions(): void {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const transactions = JSON.parse(stored);
        this.transactionsSubject.next(transactions);
        return;
      } catch (e) {
        // Continue to load mock data
      }
    }

    // Generate mock transactions for the last 30 days
    const mockTransactions: Transaction[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add 2-4 transactions per day
      const transactionsPerDay = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < transactionsPerDay; j++) {
        const isIncome = Math.random() > 0.7;
        const type = isIncome ? TransactionType.INCOME : TransactionType.EXPENSE;
        const categories = DEFAULT_CATEGORIES.filter(c => c.type === type);
        const category = categories[Math.floor(Math.random() * categories.length)];

        mockTransactions.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: '1',
          type,
          category: category.name,
          amount: parseFloat((Math.random() * (isIncome ? 2000 : 200) + (isIncome ? 500 : 10)).toFixed(2)),
          description: this.getRandomDescription(category.name, type),
          date,
          paymentMethod: this.getRandomPaymentMethod(),
          tags: [],
          recurring: false,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    this.transactionsSubject.next(mockTransactions);
    this.saveToStorage(mockTransactions);
  }

  private getRandomDescription(category: string, type: TransactionType): string {
    const descriptions: Record<string, string[]> = {
      'Salary': ['Monthly Salary', 'Paycheck', 'Salary Payment'],
      'Freelance': ['Freelance Project', 'Client Payment', 'Consulting Fee'],
      'Food & Dining': ['Grocery Shopping', 'Restaurant', 'Coffee Shop', 'Fast Food'],
      'Transportation': ['Gas Station', 'Uber Ride', 'Public Transport', 'Parking'],
      'Shopping': ['Online Shopping', 'Clothing Store', 'Electronics', 'Home Decor'],
      'Entertainment': ['Movie Tickets', 'Concert', 'Streaming Service', 'Gaming'],
      'Bills & Utilities': ['Electricity Bill', 'Internet Bill', 'Water Bill', 'Phone Bill'],
      'Healthcare': ['Pharmacy', 'Doctor Visit', 'Health Insurance', 'Medical Test'],
      'Housing': ['Rent Payment', 'Mortgage', 'Home Maintenance', 'Property Tax']
    };

    const categoryDescriptions = descriptions[category] || ['Transaction'];
    return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
  }

  private getRandomPaymentMethod(): PaymentMethod {
    const methods = [
      PaymentMethod.CASH,
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.DEBIT_CARD,
      PaymentMethod.DIGITAL_WALLET
    ];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  private saveToStorage(transactions: Transaction[]): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
}

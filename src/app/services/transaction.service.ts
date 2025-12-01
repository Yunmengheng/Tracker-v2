import { Injectable, inject } from '@angular/core';
import { Observable, of, BehaviorSubject, delay, map } from 'rxjs';
import { Transaction, TransactionType, TransactionFilter, PaymentMethod } from '../models/transaction.model';
import { DEFAULT_CATEGORIES } from '../models/category.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private authService = inject(AuthService);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadTransactions();
    
    // Reload transactions when user logs in/out
    this.authService.currentUser$.subscribe(user => {
      this.loadTransactions();
    });
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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
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

  private loadTransactions(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      // No user logged in, clear transactions
      this.transactionsSubject.next([]);
      return;
    }

    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const allTransactions = JSON.parse(stored);
        // Filter to only show current user's transactions
        const userTransactions = allTransactions.filter((t: Transaction) => t.userId === currentUser.id);
        this.transactionsSubject.next(userTransactions);
        return;
      } catch (e) {
        // If parsing fails, start with empty array
        this.transactionsSubject.next([]);
      }
    } else {
      // No stored transactions, start with empty array
      this.transactionsSubject.next([]);
    }
  }

  private saveToStorage(transactions: Transaction[]): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Load all transactions from storage
    const stored = localStorage.getItem('transactions');
    let allTransactions: Transaction[] = [];
    
    if (stored) {
      try {
        allTransactions = JSON.parse(stored);
        // Remove current user's old transactions
        allTransactions = allTransactions.filter(t => t.userId !== currentUser.id);
      } catch (e) {
        allTransactions = [];
      }
    }

    // Add current user's updated transactions
    allTransactions = [...allTransactions, ...transactions];
    
    localStorage.setItem('transactions', JSON.stringify(allTransactions));
  }
}

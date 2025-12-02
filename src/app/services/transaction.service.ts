import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, of } from 'rxjs';
import { Transaction, TransactionType, TransactionFilter, PaymentMethod } from '../models/transaction.model';
import { DEFAULT_CATEGORIES } from '../models/category.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_URL = environment.apiUrl;
  
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
    if (!this.authService.getCurrentUser()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    let transactions = this.transactionsSubject.value;

    if (filter) {
      transactions = this.applyFilter(transactions, filter);
    }

    return of(transactions);
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    const transaction = this.transactionsSubject.value.find(t => t.id === id);
    return of(transaction);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Observable<Transaction> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.post<Transaction>(`${this.API_URL}/transactions`, transaction).pipe(
      tap(newTransaction => {
        const transactions = [...this.transactionsSubject.value, newTransaction];
        this.transactionsSubject.next(transactions);
      }),
      catchError(error => {
        console.error('Add transaction error:', error);
        return throwError(() => new Error('Failed to add transaction'));
      })
    );
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.API_URL}/transactions/${id}`, updates).pipe(
      tap(updatedTransaction => {
        const transactions = this.transactionsSubject.value.map(t =>
          t.id === id ? { ...t, ...updatedTransaction } : t
        );
        this.transactionsSubject.next(transactions);
      }),
      catchError(error => {
        console.error('Update transaction error:', error);
        return throwError(() => new Error('Failed to update transaction'));
      })
    );
  }

  deleteTransaction(id: string): Observable<boolean> {
    return this.http.delete<{success: boolean}>(`${this.API_URL}/transactions/${id}`).pipe(
      tap(() => {
        const transactions = this.transactionsSubject.value.filter(t => t.id !== id);
        this.transactionsSubject.next(transactions);
      }),
      map(() => true),
      catchError(error => {
        console.error('Delete transaction error:', error);
        return throwError(() => new Error('Failed to delete transaction'));
      })
    );
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
      this.transactionsSubject.next([]);
      return;
    }

    this.http.get<Transaction[]>(`${this.API_URL}/transactions`).pipe(
      catchError(error => {
        console.error('Load transactions error:', error);
        return new Observable<Transaction[]>(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    ).subscribe(transactions => {
      this.transactionsSubject.next(transactions);
    });
  }
}

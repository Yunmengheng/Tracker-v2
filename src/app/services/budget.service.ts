import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, tap, catchError, throwError, map } from 'rxjs';
import { Budget, BudgetPeriod, BudgetProgress } from '../models/budget.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetsSubject.asObservable();
  private API_URL = environment.apiUrl;

  constructor() {
    this.loadBudgets();
    
    // Reload budgets when user logs in/out
    this.authService.currentUser$.subscribe(user => {
      this.loadBudgets();
    });
  }

  getBudgets(): Observable<Budget[]> {
    return of(this.budgetsSubject.value);
  }

  getBudgetById(id: string): Observable<Budget | undefined> {
    const budget = this.budgetsSubject.value.find(b => b.id === id);
    return of(budget);
  }

  addBudget(budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>): Observable<Budget> {
    return this.http.post<Budget>(`${this.API_URL}/budgets`, budget).pipe(
      tap(newBudget => {
        const budgets = [...this.budgetsSubject.value, newBudget];
        this.budgetsSubject.next(budgets);
      }),
      catchError(error => {
        console.error('Add budget error:', error);
        return throwError(() => new Error('Failed to add budget'));
      })
    );
  }

  updateBudget(id: string, updates: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.API_URL}/budgets/${id}`, updates).pipe(
      tap(updatedBudget => {
        const budgets = this.budgetsSubject.value.map(b =>
          b.id === id ? updatedBudget : b
        );
        this.budgetsSubject.next(budgets);
      }),
      catchError(error => {
        console.error('Update budget error:', error);
        return throwError(() => new Error('Failed to update budget'));
      })
    );
  }

  deleteBudget(id: string): Observable<boolean> {
    return this.http.delete<{success: boolean}>(`${this.API_URL}/budgets/${id}`).pipe(
      tap(() => {
        const budgets = this.budgetsSubject.value.filter(b => b.id !== id);
        this.budgetsSubject.next(budgets);
      }),
      map(() => true),
      catchError(error => {
        console.error('Delete budget error:', error);
        return throwError(() => new Error('Failed to delete budget'));
      })
    );
  }

  updateBudgetSpent(category: string, amount: number): void {
    const budget = this.budgetsSubject.value.find(b => b.category === category);
    if (budget) {
      this.updateBudget(budget.id, { spent: budget.spent + amount }).subscribe();
    }
  }

  getBudgetProgress(budgetId: string): Observable<BudgetProgress | null> {
    const budget = this.budgetsSubject.value.find(b => b.id === budgetId);
    
    if (!budget) {
      return of(null);
    }

    const percentageUsed = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    const today = new Date();
    const endDate = new Date(budget.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const isOverBudget = budget.spent > budget.amount;
    const shouldAlert = budget.alertThreshold ? percentageUsed >= budget.alertThreshold : false;

    const progress: BudgetProgress = {
      budget,
      percentageUsed,
      remaining,
      daysRemaining,
      isOverBudget,
      shouldAlert
    };

    return of(progress);
  }

  getAllBudgetProgress(): Observable<BudgetProgress[]> {
    const progressList = this.budgetsSubject.value.map(budget => {
      const percentageUsed = (budget.spent / budget.amount) * 100;
      const remaining = budget.amount - budget.spent;
      const today = new Date();
      const endDate = new Date(budget.endDate);
      const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const isOverBudget = budget.spent > budget.amount;
      const shouldAlert = budget.alertThreshold ? percentageUsed >= budget.alertThreshold : false;

      return {
        budget,
        percentageUsed,
        remaining,
        daysRemaining,
        isOverBudget,
        shouldAlert
      };
    });

    return of(progressList);
  }

  private loadBudgets(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.budgetsSubject.next([]);
      return;
    }

    this.http.get<Budget[]>(`${this.API_URL}/budgets`).pipe(
      catchError(error => {
        console.error('Load budgets error:', error);
        return of([]);
      })
    ).subscribe(budgets => {
      this.budgetsSubject.next(budgets);
    });
  }
}

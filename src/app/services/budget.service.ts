import { Injectable, inject } from '@angular/core';
import { Observable, of, BehaviorSubject, delay } from 'rxjs';
import { Budget, BudgetPeriod, BudgetProgress } from '../models/budget.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private authService = inject(AuthService);
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetsSubject.asObservable();

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
    return of(budget).pipe(delay(300));
  }

  addBudget(budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>): Observable<Budget> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const budgets = [...this.budgetsSubject.value, newBudget];
    this.budgetsSubject.next(budgets);
    this.saveToStorage(budgets);

    return of(newBudget).pipe(delay(500));
  }

  updateBudget(id: string, updates: Partial<Budget>): Observable<Budget> {
    const budgets = this.budgetsSubject.value.map(b =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    );

    this.budgetsSubject.next(budgets);
    this.saveToStorage(budgets);

    const updated = budgets.find(b => b.id === id)!;
    return of(updated).pipe(delay(500));
  }

  deleteBudget(id: string): Observable<boolean> {
    const budgets = this.budgetsSubject.value.filter(b => b.id !== id);
    this.budgetsSubject.next(budgets);
    this.saveToStorage(budgets);

    return of(true).pipe(delay(500));
  }

  updateBudgetSpent(category: string, amount: number): void {
    const budgets = this.budgetsSubject.value.map(b => {
      if (b.category === category) {
        return { ...b, spent: b.spent + amount, updatedAt: new Date() };
      }
      return b;
    });

    this.budgetsSubject.next(budgets);
    this.saveToStorage(budgets);
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
      // No user logged in, clear budgets
      this.budgetsSubject.next([]);
      return;
    }

    const stored = localStorage.getItem('budgets');
    if (stored) {
      try {
        const allBudgets = JSON.parse(stored);
        // Filter to only show current user's budgets
        const userBudgets = allBudgets.filter((b: Budget) => b.userId === currentUser.id);
        this.budgetsSubject.next(userBudgets);
        return;
      } catch (e) {
        // If parsing fails, start with empty array
        this.budgetsSubject.next([]);
      }
    } else {
      // No stored budgets, start with empty array
      this.budgetsSubject.next([]);
    }
  }

  private saveToStorage(budgets: Budget[]): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Load all budgets from storage
    const stored = localStorage.getItem('budgets');
    let allBudgets: Budget[] = [];
    
    if (stored) {
      try {
        allBudgets = JSON.parse(stored);
        // Remove current user's old budgets
        allBudgets = allBudgets.filter(b => b.userId !== currentUser.id);
      } catch (e) {
        allBudgets = [];
      }
    }

    // Add current user's updated budgets
    allBudgets = [...allBudgets, ...budgets];
    
    localStorage.setItem('budgets', JSON.stringify(allBudgets));
  }
}

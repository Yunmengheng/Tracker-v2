import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, delay } from 'rxjs';
import { Budget, BudgetPeriod, BudgetProgress } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetsSubject.asObservable();

  constructor() {
    this.loadMockBudgets();
  }

  getBudgets(): Observable<Budget[]> {
    return of(this.budgetsSubject.value);
  }

  getBudgetById(id: string): Observable<Budget | undefined> {
    const budget = this.budgetsSubject.value.find(b => b.id === id);
    return of(budget).pipe(delay(300));
  }

  addBudget(budget: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>): Observable<Budget> {
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
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

  private loadMockBudgets(): void {
    const stored = localStorage.getItem('budgets');
    if (stored) {
      try {
        const budgets = JSON.parse(stored);
        this.budgetsSubject.next(budgets);
        return;
      } catch (e) {
        // Continue to load mock data
      }
    }

    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const mockBudgets: Budget[] = [
      {
        id: '1',
        userId: '1',
        name: 'Food & Dining Budget',
        category: 'Food & Dining',
        amount: 500,
        spent: 342.50,
        period: BudgetPeriod.MONTHLY,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: endOfMonth,
        alertThreshold: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: '1',
        name: 'Transportation Budget',
        category: 'Transportation',
        amount: 300,
        spent: 187.25,
        period: BudgetPeriod.MONTHLY,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: endOfMonth,
        alertThreshold: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        userId: '1',
        name: 'Entertainment Budget',
        category: 'Entertainment',
        amount: 200,
        spent: 156.80,
        period: BudgetPeriod.MONTHLY,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: endOfMonth,
        alertThreshold: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.budgetsSubject.next(mockBudgets);
    this.saveToStorage(mockBudgets);
  }

  private saveToStorage(budgets: Budget[]): void {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }
}

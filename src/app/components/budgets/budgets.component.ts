import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { Budget, BudgetPeriod } from '../../models/budget.model';
import { DEFAULT_CATEGORIES } from '../../models/category.model';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit {
  budgets = signal<any[]>([]);
  showAddModal = signal(false);
  editingBudget = signal<Budget | null>(null);
  categories = DEFAULT_CATEGORIES.filter(c => c.type === 'EXPENSE');

  formName = '';
  formCategory = '';
  formAmount = 0;
  formPeriod: BudgetPeriod = BudgetPeriod.MONTHLY;
  formAlertThreshold = 80;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getAllBudgetProgress().subscribe(budgets => {
      this.budgets.set(budgets);
    });
  }

  editBudget(budget: Budget): void {
    this.editingBudget.set(budget);
    this.formName = budget.name;
    this.formCategory = budget.category;
    this.formAmount = budget.amount;
    this.formPeriod = budget.period;
    this.formAlertThreshold = budget.alertThreshold || 80;
    this.showAddModal.set(true);
  }

  deleteBudget(id: string): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe(() => {
        this.loadBudgets();
      });
    }
  }

  saveBudget(): void {
    const today = new Date();
    const data = {
      userId: '1',
      name: this.formName,
      category: this.formCategory,
      amount: this.formAmount,
      period: this.formPeriod,
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      alertThreshold: this.formAlertThreshold
    };

    if (this.editingBudget()) {
      this.budgetService.updateBudget(this.editingBudget()!.id, data).subscribe(() => {
        this.closeModal();
        this.loadBudgets();
      });
    } else {
      this.budgetService.addBudget(data).subscribe(() => {
        this.closeModal();
        this.loadBudgets();
      });
    }
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.editingBudget.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formName = '';
    this.formCategory = '';
    this.formAmount = 0;
    this.formPeriod = BudgetPeriod.MONTHLY;
    this.formAlertThreshold = 80;
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.name === category);
    return cat?.icon || '💰';
  }
}

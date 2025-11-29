import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionType, TransactionFilter } from '../../models/transaction.model';
import { DEFAULT_CATEGORIES } from '../../models/category.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
  categories = DEFAULT_CATEGORIES;
  showAddModal = signal(false);
  editingTransaction = signal<Transaction | null>(null);
  filterType = '';
  filterCategory = '';
  searchTerm = '';
  formType: TransactionType = TransactionType.EXPENSE;
  formCategory = '';
  formAmount = 0;
  formDescription = '';
  formDate = new Date().toISOString().split('T')[0];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void { this.loadTransactions(); }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions.set(transactions);
      this.filteredTransactions.set(transactions);
    });
  }

  applyFilters(): void {
    const filter: TransactionFilter = {
      type: this.filterType as TransactionType || undefined,
      category: this.filterCategory || undefined,
      searchTerm: this.searchTerm || undefined
    };
    this.transactionService.getTransactions(filter).subscribe(filtered => {
      this.filteredTransactions.set(filtered);
    });
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.name === category);
    return cat?.icon || '';
  }

  getFilteredCategories() {
    return this.categories.filter(c => c.type === this.formType);
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransaction.set(transaction);
    this.formType = transaction.type;
    this.formCategory = transaction.category;
    this.formAmount = transaction.amount;
    this.formDescription = transaction.description;
    this.formDate = new Date(transaction.date).toISOString().split('T')[0];
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
        this.applyFilters();
      });
    }
  }

  saveTransaction(): void {
    const data = { userId: '1', type: this.formType, category: this.formCategory, amount: this.formAmount, description: this.formDescription, date: new Date(this.formDate) };
    if (this.editingTransaction()) {
      this.transactionService.updateTransaction(this.editingTransaction()!.id, data).subscribe(() => {
        this.closeModal(); this.loadTransactions(); this.applyFilters();
      });
    } else {
      this.transactionService.addTransaction(data).subscribe(() => {
        this.closeModal(); this.loadTransactions(); this.applyFilters();
      });
    }
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.editingTransaction.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formType = TransactionType.EXPENSE;
    this.formCategory = '';
    this.formAmount = 0;
    this.formDescription = '';
    this.formDate = new Date().toISOString().split('T')[0];
  }
}

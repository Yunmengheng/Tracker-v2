export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  { id: 'income-1', name: 'Salary', type: 'INCOME', icon: '💰', color: '#10b981', isDefault: true },
  { id: 'income-2', name: 'Freelance', type: 'INCOME', icon: '💼', color: '#3b82f6', isDefault: true },
  { id: 'income-3', name: 'Investment', type: 'INCOME', icon: '📈', color: '#8b5cf6', isDefault: true },
  { id: 'income-4', name: 'Gift', type: 'INCOME', icon: '🎁', color: '#ec4899', isDefault: true },
  { id: 'income-5', name: 'Other Income', type: 'INCOME', icon: '➕', color: '#14b8a6', isDefault: true },
  
  // Expense Categories
  { id: 'expense-1', name: 'Food & Dining', type: 'EXPENSE', icon: '🍽️', color: '#ef4444', isDefault: true },
  { id: 'expense-2', name: 'Transportation', type: 'EXPENSE', icon: '🚗', color: '#f59e0b', isDefault: true },
  { id: 'expense-3', name: 'Shopping', type: 'EXPENSE', icon: '🛍️', color: '#ec4899', isDefault: true },
  { id: 'expense-4', name: 'Entertainment', type: 'EXPENSE', icon: '🎬', color: '#8b5cf6', isDefault: true },
  { id: 'expense-5', name: 'Bills & Utilities', type: 'EXPENSE', icon: '📄', color: '#6366f1', isDefault: true },
  { id: 'expense-6', name: 'Healthcare', type: 'EXPENSE', icon: '🏥', color: '#06b6d4', isDefault: true },
  { id: 'expense-7', name: 'Education', type: 'EXPENSE', icon: '📚', color: '#0891b2', isDefault: true },
  { id: 'expense-8', name: 'Housing', type: 'EXPENSE', icon: '🏠', color: '#10b981', isDefault: true },
  { id: 'expense-9', name: 'Insurance', type: 'EXPENSE', icon: '🛡️', color: '#14b8a6', isDefault: true },
  { id: 'expense-10', name: 'Other Expense', type: 'EXPENSE', icon: '➖', color: '#64748b', isDefault: true }
];

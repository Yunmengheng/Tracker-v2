export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  icon?: string;
}

export enum NotificationType {
  BUDGET_ALERT = 'BUDGET_ALERT',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  TRANSACTION_ADDED = 'TRANSACTION_ADDED',
  RECURRING_PAYMENT = 'RECURRING_PAYMENT',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
  SYSTEM = 'SYSTEM'
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  entityType: 'TRANSACTION' | 'BUDGET' | 'USER' | 'CATEGORY';
  entityId?: string;
  timestamp: Date;
  ipAddress?: string;
}

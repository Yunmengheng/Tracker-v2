import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Notification, NotificationType, ActivityLog } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private activityLogsSubject = new BehaviorSubject<ActivityLog[]>([]);
  public activityLogs$ = this.activityLogsSubject.asObservable();

  constructor() {
    this.loadMockNotifications();
    this.loadMockActivityLogs();
  }

  getNotifications(): Observable<Notification[]> {
    return of(this.notificationsSubject.value);
  }

  getUnreadCount(): Observable<number> {
    const count = this.notificationsSubject.value.filter(n => !n.read).length;
    return of(count);
  }

  markAsRead(id: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.saveToStorage(notifications);
    return of(true);
  }

  markAllAsRead(): Observable<boolean> {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    this.saveToStorage(notifications);
    return of(true);
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };

    const notifications = [newNotification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);
    this.saveToStorage(notifications);
  }

  deleteNotification(id: string): Observable<boolean> {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
    this.saveToStorage(notifications);
    return of(true);
  }

  // Activity Logs
  getActivityLogs(limit?: number): Observable<ActivityLog[]> {
    const logs = limit 
      ? this.activityLogsSubject.value.slice(0, limit)
      : this.activityLogsSubject.value;
    return of(logs);
  }

  logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const newLog: ActivityLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    const logs = [newLog, ...this.activityLogsSubject.value].slice(0, 100); // Keep last 100 logs
    this.activityLogsSubject.next(logs);
    this.saveActivityLogs(logs);
  }

  private loadMockNotifications(): void {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        this.notificationsSubject.next(notifications);
        return;
      } catch (e) {
        // Continue to load mock data
      }
    }

    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: '1',
        type: NotificationType.BUDGET_ALERT,
        title: 'Budget Alert',
        message: 'You have used 85% of your Food & Dining budget',
        read: false,
        icon: '⚠️',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: '1',
        type: NotificationType.TRANSACTION_ADDED,
        title: 'New Transaction',
        message: 'Transaction of $45.50 added to Entertainment',
        read: false,
        icon: '💳',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        userId: '1',
        type: NotificationType.MONTHLY_SUMMARY,
        title: 'Monthly Summary Ready',
        message: 'Your November financial summary is now available',
        read: true,
        icon: '📊',
        actionUrl: '/reports',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    this.notificationsSubject.next(mockNotifications);
    this.saveToStorage(mockNotifications);
  }

  private loadMockActivityLogs(): void {
    const stored = localStorage.getItem('activityLogs');
    if (stored) {
      try {
        const logs = JSON.parse(stored);
        this.activityLogsSubject.next(logs);
        return;
      } catch (e) {
        // Continue to load mock data
      }
    }

    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        userId: '1',
        action: 'LOGIN',
        description: 'User logged in successfully',
        entityType: 'USER',
        timestamp: new Date()
      }
    ];

    this.activityLogsSubject.next(mockLogs);
    this.saveActivityLogs(mockLogs);
  }

  private saveToStorage(notifications: Notification[]): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  private saveActivityLogs(logs: ActivityLog[]): void {
    localStorage.setItem('activityLogs', JSON.stringify(logs));
  }
}

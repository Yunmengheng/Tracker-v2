import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user$;
  unreadCount$;
  showNotifications = signal(false);
  showUserMenu = signal(false);
  notifications$;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.user$ = this.authService.currentUser$;
    this.unreadCount$ = this.notificationService.getUnreadCount();
    this.notifications$ = this.notificationService.notifications$;
  }

  toggleNotifications(): void {
    this.showNotifications.update(val => !val);
    this.showUserMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(val => !val);
    this.showNotifications.set(false);
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  menuItems = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '💳', label: 'Transactions', route: '/transactions' },
    { icon: '💰', label: 'Budgets', route: '/budgets' },
    { icon: '👤', label: 'Profile', route: '/profile' }
  ];
}

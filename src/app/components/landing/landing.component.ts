import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      icon: '💰',
      title: 'Track Expenses',
      description: 'Monitor your spending in real-time with detailed categorization and insights'
    },
    {
      icon: '📊',
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs to understand your financial patterns'
    },
    {
      icon: '🎯',
      title: 'Budget Goals',
      description: 'Set and achieve your financial goals with smart budget planning'
    },
    {
      icon: '📈',
      title: 'Financial Reports',
      description: 'Generate comprehensive reports to track your progress over time'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely'
    },
    {
      icon: '📱',
      title: 'Multi-Device',
      description: 'Access your finances anywhere, anytime, on any device'
    }
  ];
}

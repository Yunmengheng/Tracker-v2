import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  
  user = signal<User | null>(null);
  isEditing = signal(false);
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  username = signal('');
  
  showPasswordForm = signal(false);
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user.set(user);
        this.firstName.set(user.firstName);
        this.lastName.set(user.lastName);
        this.email.set(user.email);
        this.username.set(user.username);
      }
    });
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEdit() {
    const user = this.user();
    if (user) {
      this.firstName.set(user.firstName);
      this.lastName.set(user.lastName);
      this.email.set(user.email);
      this.username.set(user.username);
    }
    this.isEditing.set(false);
    this.errorMessage.set('');
  }

  saveProfile() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set('Profile updated successfully!');
      this.isEditing.set(false);
      
      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }, 1000);
  }

  togglePasswordForm() {
    this.showPasswordForm.set(!this.showPasswordForm());
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  changePassword() {
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.newPassword().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set('Password changed successfully!');
      this.showPasswordForm.set(false);
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
      
      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }, 1000);
  }
}

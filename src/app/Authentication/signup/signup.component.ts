import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  userData = {
    username: '',
    email: '',
    password: '',
  };
  errorMessage = '';
  successMessage = '';
  private authService = inject(AuthService);
  private router = inject(Router);

  async signup(): Promise<void> {
    try {
      await this.authService.signup(this.userData);
      this.successMessage = 'Signup successful! You can now <a routerLink="/login">login</a>.';
      this.errorMessage = '';
      this.userData = { username: '', email: '', password: '' }; // Clear form
    } catch (error: any) {
      this.errorMessage = error.message;
      this.successMessage = '';
    }
  }
}
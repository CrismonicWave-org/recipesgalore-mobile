import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { UserCredentials } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonSpinner
  ]
})
export class SignupPage {
  displayName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Handle email/password sign up
   */
  async onSubmit() {
    // Validate inputs
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';

      const credentials: UserCredentials = {
        email: this.email,
        password: this.password,
        displayName: this.displayName || undefined
      };

      await this.authService.signUp(credentials);

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Sign up failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle Google Sign-Up
   */
  async onGoogleSignUp() {
    try {
      this.loading = true;
      this.errorMessage = '';

      await this.authService.signInWithGoogle();

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Google sign up failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle Apple Sign-Up
   */
  async onAppleSignUp() {
    try {
      this.loading = true;
      this.errorMessage = '';

      await this.authService.signInWithApple();

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Apple sign up failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navigate to sign in page
   */
  onSignIn() {
    this.router.navigate(['/login']);
  }
}

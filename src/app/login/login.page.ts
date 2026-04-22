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
  IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  /**
   * Handle email/password sign in
   */
  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';

      await this.authService.signIn(this.email, this.password);

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Sign in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle Google Sign-In
   */
  async onGoogleSignIn() {
    try {
      this.loading = true;
      this.errorMessage = '';

      await this.authService.signInWithGoogle();

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Google sign in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle Apple Sign-In
   */
  async onAppleSignIn() {
    try {
      this.loading = true;
      this.errorMessage = '';

      await this.authService.signInWithApple();

      // Success! Navigate to home
      this.router.navigate(['/tabs/recipes']);

    } catch (error: any) {
      this.errorMessage = error.message || 'Apple sign in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle forgot password
   */
  async onForgotPassword() {
    const alert = await this.alertController.create({
      header: 'Reset Password',
      message: 'Enter your email address to receive a password reset link.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: async (data) => {
            if (!data.email) {
              this.errorMessage = 'Please enter your email address.';
              return false;
            }

            try {
              await this.authService.resetPassword(data.email);
              
              const successAlert = await this.alertController.create({
                header: 'Email Sent',
                message: 'Check your email for password reset instructions.',
                buttons: ['OK']
              });
              await successAlert.present();

            } catch (error: any) {
              this.errorMessage = error.message || 'Failed to send reset email.';
              return false;
            }

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Navigate to sign up page
   */
  onSignUp() {
    this.router.navigate(['/signup']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonListHeader, 
  IonLabel, 
  IonItem, 
  IonIcon, 
  IonNote,
  IonButton
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import packageInfo from '../../../package.json';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonListHeader, 
    IonLabel, 
    IonItem, 
    IonIcon, 
    IonNote,
    IonButton
  ],
})
export class ProfilePage implements OnInit {
  version: string = packageInfo.version;
  currentUser: User | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async onSignOut() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}

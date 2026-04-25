import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  restaurant, 
  heart, 
  person, 
  personCircle, 
  notificationsOutline, 
  settingsOutline, 
  helpCircleOutline, 
  informationCircleOutline,
  alertCircle,
  logoGoogle,
  logoApple,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Register icons for RecipesGalore tabs, profile, and authentication
    addIcons({
      'restaurant': restaurant,
      'heart': heart,
      'person': person,
      'person-circle': personCircle,
      'notifications-outline': notificationsOutline,
      'settings-outline': settingsOutline,
      'help-circle-outline': helpCircleOutline,
      'information-circle-outline': informationCircleOutline,
      'alert-circle': alertCircle,
      'logo-google': logoGoogle,
      'logo-apple': logoApple,
      'log-out-outline': logOutOutline,
    });
  }

  ngOnInit() {
    // Handle initial routing based on auth state
    this.authService.currentUser$.subscribe(user => {
      const currentUrl = this.router.url;
      
      // Only redirect on initial load (root path)
      if (currentUrl === '/' || currentUrl === '') {
        if (user) {
          console.log('App Init: User authenticated, redirecting to /tabs/recipes');
          this.router.navigate(['/tabs/recipes'], { replaceUrl: true });
        } else {
          console.log('App Init: No user, redirecting to /login');
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      }
    });
  }
}

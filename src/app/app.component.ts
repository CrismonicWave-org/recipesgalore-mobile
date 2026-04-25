import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
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
}

import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurant, heart, person, personCircle, notificationsOutline, settingsOutline, helpCircleOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    // Register icons for RecipesGalore tabs and profile
    addIcons({
      'restaurant': restaurant,
      'heart': heart,
      'person': person,
      'person-circle': personCircle,
      'notifications-outline': notificationsOutline,
      'settings-outline': settingsOutline,
      'help-circle-outline': helpCircleOutline,
      'information-circle-outline': informationCircleOutline,
    });
  }
}

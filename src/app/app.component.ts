import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurant, heart, person } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    // Register icons for RecipesGalore tabs
    addIcons({
      'restaurant': restaurant,
      'heart': heart,
      'person': person,
    });
  }
}

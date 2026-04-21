import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonNote } from '@ionic/angular/standalone';
import packageInfo from '../../../package.json';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonNote],
})
export class ProfilePage {
  version: string = packageInfo.version;
  
  constructor() {}
}

import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'recipes',
        loadComponent: () =>
          import('../recipes/recipes.page').then((m) => m.RecipesPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/recipes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/recipes',
    pathMatch: 'full',
  },
];

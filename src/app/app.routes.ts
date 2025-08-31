import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'portfolios/focused',
    loadComponent: () =>
      import('./components/portfolio/portfolio.component').then(
        (m) => m.PortfolioComponent
      ),
  },
  { path: '**', redirectTo: '/home' },
];

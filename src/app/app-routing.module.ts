import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';

const routes: Routes = [

  {
    path: 'auth',
    //guards
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
  },
  {
    path: 'dashboard',
    canActivate: [ isAuthenticatedGuard ], //! no se puede entrar al dashboard a menos que esté autenticado con JWT
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule ),
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {LayoutComponent} from './components/layout/layout.component';
import {UserAccountLayoutComponent} from './components/user-account-layout/user-account-layout.component';
import {AdminLayoutComponent} from './components/admin-layout/admin-layout.component';
import {AuthGuardService} from './services/auth-guard.service';
import {SearchComponent} from './components/search/search.component';
import {UserPublicComponent} from './components/user-public/user-public.component';

const routes: Routes = [
  {
    path : '', component: LayoutComponent, children : [
      {path: '', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'search', component: SearchComponent},
      {path: 'public/:id/:name', component: UserPublicComponent}
    ]
  },
  {path: 'user-account', component: UserAccountLayoutComponent, canActivate: [AuthGuardService]},
  {path: 'admin', component: AdminLayoutComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { ExpenseList } from './components/expense-list/expense-list';
import { ExpenseForm } from './components/expense-form/expense-form';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'expenses', component: ExpenseList, canActivate: [authGuard] },
  { path: 'expenses/add', component: ExpenseForm, canActivate: [authGuard] },
  { path: 'expenses/edit/:id', component: ExpenseForm, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];

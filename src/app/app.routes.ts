import { Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { SignupComponent } from './Authentication/signup/signup.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AuthGuard } from './Authentication/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    { path:
        'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
];

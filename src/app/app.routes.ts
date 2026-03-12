import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Details } from './details/details';
import { Login } from './login/login';
import { User } from './user/user';
import { Order } from './order/order';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'details/:id/reserve', component: Order },
    { path: 'details/:id', component: Details },
    { path: 'login', component: Login },
    { path: 'user', component: User }
];
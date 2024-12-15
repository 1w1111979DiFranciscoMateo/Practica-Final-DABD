import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PanelComponent } from './components/panel/panel.component';
import { loginGuard } from './guards/login.guard';
import { NewModeComponent } from './components/new-mode/new-mode.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'panel', component: PanelComponent, canActivate: [loginGuard]},
    { path: 'createModel', component: NewModeComponent, canActivate: [loginGuard]}
];

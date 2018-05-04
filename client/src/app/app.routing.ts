import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import passenger
import { AppComponent } from './app.component';
// import { UserEditComponent } from './components/user-edit.component';

const appRoutes: Routes = [
  {path: '', component: AppComponent},
  // {path: 'mis-datos', component: UserEditComponent},
  {path: '**', component: AppComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

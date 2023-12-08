import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', component: AppComponent }, // Définissez la route par défaut
  { path: 'admin_page', component: AdminComponent },
  // 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

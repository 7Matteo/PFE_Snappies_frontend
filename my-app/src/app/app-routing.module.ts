import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './ADMIN/article/article.component';
import { TourneeComponent } from './ADMIN/tournee/tournee.component';
import { LoginFormComponent } from './LOGIN/login-form/login-form.component';
import { CommandsListComponent } from './ADMIN/commands-list/commands-list.component';
import { CreateCommandFormComponent } from './ADMIN/create-command-form/create-command-form.component';
import { LivreursListComponent } from './ADMIN/livreurs-list/livreurs-list.component';

const routes: Routes = [ 
  { path: '', component: LoginFormComponent},
  { path: 'articles', component: ArticleComponent },
  { path: 'tournees', component: TourneeComponent },
  { path: 'livreurs', component: LivreursListComponent},
  { path: 'commandes', component: CommandsListComponent },
  { path: 'nouvelleCommande', component: CreateCommandFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

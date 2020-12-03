import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumComponent } from './forum/forum.component';
import { MainComponent } from './main/main.component';
import { ArticleComponent } from './article/article.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ArticlesComponent } from './articles/articles.component';
import { SearchComponent } from './search/search.component';
import { AuthComponent } from './auth/auth.component';
import { RegComponent } from './reg/reg.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'forum', component: ForumComponent},
  {path: 'article/:slug', component: ArticleComponent},
  {path: 'articles', component: ArticlesComponent},
  {path: 'search', component: SearchComponent},
  {path: 'registration', component: RegComponent},
  {path: 'autharization', component: AuthComponent},
  {path: '**', redirectTo: 'not_found'},
  {path: 'not_found', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MainComponent, ForumComponent, NotfoundComponent, ArticlesComponent, SearchComponent, AuthComponent, RegComponent]

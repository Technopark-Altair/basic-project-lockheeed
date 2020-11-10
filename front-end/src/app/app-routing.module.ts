import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumComponent } from './forum/forum.component';
import { MainComponent } from './main/main.component';
import { ArticleComponent } from './article/article.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ArticlesComponent } from './articles/articles.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'forum', component: ForumComponent},
  {path: 'article/:slug', component: ArticleComponent},
  {path: 'articles', component: ArticlesComponent},
  {path: 'search', component: SearchComponent},
  {path: '**', redirectTo: 'not_found'},
  {path: 'not_found', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MainComponent, ForumComponent, NotfoundComponent, ArticlesComponent, SearchComponent]

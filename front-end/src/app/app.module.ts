import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { PostPreviewComponent } from './post-preview/post-preview.component';
import { MainComponent } from './main/main.component';
import { ArticleComponent } from './article/article.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ArticlesComponent } from './articles/articles.component';
import { SearchComponent } from './search/search.component';
// import { ForumComponent } from './forum/forum.component';

@NgModule({
  declarations: [
    AppComponent,
    PostPreviewComponent,
    routingComponents,
    MainComponent,
    ArticleComponent,
    NotfoundComponent,
    ArticlesComponent,
    SearchComponent
    // ForumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

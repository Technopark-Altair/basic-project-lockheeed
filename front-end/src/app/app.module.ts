import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { ElementPreviewComponent } from './element-preview/element-preview.component';
import { MainComponent } from './main/main.component';
import { ArticleComponent } from './article/article.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ArticlesComponent } from './articles/articles.component';
import { SearchComponent } from './search/search.component';
import { AuthComponent } from './auth/auth.component';
import { RegComponent } from './reg/reg.component';
import { AccountComponent } from './account/account.component';
import { PostComponent } from './post/post.component';
import { ForumComponent } from './forum/forum.component';
import { PublicationComponent } from './publication/publication.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';



@NgModule({
  declarations: [
    AppComponent,
    ElementPreviewComponent,
    routingComponents,
    MainComponent,
    ArticleComponent,
    NotfoundComponent,
    ArticlesComponent,
    SearchComponent,
    AuthComponent,
    RegComponent,
    AccountComponent,
    PostComponent,
    ForumComponent,
    PublicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    EditorModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

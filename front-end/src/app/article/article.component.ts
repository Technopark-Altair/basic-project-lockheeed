import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})

export class ArticleComponent implements OnInit {
  slug: string;
  article_content: SafeHtml;
  article: JSON;

  getArticle(slug) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://46.39.252.82:8000/db/get_article/?slug=' + slug , false);
    xhr.send();
    let article = JSON.parse(xhr.responseText)['article'];
    return article;
  }



  // constructor(private ) { }

  constructor(private activateRoute: ActivatedRoute, router: Router, sanitizer:DomSanitizer){
        activateRoute.params.subscribe(params=>this.slug=params['slug']);
        this.article = this.getArticle(this.slug);
        this.article_content = sanitizer.bypassSecurityTrustHtml(this.article['content']);
        if ( !Object.keys(this.article).length ) {
          router.navigate(['/not_found']);
        }
    }

  ngOnInit(): void {

  }

}

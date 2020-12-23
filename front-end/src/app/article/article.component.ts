import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})

export class ArticleComponent implements OnInit {
  slug: string;
  article_content: SafeHtml;
  article: JSON;

  // constructor(private ) { }

  constructor(private activateRoute: ActivatedRoute, router: Router, sanitizer: DomSanitizer, requests: RequestsService){
        activateRoute.params.subscribe(params=>this.slug=params['slug']);
        this.article = JSON.parse( requests.getArticle(this.slug) )["article"];
        this.article_content = sanitizer.bypassSecurityTrustHtml(this.article['content']);
        if ( !Object.keys(this.article).length ) {
          router.navigate(['/not_found']);
        }
    }

  ngOnInit(): void {

  }

}

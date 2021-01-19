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

  session_token: string = localStorage.getItem('session_token');

  // constructor(private ) { }

  constructor(private activateRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private requests: RequestsService){
        activateRoute.params.subscribe(params=>this.slug=params['slug']);
        this.article = requests.getArticle(this.slug)["article"];
        this.article_content = sanitizer.bypassSecurityTrustHtml(this.article['content']);
        if ( !Object.keys(this.article).length ) {
          router.navigate(['/not_found']);
        }
    }

  ngOnInit(): void {
  }

  rateUp() {
    this.requests.rateUp(this.session_token, 'article', this.slug);
  }

  rateDown() {
    this.requests.rateDown(this.session_token, 'article', this.slug);
  }
}

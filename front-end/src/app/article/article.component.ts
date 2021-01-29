import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private activateRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private requests: RequestsService, private snackBar: MatSnackBar){
        activateRoute.params.subscribe(params=>this.slug=params['slug']);
        this.article = requests.getArticle(this.session_token, this.slug)["article"];
        this.article_content = sanitizer.bypassSecurityTrustHtml(this.article['content']);
        if ( !Object.keys(this.article).length ) {
          router.navigate(['/not_found']);
        }
    }

  spawnSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  rateUp() {
    let res = this.requests.rate(this.session_token, 'article', this.slug, 'up');

    if ( res['status'] == 'OK') {
      if (this.article['rated']) { this.article['raiting'] += 2; }
      else { this.article['raiting'] += 1; }
      this.article['rated'] = 'up';

      this.spawnSnackBar('Голос засчитан!', 'valid');
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  rateDown() {
    let res = this.requests.rate(this.session_token, 'article', this.slug, 'down');

    if ( res['status'] == 'OK') {
      if (this.article['rated']) { this.article['raiting'] -= 2; } 
      else { this.article['raiting'] -= 1; }
      this.article['rated'] = 'down';

      this.spawnSnackBar('Голос засчитан!', 'valid');
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  ngOnInit(): void {
  }
}

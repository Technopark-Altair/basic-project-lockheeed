import { Component, OnInit, Input } from '@angular/core';
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
  user_picture: string;
  username: string;
  online: boolean;
  session_token: string = localStorage.getItem('session_token');
  correctWordForm: string;

  userComment: string

  slug: string;
  article_content: SafeHtml;
  article: JSON;

  constructor(private activateRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private requests: RequestsService, private snackBar: MatSnackBar){
        activateRoute.params.subscribe(params=>this.slug=params['slug']);
        this.article = requests.getArticle(this.session_token, this.slug)["article"];
        this.article_content = sanitizer.bypassSecurityTrustHtml(this.article['content']);

        let strCommentsCount = this.article['commentsCount'].toString();
        console.log(strCommentsCount);
        let lastNum = parseInt(strCommentsCount.charAt(strCommentsCount.length - 1));
        console.log(lastNum);
        if ( lastNum == 1 ) {
          this.correctWordForm = "Комментарий";
        } else if ( 1 < lastNum && lastNum < 5)  {
          this.correctWordForm = "Комментария";
        } else {
          this.correctWordForm = "Комментариев";
        }

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

  getProfilePicture() {
      if (this.session_token) {
        let result = this.requests.getProfilePicture(this.session_token);
        this.username = this.requests.getProfileInfo(this.session_token)['data']['username'];

        if ( result['status'] == 'OK' ) {
          if ( result['image'] ) {
            this.user_picture = result['image'];
          } else {
            this.user_picture = 'assets/hacker.svg';
          }
          this.online = true;
        }
      }
  }

  sendComment() {
    let res = this.requests.sendComment(this.session_token, 'article', this.slug, this.userComment);

    if ( res['status'] == 'OK' ) {
      this.article["comments"].unshift({
        "author":this.username,
        "avatar":this.user_picture,
        "content":this.userComment
      })
      this.article["commentsCount"] += 1;
      this.userComment = "";
      this.spawnSnackBar('Комментарий успешно отправлен!', 'valid');
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  ngOnInit(): void {
    this.getProfilePicture();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

declare var tinymce: any;

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {

  session_token: string = localStorage.getItem('session_token');
  articleTitle: string;
  articleContent: string;

  constructor(private snackBar: MatSnackBar, private requests: RequestsService) { }

  spawnSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  ngOnInit(): void {
  }

  onTinyMCEInit() {
    tinymce.activeEditor.getBody().style.backgroundColor = '#554853';
  }

  publicate() {
    if (this.session_token) {
      let res = this.requests.sendArticle(this.session_token, this.articleTitle, this.articleContent);

      if ( res['status'] == 'OK' ) {
        this.spawnSnackBar('Статья успешно опубликованна!', 'valid');
      } else {
        this.spawnSnackBar(res['msg'], 'error');
      }
    } else {
      this.spawnSnackBar('Необходима авторизация!', 'error');
    }
  }
}

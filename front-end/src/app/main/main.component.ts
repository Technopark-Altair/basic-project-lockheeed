import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  session_token: string = localStorage.getItem('session_token');

  constructor(private requests: RequestsService, private router: Router, private snackBar: MatSnackBar) { }

  spawnSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  top: JSON = this.requests.getTop()["top"];

  openPublicationPage(): void {
    let res = this.requests.isAVaildToken(this.session_token);

    if ( res['status'] == 'OK' ) {
      this.router.navigate(['/publication']);
    } else {
      this.spawnSnackBar('Необходима авторизация!', 'error');
    }
  }

  ngOnInit(): void {
  }

}

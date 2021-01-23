import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private requests: RequestsService) { }

  login: string = "";
  password: string = "";

  spawnSnackBar(error_text, panel_class = 'error') {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  checkInputData() {
    if ( this.login.length <= 1 ) { this.spawnSnackBar('Длинна логина должна составлять от 2 символов!', 'error'); return false; }
    if ( this.password.length <= 7 ) { this.spawnSnackBar('Длинна пароля должна быть от 8 символов!', 'error'); return false; }
    return true;
  }

  autharization() {
    if ( this.checkInputData() ){
      let res = this.requests.autharization(this.login, this.password);

      if ( res['status'] == 'OK' ) {
        localStorage.setItem('session_token', res['session_token']);
        window.open(window.location.origin, "_self");
      } else {
        this.spawnSnackBar(res['msg'], 'error');
      }
    }
  }

  ngOnInit(): void {
  }

}

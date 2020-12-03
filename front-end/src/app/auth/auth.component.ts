import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }

  spawnErrorSnackBar() {
    this.snackBar.open("Неверный логин или пароль!", "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: 'error'
    });
  }

  auth() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://46.39.252.82:8000/api/auth/?login=' + this.login + '&password=' + Md5.hashStr(JSON.stringify(this.password)), false);
    xhr.send();
    let result = JSON.parse(xhr.responseText);

    if ( result['status'] == 'OK' ) {
      localStorage.setItem('session_token', result['session_token']);
    } else {
      this.spawnErrorSnackBar();
    }
  }

  login: string;
  password: string;

  ngOnInit(): void {
  }

}

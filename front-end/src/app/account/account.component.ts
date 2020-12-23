import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private router: Router, private requests: RequestsService) { }

  session_token: string = localStorage.getItem('session_token');
  data: any = {};

  email: string = "";

  spawnErrorSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  getProfileInfo() {
      if (this.session_token) {
        let result = JSON.parse( this.requests.getProfileInfo(this.session_token) );

        if ( result['status'] == 'OK' ) {
          this.data = result['data'];
          this.email = this.data['email'];
          return undefined;
        }
      }

      this.router.navigate(["/"]);
  }

  exit() {
    localStorage.removeItem("session_token");
    window.open(window.location.origin, "_self");
  }

  ngOnInit() {
    this.getProfileInfo();
  }

}

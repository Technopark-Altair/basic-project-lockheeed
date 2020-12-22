import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private router: Router) { }

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
        var xhr = new XMLHttpRequest();
        let slug = 'http://46.39.252.82:8000/api/get_profile/?'
        let params = 'token=' + this.session_token

        xhr.open('GET', slug + params, false);
        xhr.send();
        let result = JSON.parse(xhr.responseText);

        if ( result['status'] == 'OK' ) {
          this.data = result['data'];
          this.email = this.data['email'];
        } else {
          this.router.navigate(["/"]);
        }

      } else {
        this.router.navigate(["/"]);
      }
  }

  ngOnInit() {
    this.getProfileInfo();
  }

}

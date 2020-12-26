import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private snackBar: MatSnackBar, private requests: RequestsService) { }

  user_picture: string = "assets/person.svg";
  user_picture_url: string = "/autharization";
  session_token: string = localStorage.getItem('session_token');
  online: boolean = false;

  spawnErrorSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  getProfilePicture() {
      if (this.session_token) {
        let result = JSON.parse( this.requests.getProfilePicture(this.session_token) );

        if ( result['status'] == 'OK' ) {
          this.spawnErrorSnackBar( "Успешная авторизация!", 'valid');
          if ( result['image'] ) {
            this.user_picture = result['image'];
          }
          this.online = true;
          this.user_picture_url = "/account";
        }
      }
  }
  ngOnInit() {
    this.getProfilePicture();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private snackBar: MatSnackBar) { }

  user_picture: string = "";
  user_picture_url: string = "/autharization";
  session_token: string = localStorage.getItem('session_token');

  spawnErrorSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  getProfilePicture() {
      if (this.session_token) {
        var xhr = new XMLHttpRequest();
        let slug = 'http://46.39.252.82:8000/api/get_profile_picture/?'
        let params = 'token=' + this.session_token

        xhr.open('GET', slug + params, false);
        xhr.send();
        let result = JSON.parse(xhr.responseText);

        if ( result['status'] == 'OK' ) {
          this.spawnErrorSnackBar( "Успешная авторизация!", 'valid');
          if ( result['image'] ) {
            this.user_picture = result['image'];
          } else {
            this.user_picture = "assets/person.svg";
          }
          this.user_picture_url = "/account";
        }

      } else {
        this.user_picture = "assets/person.svg";
      }
  }

  ngOnInit() {
    this.getProfilePicture();
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  user_picture: string = "";
  session_token: string = localStorage.getItem('session_token');

  getProfilePicture() {
      if (this.session_token) {
        var xhr = new XMLHttpRequest();
        let slug = 'http://46.39.252.82:8000/api/get_profile_picture/?'
        let params = 'token=' + this.session_token

        xhr.open('GET', slug + params, false);
        xhr.send();
        let result = JSON.parse(xhr.responseText);

        if ( result['status'] == 'OK' ) {
          if ( result['image'] ) {
            this.user_picture = result['image'];
          } else {
            this.user_picture = "assets/person.svg";
          }
        }
         
      }
  }

  ngOnInit() {
    this.getProfilePicture();
  }
}

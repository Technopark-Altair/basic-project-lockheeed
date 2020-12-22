import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Md5 } from 'ts-md5';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private router: Router) { }

  login: string = "";
  password: string = "";
  email: string = "";
  name: string = "";

  base64Image: string;

  spawnErrorSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  handleInputFile(file: FileList){
     var fileToUpload = file.item(0);

     var reader = new FileReader();
     reader.readAsDataURL(fileToUpload);

     reader.onload = (event:any) => {
       this.base64Image = reader.result as string;
     }
   }

  checkInputData() {
    if ( !EmailValidator.validate(this.email) ) { this.spawnErrorSnackBar("Неверный почтовый формат!", 'error'); return false; };
    if ( this.password.length <= 7 ) { this.spawnErrorSnackBar("Длинна пароля должна быть от 8 символов!", 'error'); return false; }
    if ( this.login.length <= 1 ) { this.spawnErrorSnackBar("Длинна логина должна составлять от 2 символов!", 'error'); return false; }
    return true;
  }

  registration() {
    if ( this.checkInputData() ) {
      var xhr = new XMLHttpRequest();
      let slug = 'http://46.39.252.82:8000/api/reg/?'
      let params = 'login=' + this.login + '&email=' + this.email + '&name=' + this.name + '&password=' + Md5.hashStr(JSON.stringify(this.password))

      xhr.open('POST', slug + params, false);
      xhr.send(this.base64Image);
      console.log(xhr.responseText);
      let result = JSON.parse(xhr.responseText);

      if ( result['status'] == 'OK' ) {
        localStorage.setItem('session_token', result['session_token']);
        window.open(window.location.origin, "_self");
      } else {
        this.spawnErrorSnackBar(result['error'], 'error');
      }
    }
  }

  ngOnInit(): void {
  }

}

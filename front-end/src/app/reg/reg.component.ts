import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { RequestsService } from 'src/app/requests.service'

import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private router: Router, private requests: RequestsService) { }

  login: string = "";
  password: string = "";
  email: string = "";
  name: string = "";

  base64Image: string;

  spawnErrorSnackBar(error_text, panel_class = 'error') {
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
    if ( !EmailValidator.validate(this.email) ) { this.spawnErrorSnackBar("Неверный почтовый формат!"); return false; };
    if ( this.password.length <= 7 ) { this.spawnErrorSnackBar("Длинна пароля должна быть от 8 символов!"); return false; }
    if ( this.login.length <= 1 ) { this.spawnErrorSnackBar("Длинна логина должна составлять от 2 символов!"); return false; }
    return true;
  }

  registration() {
    if ( this.checkInputData() ) {

      let result = JSON.parse( this.requests.registration(this.login, this.email, this.name, this.password, this.base64Image) );

      if ( result['status'] == 'OK' ) {
        localStorage.setItem('session_token', result['session_token']);
        window.open(window.location.origin, "_self");
      } else {
        this.spawnErrorSnackBar(result['error']);
      }
    }
  }

  ngOnInit(): void {
  }

}

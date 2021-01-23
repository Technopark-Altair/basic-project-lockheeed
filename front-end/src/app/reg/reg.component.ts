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

  spawnSnackBar(error_text, panel_class = 'error') {
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
    if ( !EmailValidator.validate(this.email) ) { this.spawnSnackBar('Неверный почтовый формат!', 'error'); return false; };
    if ( this.password.length <= 7 ) { this.spawnSnackBar('Длинна пароля должна быть от 8 символов!', 'error'); return false; }
    if ( this.login.length <= 1 ) { this.spawnSnackBar('Длинна логина должна составлять от 2 символов!', 'error'); return false; }
    return true;
  }

  registration() {
    if ( this.checkInputData() ) {

      let res = this.requests.registration(this.login, this.email, this.name, this.password, this.base64Image);

      if ( res['status'] == 'OK' ) {
        localStorage.setItem('session_token', res['session_token']);
        window.open(window.location.origin, "_self");
      } else {
        this.spawnSnackBar(res['msg']);
      }
    }
  }

  ngOnInit(): void {
  }

}

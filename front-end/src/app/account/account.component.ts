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

  current_password: string = "";
  new_password: string = "";

  base64Image: string;
  changed: boolean = false;

  spawnSnackBar(error_text, panel_class) {
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
       this.changed = true;
     }
   }

  getProfileInfo() {
      if (this.session_token) {
        let res = this.requests.getProfileInfo(this.session_token);

        if ( res['status'] == 'OK' ) {
          this.data = res['data'];
          this.base64Image = this.data['avatar'];
          return;
        }
      }

      this.router.navigate(["/"]);
  }

  exit() {
    let res = this.requests.exit(this.session_token);

    if ( res['status'] == 'OK' ) {
      localStorage.removeItem("session_token");
      window.open(window.location.origin, "_self");
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  updatePassword() {
    let res = this.requests.updatePassword(this.session_token, this.current_password, this.new_password);

    if ( res['status'] == 'OK' ) {
      this.spawnSnackBar('Пароль успешно сменён!', 'valid');

      this.current_password = "";
      this.new_password = "";
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  updateAvatar() {
    let res = this.requests.updateAvatar(this.session_token, this.base64Image);

    if ( res['status'] == 'OK' ) {
      window.open(window.location.href, "_self");
    } else {
      this.spawnSnackBar(res['msg'], 'error');
    }
  }

  ngOnInit() {
    this.getProfileInfo();
  }

}

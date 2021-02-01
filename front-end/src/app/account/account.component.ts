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

  base64Image: string = "assets/person.svg";
  currentAvatar: string = "assets/person.svg";
  changed: boolean = false;
  canBeDeleted: boolean = false;

  spawnSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  checkInputData() {
    if ( this.current_password.length <= 7 ) { this.spawnSnackBar('Длинна пароля должна быть от 8 символов!', 'error'); return false; }
    if ( this.new_password.length <= 7 ) { this.spawnSnackBar('Длинна пароля должна быть от 8 символов!', 'error'); return false; }
    return true;
  }

  handleInputFile(file: FileList){
     var fileToUpload = file.item(0);

     var reader = new FileReader();
     reader.readAsDataURL(fileToUpload);

     reader.onload = (event:any) => {
       if ( this.base64Image != reader.result as string && this.currentAvatar != reader.result as string) {
         this.changed = true;
       } else {
         this.changed = false;
       }
       this.base64Image = reader.result as string;
     }
   }

  getProfileInfo() {
      if (this.session_token) {
        let res = this.requests.getProfileInfo(this.session_token);

        if ( res['status'] == 'OK' ) {
          this.data = res['data'];
          if ( this.data['avatar'] ) {
              this.base64Image = this.data['avatar'];
              this.currentAvatar = this.data['avatar'];
          }
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
    if ( this.checkInputData() ) {
      let res = this.requests.updatePassword(this.session_token, this.current_password, this.new_password);

      if ( res['status'] == 'OK' ) {
        this.spawnSnackBar('Пароль успешно сменён!', 'valid');

        this.current_password = "";
        this.new_password = "";
      } else {
        this.spawnSnackBar(res['msg'], 'error');
      }
    }
  }

  updateAvatar() {
    try {
      let res = this.requests.updateAvatar(this.session_token, this.base64Image);

      if ( res['status'] == 'OK' ) {
        window.open(window.location.href, "_self");
      } else {
        this.spawnSnackBar(res['msg'], 'error');
      }
    }
    catch(e) {
      this.spawnSnackBar("Загружаемый файл слшиком большой!", 'error');
    }
  }

  deleteAvatar() {
    let res = this.requests.deleteAvatar(this.session_token);

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

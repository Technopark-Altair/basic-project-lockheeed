import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RequestsService } from 'src/app/requests.service'

import 'tinymce';
declare var tinymce: any;

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})

export class PublicationComponent implements OnInit {
  session_token: string = localStorage.getItem('session_token');
  articleTitle: string;
  articleContent: string;

  tinymceInit = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 500,
    skin: 'oxide-dark',
    content_css : 'dark',
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount imagetools image'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image',

    image_title: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    image_advtab : true,
    block_unsupported_drop: false,
    file_picker_callback : function(cb, value, meta) {

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = function() {
      var file = input.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        var id = 'blobid' + (new Date()).getTime();
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.toString().split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }
  };

  constructor(private snackBar: MatSnackBar, private requests: RequestsService) { }

  spawnSnackBar(error_text, panel_class) {
    this.snackBar.open(error_text, "", {
      duration: 3000,
      horizontalPosition: 'right',
      panelClass: panel_class
    });
  }

  ngOnInit(): void {
  }

  onTinyMCEInit() {
    tinymce.activeEditor.getBody().style.backgroundColor = '#554853';
  }

  publicate() {
    if (this.session_token) {
      let res = this.requests.sendArticle(this.session_token, this.articleTitle, this.articleContent);

      if ( res['status'] == 'OK' ) {
        this.articleTitle = "";
        this.articleContent = "";
        this.spawnSnackBar('Статья успешно отправлена на модерацию!', 'valid');
      } else {
        this.spawnSnackBar(res['msg'], 'error');
      }
    } else {
      this.spawnSnackBar('Необходима авторизация!', 'error');
    }
  }

  // handleInputFile() {
  //   var input = document.createElement('input');
  //   var base64Image = '';
  //
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //
  //   let reader = new FileReader();
  //
  //   input.onchange = (event:any) => {
  //     reader.readAsDataURL(input.files[0]);
  //     reader.onload = (event:any) => {
  //       base64Image = reader.result as string;
  //     }
  //   }
  //
  //   input.click();
  // }
}

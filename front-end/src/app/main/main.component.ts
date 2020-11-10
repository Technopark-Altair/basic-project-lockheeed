import { Component, OnInit } from '@angular/core';
import { PostPreviewComponent } from '../post-preview/post-preview.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  getLastPosts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://46.39.252.82:8000/db/get_last_posts/', false);
    xhr.send();
    return JSON.parse(xhr.responseText);
  }

  // title = 'example';
  articles = this.getLastPosts();

  ngOnInit(): void {

  }

}

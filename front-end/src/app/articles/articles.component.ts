import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

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

import { Component, OnInit } from '@angular/core';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  constructor(private requests: RequestsService) { }

  articles = JSON.parse( this.requests.getLastArticles() );

  ngOnInit(): void {

  }

}

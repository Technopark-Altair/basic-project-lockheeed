import { Component, OnInit } from '@angular/core';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  constructor(private requests: RequestsService) { }

  posts = JSON.parse( this.requests.getLastPosts() );

  ngOnInit(): void {
  }

}

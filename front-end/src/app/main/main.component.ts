import { Component, OnInit } from '@angular/core';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private requests: RequestsService) { }

  articles = JSON.parse( this.requests.getTop() );

  ngOnInit(): void {
  }

}

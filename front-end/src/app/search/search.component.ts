import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestsService } from 'src/app/requests.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult: JSON;
  query: string;

  constructor(private activateRoute: ActivatedRoute, private requests: RequestsService) {
    activateRoute.paramMap.subscribe(params => {
    this.query = params.get("query")
    this.search();
  })
  }

  search() {
    this.searchResult = this.requests.search(this.query);
  }

  ngOnInit(): void {
  }

}

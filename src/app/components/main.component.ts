import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiKey } from '../models';
import { NewsDB } from '../news.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private router: Router,
    private newsDB: NewsDB
  ) { }

  ngOnInit(): void {
  }

  
  async routeTo() {
    let apiKey = await this.newsDB.pageRouteDB()
    console.log(apiKey.length)
    
    if (apiKey.length <= 0) {
      console.log("No API Key.")
      this.router.navigate(['/api'])
    }
    else {
      console.log("API Key exists in NewsDB.apiKey.")
      this.router.navigate(['/countries']);
    }
  }
}

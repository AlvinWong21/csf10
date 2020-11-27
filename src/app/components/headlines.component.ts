import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from '../models';
import { NewsDB } from '../news.database';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css']
})


export class HeadlinesComponent implements OnInit {

  code = ''
  apiKey = ''
  country = ''
  searchResults: News[] = []
  lastRequest: Date
  newsInDB: News[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private newsDB: NewsDB
    ) { }

  async ngOnInit() {

    this.code = this.activatedRoute.snapshot.params.code
    console.log(this.code)
    this.apiKey = (await this.newsDB.pageRouteDB())[0]['apiKey']
    // console.log(this.apiKey)

    let timeNow = new Date()
    // let fiveMinsAgo = new Date(timeNow.getTime() - 5*60000)
    // console.log(fiveMinsAgo)

    if (this.lastRequest < timeNow){
      console.log(timeNow, this.lastRequest)
      this.searchResults = await this.newsDB.getNews(this.code)
    }
    // else {
    //   this.newsInDB = await this.newsDB.getNews(this.code)
    //   console.log(this.newsInDB)
  
    //   if (this.newsInDB.length > 0) {
    //     console.log(this.newsInDB)
    //   }
      else {
        const url = `https://newsapi.org/v2/top-headlines`
        const headers = (new HttpHeaders()).set('X-Api-Key', this.apiKey)
        console.log(headers)
        let params = (new HttpParams()).set('country', this.code).set('pageSize', '30')
        console.log(params)
    
    
        this.http.get<any>(url, { headers: headers,  params: params })
        .toPromise()
    
        .then(async resp => {
          this.country = await this.newsDB.getCountryName(this.code)
          console.log(this.country)
          this.searchResults = resp.articles.map(n => {
    
            return {
    
              country: this.code,
              sourceName: n['source']['name'],
              author: n['author'],
              title: n['title'],
              description: n['description'],
              url: n['url'],
              imageUrl: n['urlToImage'],
              datetime: n['publishedAt'],
              content: n['content'],
              timestamp: (new Date())
            } as News
    
          })
          this.lastRequest = new Date()
          console.log("Last Request to News API: ", this.lastRequest)
          await this.newsDB.saveNewsDB(this.searchResults)
          console.log(">>>Search Results array: ", this.searchResults)
        })
      }
    }
  async saveArticle(targetNews) {
    targetNews.save = "Saved"
    console.log(">>>Passing from HeadlineComponent: ", targetNews)
    await this.newsDB.saveTargetNewsDB(targetNews)
  }
}
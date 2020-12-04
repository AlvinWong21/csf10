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
  timestamp: number
  searchResults: News[] = []
  lastRequest: Date
  newsInDB: News[] = []
  articleExpiry = 1000*60*5

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

    this.searchResults = await this.newsDB.getNews(this.code)
    console.log(">>>News acquired from database: ", this.searchResults)

    let refreshNews = this.searchResults.length <= 0

    if (this.searchResults.length > 0) {

      const expiredNews = this.searchResults.filter(a => (Date.now() - this.searchResults[0].timestamp > this.articleExpiry))
      console.log(">>>News that are 5 minutes old: ", expiredNews)
      
      if (expiredNews.length > 0) {
        await this.newsDB.deleteNews(expiredNews)
        refreshNews = true
      }
      
    }

    if (refreshNews) {

      console.log("Fetching fresh news from NewsAPI...")

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
        this.timestamp = Date.now()
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
            timestamp: this.timestamp
          } as News
  
        })
        console.log("Last Request to News API: ", this.timestamp)
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
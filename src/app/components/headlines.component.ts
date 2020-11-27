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

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private newsDB: NewsDB
    ) { }

  async ngOnInit() {
    this.code = this.activatedRoute.snapshot.params.code
    console.log(this.code)
    this.apiKey = (await this.newsDB.pageRouteDB())[0]['apiKey']
    console.log(this.apiKey)

    const url = `https://newsapi.org/v2/top-headlines`
    const headers = (new HttpHeaders()).set('X-Api-Key', this.apiKey)
    console.log(headers)
    let params = (new HttpParams()).set('country', this.code).set('pageSize', '30')
    console.log(params)
    this.http.get<any>(url, { headers: headers,  params: params })
    .toPromise()
    .then(resp => {
      const results = resp.articles.map(n => {
        return {
          sourceName: n['source']['name'],
          author: n['author'],
          title: n['title'],
          description: n['description'],
          url: n['url'],
          imageUrl: n['urlToImage'],
          datetime: n['publishedAt'],
          content: n['content']
        } as News
      })
      this.searchResults = results
      console.log(">>>Search Results array: ", this.searchResults)
    })

  this.country = await this.newsDB.getCountryName(this.code)
  console.log(this.country)
  }

}
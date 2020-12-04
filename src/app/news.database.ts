import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { apiKey, Countries, News } from './models';

@Injectable()
export class NewsDB extends Dexie {

    private apiKey : Dexie.Table<apiKey, string>
    private countries: Dexie.Table<Countries>
    private news: Dexie.Table<News>

    constructor() {

        super('NewsDB')
        this.version(1).stores({
            apiKey: 'apiKey',
            countries: 'code',
            news: '++newsid,country'
        })

        this.version(2).stores({
            apiKey: 'apiKey',
            countries: 'code',
            news: '++newsid,country,timestamp,save'
        })

        this.apiKey = this.table('apiKey')
        this.countries = this.table('countries')
        this.news = this.table('news')
    }

    async pageRouteDB(): Promise<any> {
        const apiKeys = await this.apiKey.toArray()
        return apiKeys
    }

    async saveApiDB(apiKey: apiKey): Promise<any> {
        let k = apiKey
        const apiCount = await this.apiKey.where('apiKey').equals(k.apiKey).count()
        console.log(apiCount)
        if(apiCount <= 0)
            return this.apiKey.add(k)
    }

    async deleteApiDB(apiKey: apiKey): Promise<any> {
        let k = apiKey
        // const apiCount = await this.apiKey.where('apiKey').equals(k.apiKey).count()
        // console.log(apiCount)
        // if(apiCount > 0)
        //     return this.apiKey.add(k)
        const deletedApi = await this.apiKey.where('apiKey').equals(k.apiKey).delete()
        console.log(deletedApi)
    }
    
    async countriesCountDB(): Promise<any> {
        const countryCount = await this.countries.toArray()
        return countryCount
    }

    async saveCountriesDB(countries: Countries[]): Promise<any> {
        await this.countries.bulkPut(countries)
        return console.log(countries)
    }

    async saveNewsDB(searchResults: News[]): Promise<any> {
        await this.news.bulkPut(searchResults)
        return console.log(searchResults)
    }

    async getCountryName(code: string): Promise<any> {
        return (await this.countries.get(code))['name']
    }

    async saveTargetNewsDB(targetNews: News): Promise<any> {
        await this.news.add(targetNews)
        return console.log(">>>Returning from NewsDB: ", targetNews)
    }

    async getNews(country: string): Promise<any> {
        const newsCount = await this.news.where('country').equals(country).toArray()
        console.log("Returning news", newsCount)
        return newsCount
    }

    async deleteNews(expiredNews): Promise<any> {
        let a = expiredNews.map(x => x.newsid)
        console.log(a)
        return this.news.bulkDelete(expiredNews.map(x => x.newsid))
    }
}

//persist API key, Country list, News Article


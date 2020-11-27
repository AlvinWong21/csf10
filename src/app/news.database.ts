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
            news: '++newsid'

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
        await this.countries.bulkAdd(countries)
        return console.log(countries)
    }

    async getCountryName(code: string): Promise<any> {
        return (await this.countries.get(code))['name']
    }
}

//persist API key, Country list, News Article


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Countries } from '../models';
import { NewsDB } from '../news.database';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  url = "https://restcountries.eu/rest/v2/alpha?codes=ae;ar;at;au;be;bg;br;ca;ch;cn;co;cu;cz;de;eg;fr;gb;gr;hk;hu;id;ie;il;in;it;jp;kr;lt;lv;ma;mx;my;ng;nl;no;nz;ph;pl;pt;ro;rs;ru;sa;se;sg;si;sk;th;tr;tw;ua;us;ve;za"
  countryList: Countries[] = []

  constructor(
    private http: HttpClient,
    private newsDB: NewsDB
  ) { }

  async ngOnInit() {
    let countryCount = await this.countriesCount()
    console.log("Country count: ", countryCount.length)
    if (countryCount.length <= 0) {
      this.requestCountries()
    }
    else {
      console.log("List of countries exist in NewsDB.countries.")
      this.countryList = countryCount
      console.log(">>>List of countries: ", this.countryList)
    }
    
  }

  async countriesCount() {
    console.log(">>>Checking country list in NewsDB.country...")
    let countryCount = await this.newsDB.countriesCountDB()
    console.log(">>>Country list exists in NewsDB.country: ", countryCount)
    return countryCount
  }

  requestCountries() { 
    console.log(">>>Requesting country list from REST Countries...")  
    //make http client call to rest countries. test call.
    this.http.get(this.url)
    .toPromise()
    .then(async resp => { 
      // let results = resp
      //@ts-ignore
      this.countryList = resp.map(c => {
        return {
          code: c['alpha2Code'],
          name: c['name'],
          flag: c['flag']
        } as Countries
      })
      console.log(">>>Country list results: ", this.countryList)
      console.log(">>>Saving country list to NewsDB.countries...")
      await this.newsDB.saveCountriesDB(this.countryList);
    })

    
  }
}


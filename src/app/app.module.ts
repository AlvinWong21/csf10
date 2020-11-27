import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { ApiComponent } from './components/api.component';
import { CountriesComponent } from './components/countries.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewsDB } from './news.database';
import { HeadlinesComponent } from './components/headlines.component';


const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'api', component: ApiComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'headlines/:code', component: HeadlinesComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ApiComponent,
    CountriesComponent,
    HeadlinesComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(ROUTES), HttpClientModule
  ],
  providers: [NewsDB],
  bootstrap: [AppComponent]
})
export class AppModule { }

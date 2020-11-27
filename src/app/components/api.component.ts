import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { apiKey } from '../models';
import { NewsDB } from '../news.database';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  apiForm: FormGroup
  apiKeyAdded = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private newsDB: NewsDB
    ) { }

  ngOnInit(): void {
    this.apiForm = this.fb.group({
      apiKey: this.fb.control('', [ Validators.required ])
    })
    console.log(">>>API Key added: ", this.apiKeyAdded)
  }

  async saveApi() {
    let k = this.apiForm.get('apiKey').value
    k = k.trim()
    const apiKey: apiKey = {
      apiKey: k
    }
    console.log(apiKey)
    await this.newsDB.saveApiDB(apiKey)
    this.apiKeyAdded = true
    if (this.apiKeyAdded)
      console.log("API Key added to NewsDB.apiKey.")
    this.router.navigate(['/countries'])
  }

  async deleteApi() {
    let k = this.apiForm.get('apiKey').value
    k = k.trim()
    const apiKey: apiKey = {
      apiKey: k
    }
    console.log(apiKey)
    await this.newsDB.deleteApiDB(apiKey)
  }

}

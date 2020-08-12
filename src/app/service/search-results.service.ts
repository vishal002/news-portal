import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {

  constructor(private http: HttpClient) { }

  getSearchResults(requestBody) {
    if(requestBody.searchSource === 'hacker-news' ){
      return this.http.get(`${environment.server.hackerNews}search?query=${requestBody.searchText}`)
    }

    if(requestBody.searchSource === 'wiki' ){
      return this.http.get(`${environment.server.wiki}?action=opensearch&format=json&search=${requestBody.searchText}&origin=*`)
    }
  }

  getSubmissionCount(userName) {
    return this.http.get(`${environment.server.hackerNews}users:${userName}`)
  }
}

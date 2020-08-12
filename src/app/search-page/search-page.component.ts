import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchResultsService } from '../service/search-results.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  homePageSearchForm: FormGroup;
  searchResults: any;
  isLoading: boolean;

  constructor(private fb: FormBuilder,
              private searchService: SearchResultsService) {
    this.searchResults = [];
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.homePageSearchForm = this.fb.group({
      searchText: ['', Validators.required],
      searchSource: ['', Validators.required]
    })
  }

  getSource(event) {
    this.homePageSearchForm.patchValue({
      searchSource: event.target.value
    })
  }

  onSubmit() {
    this.isLoading = true;
    this.searchService.getSearchResults(this.homePageSearchForm.value)
      .subscribe( (response: any) => {
        this.searchResults = [];
        if(this.homePageSearchForm.get('searchSource').value === 'hacker-news') {
          this.searchResults = response.hits;
          // const results = response.hits;
          this.searchResults.forEach( (result: any, i) => {
            this.searchService.getSubmissionCount(result.author)
              .subscribe( (re: any) => {
                this.searchResults[i].submissionCount = re.karma || 0;
              }, error => {
                this.searchResults[i].submissionCount = 0;
            })
          })
        }
        else if (this.homePageSearchForm.get('searchSource').value === 'wiki') {
          if(response[1].length > 0){
            for(let i=0; i< response[1].length; i++){
              this.searchResults.push({author: response[1][i], title: response[2][i], url: response[3][i]})
            }
          }
          else {
            this.searchResults = [];
          }
        } else {
          this.searchResults = [];
        }
        this.isLoading = false;
      }, error => {
        this.searchResults = [];
        console.log('some error occurred ', error);
        this.isLoading = false;
      })
  }

  onClear() {
    this.searchResults = [];
  }

}

import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {BatchApiService} from '../../services/batch-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  type = 'All';
  results = [];
  batches = [];
  selectedBatch = '';

  selectedOptions = [];
  options = [
    'Highway Engineering',
    'Bridge',
    'Resavor',
    'Fluid',
    'Building',
    'Foundation',
  ];

  filterArgs = {available: false, name: '', page: 1};
  pagination = {limit: 10, maxPage: 1, count: 10};

  constructor(private userAPI: UserService, private batchAPI: BatchApiService) {
  }

  ngOnInit() {
    this.search();
    this.batchAPI.getAll().subscribe(data => {
      this.batches = data.batches;
    });
  }


  search() {
    if (this.selectedOptions.length > 0) {
      this.filterArgs['spec'] = JSON.stringify(this.selectedOptions);
    }
    if (this.selectedBatch) {
      this.filterArgs['batch'] = this.selectedBatch['_id'];
    }
    this.userAPI.search(this.filterArgs).subscribe(data => {
      this.results = data['users'].docs;
      this.pagination.maxPage = data['users'].pages;
      this.pagination.count = data['users'].total;
    });
  }

  getSchools(arr) {
    return arr.map(x => x.name).join(' | ');
  }
}

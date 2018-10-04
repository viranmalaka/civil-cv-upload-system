import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Index', field: 'index', filter: 'agTextColumnFilter', filterParams: {
        filterOptions: ['contains', 'notContains'],
        textFormatter: function (r) {
          if (r == null) return null;
          r = r.replace(new RegExp('[àáâãäå]', 'g'), 'a');
          r = r.replace(new RegExp('æ', 'g'), 'ae');
          r = r.replace(new RegExp('ç', 'g'), 'c');
          r = r.replace(new RegExp('[èéêë]', 'g'), 'e');
          r = r.replace(new RegExp('[ìíîï]', 'g'), 'i');
          r = r.replace(new RegExp('ñ', 'g'), 'n');
          r = r.replace(new RegExp('[òóôõøö]', 'g'), 'o');
          r = r.replace(new RegExp('œ', 'g'), 'oe');
          r = r.replace(new RegExp('[ùúûü]', 'g'), 'u');
          r = r.replace(new RegExp('[ýÿ]', 'g'), 'y');
          return r;
        },
        debounceMs: 0,
        caseSensitive: true,
        suppressAndOrCondition: true
      }
    },
    {headerName: 'Batch', field: 'batch.name'},
    {headerName: 'Name', field: 'name'},
    {headerName: 'Address', field: 'address'},
    {headerName: 'AccountEmail', field: 'accountEmail'},
    {headerName: 'Status', field: 'status'},
    {headerName: 'Type', field: 'type'},
    {headerName: 'CV Uploaded At', field: 'cvUploadedAt'},
    {headerName: 'DP', field: 'hasDP'},
    {headerName: 'Looking For Job', field: 'lookingForJob'},
  ];

  rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000},
    {make: 'Ford', model: 'Mondeo', price: 32000},
    {make: 'Porsche', model: 'Boxter', price: 72000}
  ];

  constructor(private userAPI: UserService) {
  }

  ngOnInit() {
    this.userAPI.getAll().subscribe(data => {
      this.rowData = data['all'];
    });
  }

}

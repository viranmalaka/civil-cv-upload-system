import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {IContext} from '../../admin-layout.component';
import {ModalTemplate, TemplateModalConfig, SuiModalService} from 'ng2-semantic-ui';
import {GridApi, ColumnApi} from 'ag-grid-community';
import {ToastrService} from 'ngx-toastr';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  colVisibility = {
    index: true,
    'batch.name': true,
    name: true,
    address: true,
    accountEmail: true,
    status: true,
    cvUploadedAt: true,
    hasDP: true,
    lookingForJob: true,
    firstRowPassword: false,
  };
  csvExport = {
    index: true,
    'batch.name': true,
    name: true,
    address: true,
    accountEmail: true,
    lookingForJob: true,
    firstRowPassword: false,
  };
  filename = 'export-data';


  columnDefs = [
    {
      headerName: 'ID',
      width: 110,
      valueGetter: (param) => {
        return param.node.rowIndex + 1;
      },
      lockPosition: true,
      checkboxSelection: true,
      rowDrag: true
    },
    {headerName: 'Index', field: 'index'},
    {headerName: 'Batch', field: 'batch.name'},
    {headerName: 'Name', field: 'name'},
    {headerName: 'Address', field: 'address'},
    {headerName: 'AccountEmail', field: 'accountEmail'},
    {
      headerName: 'Status', field: 'status',
      valueGetter: (p) => {
        if (p.data.status === 'first-login') {
          return 'Not Logged Yet';
        } else if (p.data.status === 'uom') {
          return 'OK';
        }
      },
      cellStyle: (p) => {
        if (p.data.status === 'first-login') {
          return {'background-color': '#ffe599'};
        }
      }
    },
    {
      headerName: 'CV Uploaded At', field: 'cvUploadedAt', valueGetter: (p) => {
        if (p.data.cvUploadedAt) {
          const x = new Date(p.data.cvUploadedAt),
            yy = x.getFullYear(),
            mm = x.getMonth() + 1,
            dd = x.getDay(),
            h = x.getHours(),
            m = x.getMinutes();
          return yy + '/' + mm + '/' + dd + ' ' + (h % 12) + ':' + m + ' ' + (h >= 12 ? 'PM' : 'AM');
        } else {
          return 'Not Uploaded';
        }
      },
      cellStyle: (p) => {
        if (p.data.cvUploadedAt) {
          return {'background-color': '#ceffb9'};
        } else {
          return {'background-color': '#ffa295'};
        }
      }
    },
    {headerName: 'DP Uploaded', field: 'hasDP', valueGetter: (p) => p.data.hasDP ? 'YES' : 'NO'},
    {
      headerName: 'Looking For Job',
      field: 'lookingForJob',
      valueGetter: (p) => p.data.lookingForJob ? 'YES' : 'NO',
      cellStyle: (p) => {
        if (p.data.lookingForJob) {
          return {'background-color': '#55f57b'};
        }
      }
    },
    {
      headerName: 'First Time Password', field: 'firstRowPassword',
      valueGetter: (param) => {
        if (param.data.status === 'first-login') {
          return param.data.firstRowPassword;
        } else {
          return '[Password Changed]';
        }
      },
      hide: true,
    },
  ];

  rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000},
    {make: 'Ford', model: 'Mondeo', price: 32000},
    {make: 'Porsche', model: 'Boxter', price: 72000}
  ];

  menu: boolean;

  @ViewChild('settingMod') public modal: ModalTemplate<IContext, string, string>;
  @ViewChild('exportCSV') public exportCSV: ModalTemplate<IContext, string, string>;
  gridAPI: GridApi;
  columnAPI: ColumnApi;

  constructor(private userAPI: UserService, private toastr: ToastrService, private modalService: SuiModalService) {
  }

  ngOnInit() {
    this.userAPI.getAll().subscribe(data => {
      this.rowData = data['all'];
    });
  }

  public changeSettings() {
    const config = new TemplateModalConfig<IContext, string, string>(this.modal);

    config.closeResult = 'closed!';
    config.size = 'normal';
    config.mustScroll = true;
    // config.context = {data: row};
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          Object.keys(this.colVisibility).forEach(k => {
            this.columnAPI.setColumnVisible(k, this.colVisibility[k]);
          });

        }
      });
  }

  changeJobStates(val) {
    const arr = [];
    this.gridAPI.getSelectedRows().forEach(r => {
      arr.push(r.index);
    });
    this.userAPI.changeJobStates(arr, val).subscribe(data => {
      console.log(data);
      if (data.success) {
        this.toastr.success('Changed');
        this.gridAPI.getSelectedRows().forEach(r => {
          // r.('lookingForJob', val);
          r.lookingForJob = val;
        });
        this.gridAPI.refreshCells();
      }
    });
  }

  exportCSVModal() {

    const config = new TemplateModalConfig<IContext, string, string>(this.exportCSV);

    config.closeResult = 'closed!';
    config.size = 'small';
    config.mustScroll = true;
    // config.context = {data: row};
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          const columns = [];
          Object.keys(this.csvExport).forEach(k => {
            if (this.csvExport[k]) {
              columns.push(k);
            }
          });
          console.log('asdfasd', columns);
          this.gridAPI.exportDataAsCsv({
            fileName: this.filename + '.csv', columnKeys: columns
          });
        }
      });

  }

  onGridReady(e) {
    this.gridAPI = e.api;
    this.columnAPI = e.columnApi;
  }
}

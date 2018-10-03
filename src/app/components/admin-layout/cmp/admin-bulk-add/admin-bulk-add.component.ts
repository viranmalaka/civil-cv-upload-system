import {Component, OnInit, ElementRef} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {BatchApiService} from '../../../../services/batch-api.service';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

interface IOption {
  _id?: number;
  name: string;
}

@Component({
  selector: 'app-admin-bulk-add',
  templateUrl: './admin-bulk-add.component.html',
  styleUrls: ['./admin-bulk-add.component.scss']
})
export class AdminBulkAddComponent implements OnInit {

  public selectedOption: IOption;

  filteredOptions = [];

  constructor(private batchAPI: BatchApiService, private userAPI: UserService, private el: ElementRef,
              private toastr: ToastrService) {
    this.batchAPI.getAll().subscribe(data => {
      this.filteredOptions = data.batches;
    });
  }

  ngOnInit() {
  }

  upload() {
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#csv');
    this.userAPI.getBase64(inputEl.files.item(0), (err, b64) => {
      if (!err) {
        this.userAPI.bulkAddCSV({batch: this.selectedOption, csv: b64}).subscribe(data => {
          if (data.err.length > 0) {
            this.toastr.error(data.err.length + ' number of error rows');
          } else {
            this.toastr.success('Success');
            this.toastr.success(data.succ.length + ' number of records added');
          }
        });
      } else {
        this.toastr.error('CSV Encoding Error');
      }
    });
  }

}

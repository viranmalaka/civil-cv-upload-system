import {Component, OnInit} from '@angular/core';
import {BatchApiService} from '../../../../services/batch-api.service';
import {UserService} from '../../../../services/user.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

interface IOption {
  _id?: number;
  name: string;
}

@Component({
  selector: 'app-admin-add-one',
  templateUrl: './admin-add-one.component.html',
  styleUrls: ['./admin-add-one.component.scss']
})
export class AdminAddOneComponent implements OnInit {

  public selectedOption: IOption;

  filteredOptions = [];
  index = '';
  msg = false;
  usrData = {index: '', pass: ''};

  constructor(private batchAPI: BatchApiService, private userAPI: UserService, private toastr: ToastrService) {
    this.batchAPI.getAll().subscribe(data => {
      this.filteredOptions = data.batches;
    });
  }

  ngOnInit() {
  }

  addOne() {
    this.userAPI.createOne({index: this.index, batch: this.selectedOption._id}).subscribe(data => {
      if (data.success) {
        this.msg = true;
        this.usrData = {
          index: data.user.index,
          pass: data.user.firstRowPassword,
        };
        this.toastr.success('Successfully Added');
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error => {
      this.toastr.error('Something went wrong (NET)');
    });
  }
}

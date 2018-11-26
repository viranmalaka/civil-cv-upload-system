import {Component, OnInit, ViewChild} from '@angular/core';
import {IContext} from '../admin-batch/admin-batch.component';
import {UserService} from '../../../../services/user.service';
import {BatchApiService} from '../../../../services/batch-api.service';
import {ToastrService} from 'ngx-toastr';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';


export interface IContext {
  data: any;
}

interface IOption {
  _id?: number;
  name: string;
}

@Component({
  selector: 'app-admin-generator',
  templateUrl: './admin-generator.component.html',
  styleUrls: ['./admin-generator.component.scss']
})
export class AdminGeneratorComponent implements OnInit {
  @ViewChild('addModal') public addModal: ModalTemplate<IContext, string, string>;
  @ViewChild('deleteModal') public deleteModal: ModalTemplate<IContext, string, string>;

  newAdmin = {
    username: '',
    name: ''
  };

  adminList = [];

  public selectedOption: IOption;

  filteredOptions = [];

  constructor(private userServce: UserService,
              public modalService: SuiModalService,
              public batchAPI: BatchApiService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.userServce.getAllAdmins().subscribe(data => {
      if (data.success) {
        this.adminList = data.admins;
      } else {
        this.toastr.error('something went wrong');
      }
    });
  }

  public openForm(add, row = {}) {
    const config = new TemplateModalConfig<IContext, string, string>(this.addModal);

    config.closeResult = 'closed!';
    config.size = 'tiny';
    row['btn'] = add ? 'SAVE' : 'EDIT';
    config.context = {data: row};

    this.modalService
      .open(config)
      .onApprove(result => {
        if (add) {
          console.log(this.newAdmin);
          this.userServce.createAdmin(this.newAdmin).subscribe(data => {
            if(data.success) {
              this.toastr.success('Admin created successfully');
              this.userServce.getAllAdmins().subscribe(data2 => {
                if (data2.success) {
                  this.adminList = data2.admins;
                } else {
                  this.toastr.error('something went wrong');
                }
              });
            } else {
              this.toastr.error('something went wrong');
            }
          });
        }
      })
      .onDeny(result => {

      });
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import {BatchApiService} from '../../../../services/batch-api.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../../services/user.service';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-batch',
  templateUrl: './admin-batch.component.html',
  styleUrls: ['./admin-batch.component.scss']
})
export class AdminBatchComponent implements OnInit {

  @ViewChild('addModal') public addModal: ModalTemplate<IContext, string, string>;
  @ViewChild('deleteModal') public deleteModal: ModalTemplate<IContext, string, string>;

  batchList = [];

  batch = {name: '', passOutYear: ''};
  batchCounts = {};

  constructor(private userServce: UserService,
              public modalService: SuiModalService,
              public batchAPI: BatchApiService, private toastr: ToastrService) {
    this.refreshList();
    this.batchCounts = this.userServce.adminCount['batch'];
  }

  private refreshList() {
    this.batchAPI.getAll().subscribe(data => {
      this.batchList = data.batches;
    });
  }

  ngOnInit() {
  }

  public openForm(add, row = {}) {
    const config = new TemplateModalConfig<IContext, string, string>(this.addModal);

    config.closeResult = 'closed!';
    config.size = 'tiny';
    row['btn'] = add ? 'SAVE' : 'EDIT';
    config.context = {data: row};

    if (add) {
      this.batch = {name: '', passOutYear: ''};
    } else {
      this.batch = {name: row['name'], passOutYear: row['passOutYear']};
    }

    this.modalService
      .open(config)
      .onApprove(result => {
        if (add) {
          this.batchAPI.createNew(this.batch).subscribe(data => {
            if (data.success) {
              this.refreshList();
              this.toastr.success('Added');
            } else {
              this.toastr.error('Something went wrong');
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        } else {
          this.batchAPI.editById(row['_id'], this.batch).subscribe(data => {
            if (data.success) {
              this.refreshList();
              this.toastr.success('Edited');
            } else {
              this.toastr.error('Something went wrong');
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        }
      })
      .onDeny(result => {
        this.batch = {name: '', passOutYear: ''};
      });
  }

  public openDelete(row) {
    const config = new TemplateModalConfig<IContext, string, string>(this.deleteModal);

    config.closeResult = 'closed!';
    config.size = 'tiny';
    config.context = {data: row};
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          this.batchAPI.deleteById(row['_id']).subscribe(data => {
            if (data.success) {
              if (data.success) {
                this.refreshList();
                this.toastr.success('Deleted');
              } else {
                this.toastr.error('Something went wrong');
              }
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        }
      });
  }

}

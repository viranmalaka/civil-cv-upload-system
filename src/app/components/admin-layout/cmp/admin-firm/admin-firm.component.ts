import {Component, OnInit, ViewChild} from '@angular/core';
import {TemplateModalConfig, ModalTemplate, SuiModalService} from 'ng2-semantic-ui';
import {OtherApiService} from '../../../../services/other-api.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../../services/user.service';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-firm',
  templateUrl: './admin-firm.component.html',
  styleUrls: ['./admin-firm.component.scss']
})
export class AdminFirmComponent implements OnInit {

  @ViewChild('modal') public modal: ModalTemplate<IContext, string, string>;

  firmList = [];
  firmCounts = {};

  firm = '';

  constructor(public modalService: SuiModalService, public otherAPI: OtherApiService,
              private toastr: ToastrService, private userService: UserService) {
    this.refreshList();
    this.firmCounts = this.userService.adminCount['firm'];
  }

  private refreshList() {
    this.otherAPI.getAllFirm().subscribe(data => {
      this.firmList = data.firms;
    });
  }

  ngOnInit() {
  }

  public openForm(row) {
    const config = new TemplateModalConfig<IContext, string, string>(this.modal);
    const oldVal = row;
    config.closeResult = 'closed!';
    config.size = 'tiny';
    config.context = {data: row};

    this.modalService
      .open(config)
      .onApprove(result => {
        this.otherAPI.editFirm(oldVal, result).subscribe(data => {
          if (data.success) {
            this.refreshList();
            this.toastr.success('Edited');
          } else {
            this.toastr.error('Something went wrong');
          }
        }, error1 => {
          this.toastr.error('Something went wrong (NET)');
        });
      })
      .onDeny(result => {
        this.firm = '';
      });
  }
}

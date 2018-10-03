import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate, SuiModalService, TemplateModalConfig} from 'ng2-semantic-ui';
import {ToastrService} from 'ngx-toastr';
import {OtherApiService} from '../../../../services/other-api.service';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-positions',
  templateUrl: './admin-positions.component.html',
  styleUrls: ['./admin-positions.component.scss']
})
export class AdminPositionsComponent implements OnInit {

  @ViewChild('modal') public modal: ModalTemplate<IContext, string, string>;

  positionList = [];

  position = '';

  constructor(public modalService: SuiModalService, public otherAPI: OtherApiService, private toastr: ToastrService) {
    this.refreshList();
  }

  private refreshList() {
    this.otherAPI.getAllPosition().subscribe(data => {
      this.positionList = data.positions;
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

    this.position = '';

    this.modalService
      .open(config)
      .onApprove(result => {
        this.otherAPI.editPosition(oldVal, result).subscribe(data => {
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
        this.position = '';
      });
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate, SuiModalService, TemplateModalConfig} from 'ng2-semantic-ui';
import {ToastrService} from 'ngx-toastr';
import {OtherApiService} from '../../../../services/other-api.service';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-school',
  templateUrl: './admin-school.component.html',
  styleUrls: ['./admin-school.component.scss']
})
export class AdminSchoolComponent implements OnInit {

  @ViewChild('modal') public modal: ModalTemplate<IContext, string, string>;

  schoolList = [];

  school = '';

  constructor(public modalService: SuiModalService, public otherAPI: OtherApiService, private toastr: ToastrService) {
    this.refreshList();
  }

  private refreshList() {
    this.otherAPI.getAllSchools().subscribe(data => {
      this.schoolList = data.schools;
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
          this.otherAPI.editSchool(oldVal, result).subscribe(data => {
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
        this.school = '';
      });
  }
}

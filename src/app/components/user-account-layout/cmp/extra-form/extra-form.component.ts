import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {SuiModalService, ModalTemplate, TemplateModalConfig} from 'ng2-semantic-ui';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-extra-form',
  templateUrl: './extra-form.component.html',
  styleUrls: ['./extra-form.component.scss']
})
export class ExtraFormComponent implements OnInit {

  extra = [];
  newExtra = '';
  @ViewChild('deleteModal') public deleteModal: ModalTemplate<IContext, string, string>;

  constructor(private userAPI: UserService, private toastr: ToastrService, public modalService: SuiModalService) {
  }

  ngOnInit() {
    this.extra = this.userAPI.currentUsr.extra.map(e => {
      return {txt: e};
    });
  }

  addNewOne() {
    this.extra.push({txt: this.newExtra});
    this.newExtra = '';
  }

  saveAll() {
    this.userAPI.editExtra(this.extra.map(e => e.txt)).subscribe(data => {
      if (data.success) {
        this.extra = data.newExtra.map(e => {
          return {txt: e};
        });
        this.toastr.success('Success');
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error1 => {
      this.toastr.error('Something went wrong (NET)');
    });
  }

  delete(index) {
    const config = new TemplateModalConfig<IContext, string, string>(this.deleteModal);
    config.closeResult = 'closed!';
    config.size = 'tiny';
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          this.extra.splice(index, 1);
          this.userAPI.editExtra(this.extra.map(e => e.txt)).subscribe(data => {
            if (data.success) {
              this.extra = data.newExtra.map(e => {
                return {txt: e};
              });
              this.toastr.success('Success');
            } else {
              this.toastr.error('Something went wrong');
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        }
      });
  }
}

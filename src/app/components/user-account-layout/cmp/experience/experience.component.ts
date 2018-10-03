import {UserService} from '../../../../services/user.service';

declare const $: any;
import {Component, OnInit, ViewChild} from '@angular/core';
import {OtherApiService} from '../../../../services/other-api.service';
import {ToastrService} from 'ngx-toastr';
import {IContext} from '../../../admin-layout/cmp/admin-batch/admin-batch.component';
import {ModalTemplate, TemplateModalConfig, SuiModalService} from 'ng2-semantic-ui';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  myExperience = [];
  allFirms = [];
  allPositions = [];
  selectedFirm = null;
  searchFirmText = '';
  selectedPosition = '';

  mode = '';

  @ViewChild('deleteModal') public deleteModal: ModalTemplate<IContext, string, string>;

  constructor(private otherAPI: OtherApiService, private userAPI: UserService, private toastr: ToastrService,
              public modalService: SuiModalService) {
    this.userAPI.getMe().subscribe(data => {
      if (data['success']) {
        this.userAPI.currentUsr = data.user;
        this.myExperience = data.user.experience.map(e => {
          e.title = e.firm;
          return e;
        });
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error1 => {
      this.toastr.error('Something went wrong (NET)');
    });
  }

  ngOnInit() {
    this.otherAPI.getAllFirm().subscribe(data => {
      this.allFirms = data.firms.map(x => {
        return {title: x};
      });
      this.otherAPI.getAllPosition().subscribe(data1 => {
        this.allPositions = data1.positions.map(x => {
          return {title: x};
        });
        this.initSeachBox();
      });
    });
  }

  addNewExperience() {
    this.myExperience.forEach(e => {
      e.isOpen = false;
    });
    if (this.mode !== 'adding') {
      this.myExperience.push({
        title: 'Your Experience',
        firm: '',
        from: '',
        to: '',
        position: '',
        present: false,
        isOpen: true
      });
      this.mode = 'adding';
      this.initSeachBox();
    }
  }

  save(exp, index) {
    try {
      exp.from = parseInt(exp.from, 10);
      exp.to = parseInt(exp.to, 10);
      exp['firm'] = this.selectedFirm;
      exp['position'] = this.selectedPosition;

      this.sendEditRequest(() => {
        this.myExperience[index].isOpen = true;
      });
    } catch (e) {
      this.toastr.error('Validation Error');
    }
  }

  delete(index) {
    const config = new TemplateModalConfig<IContext, string, string>(this.deleteModal);
    config.closeResult = 'closed!';
    config.size = 'tiny';
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          this.myExperience.splice(index, 1);
          this.sendEditRequest();
        }
      });
  }

  sendEditRequest(next = null) {
    this.myExperience = this.myExperience.map(e => {
      return {
        firm: e.firm,
        position: e.position,
        from: e.from,
        to: e.to,
        present: e.present,
      };
    });
    this.userAPI.editExperience(this.myExperience).subscribe(data => {
      if (data.success) {
        this.myExperience = data.newExp.map(e => {
          e.title = e.firm;
          return e;
        });
        if (next) next();
        this.toastr.success('Success');
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error1 => {
      this.toastr.error('Something went wrong (NET)');
    });
  }

  initSeachBox() {
    $('.ui.search.firm')
      .search({
        source: this.allFirms,
        searchFields: ['title'],
        onSelect: (result) => {
          this.selectedFirm = result.title;
        }
      })
    ;
    $('.ui.search.position')
      .search({
        source: this.allPositions,
        searchFields: ['title'],
        onSelect: (result) => {
          this.selectedPosition = result.title;
        }
      })
    ;
  }
}

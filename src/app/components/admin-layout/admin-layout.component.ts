import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate} from 'ng2-semantic-ui';
import {UserService} from '../../services/user.service';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  comp = 'view';

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAdminCount(false).subscribe(data => {
      if (data.success) {
        this.userService.adminCount = data.data;
      }
    });
  }

  getTitle(comp) {
    switch (comp) {
      case 'view':
        return 'View';
      case 'add-one':
        return 'Add One Candidate';
      case 'bulk':
        return 'Add Bulk Candidates';
      case 'batch':
        return 'Batches';
      case 'firm':
        return 'Firms';
      case 'school':
        return 'Schools';
      case 'position':
        return 'Positions';
      case 'admin':
        return 'Mange Admin Accounts';
      case 'admin-pass':
        return 'Passwords';
    }
  }


}

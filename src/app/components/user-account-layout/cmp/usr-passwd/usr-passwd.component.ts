import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-usr-passwd',
  templateUrl: './usr-passwd.component.html',
  styleUrls: ['./usr-passwd.component.scss']
})
export class UsrPasswdComponent implements OnInit {

  @Input() firstMsg;
  @Output() changed = new EventEmitter();

  pass = {
    curr: '',
    newPass: '',
    confirm: ''
  };

  constructor(private userAPI: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  submit() {
    if (this.pass.curr === '' || this.pass.newPass === '' || this.pass.confirm === '') {
      this.toastr.error('Bad Input');
    } else {
      if (this.pass.newPass !== this.pass.confirm) {
        this.toastr.error('Passwords not matches');
      } else {
        if (this.pass.newPass.length < 4) {
          this.toastr.error('Password should have at least 4 characters');
        } else {
          this.userAPI.changePassword(this.pass.curr, this.pass.newPass).subscribe(data => {
            if (data.success) {
              this.toastr.success('Change the password successfully');
              this.pass = {curr: '', newPass: '', confirm: ''};
              this.changed.emit(true);
            } else {
              this.toastr.error('Something went wrong');
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        }
      }
    }
  }

}

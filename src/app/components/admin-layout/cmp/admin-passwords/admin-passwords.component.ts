import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin-passwords',
  templateUrl: './admin-passwords.component.html',
  styleUrls: ['./admin-passwords.component.scss']
})
export class AdminPasswordsComponent implements OnInit {

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
        if (this.pass.newPass.length < 6) {
          this.toastr.error('Password should have at least 6 characters');
        } else {
          this.userAPI.changePassword(this.pass.curr, this.pass.newPass).subscribe(data => {
            if (data.success) {
              this.toastr.success('Change the password successfully');
              this.pass = {curr: '', newPass: '', confirm: ''};
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

import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usr = {
    index: '140001A',
    password: 'test',
  };

  constructor(private user: UserService, private route: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  login() {
    this.user.postLogin(this.usr).subscribe(res => {
      if (res.auth) {
        this.user.isLoggedIn = true;
        this.user.token = res.token;
        this.user.getMe().subscribe(data => {
          this.user.currentUsr = data.user;
          if (data.user.type === 'admin' || data.user.type === 'sadmin') {
            this.toastr.success('You logged in as Admin');
            this.route.navigate(['admin']);
          } else {
            this.toastr.success('You logged in');
            this.route.navigate(['user-account']);
          }
        });
      } else {
        this.toastr.error('Something went wrong');
        console.log(res);
        this.usr = {
          index: '',
          password: '',
        };
      }
    }, err => {
      this.toastr.error('Something went wrong (NET)');
      console.log(err);
    });
  }

}

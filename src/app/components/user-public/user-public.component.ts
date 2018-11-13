import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-public',
  templateUrl: './user-public.component.html',
  styleUrls: ['./user-public.component.scss']
})
export class UserPublicComponent implements OnInit {

  userId = '';
  currentUser;

  constructor(private activeRouter: ActivatedRoute, private userAPI: UserService) {
  }

  ngOnInit() {
    this.activeRouter.params.subscribe(data => {
      this.userId = data.id;

      this.userAPI.getPublicPage(this.userId).subscribe(response => {
        this.currentUser = response.user;
      });
    });
  }

}

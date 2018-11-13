declare const $: any;

import {OtherApiService} from '../../../../services/other-api.service';
import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public schools: string[];
  currentUser = {};
  searchSchool = {};

  constructor(private userAPI: UserService, private toastr: ToastrService, private otherAPI: OtherApiService) {
    this.currentUser = this.userAPI.currentUsr;
  }

  public get options(): string[] {
    return this.schools;
  }

  ngOnInit() {
    this.otherAPI.getAllSchools().subscribe(data => {
      this.schools = data.schools.map(x => {
        return {
          title: x,
        };
      });
      $('.ui.search')
        .search({
          source: this.schools,
          searchFields: ['title'],
          onSelect: (result) => {
            this.searchSchool['searchText'] = result.title;
          }
        })
      ;
    });
  }

  submit() {

    const body = {
      name: this.currentUser['name'],
      address: this.currentUser['address'],
      contactNo: this.currentUser['contactNo'],
      email: this.currentUser['email'],
      accountEmail: this.currentUser['accountEmail'],
      school: this.currentUser['school'],
      linkedIn: this.currentUser['linkedIn'],
    };

    this.userAPI.updatePersonal(body).subscribe(data => {
      if (data.success) {
        this.toastr.success('Updated');
        this.userAPI.currentUsr = data.newUser;
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error1 => {
      this.toastr.error('Something went wrong (NET)');
    });
  }

  addList(mode, val) {
    if (mode === 'email') {
      // tslint:disable
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // tslint:enable
      if (re.test(String(val).toLowerCase())) {
        this.currentUser['email'].push(val);
      } else {
        this.toastr.warning('Invalid');
      }
    } else {
      const re = /((\+94)|0)?[1-9][0-9]{8}/;
      if (re.test(String(val).toLowerCase())) {
        this.currentUser['contactNo'].push(val);
      } else {
        this.toastr.warning('Invalid');
      }
    }
  }

  removeList(mdl, index) {
    // const index = mdl.indexOf(val);
    mdl.splice(index, 1);
  }

  addSchool() {
    try {
      const from = parseInt(this.searchSchool['from'], 10);
      const to = parseInt(this.searchSchool['to'], 10);
      if (from > 1997 && to > 1998 && from < to && to - from < 14) {

        if (this.searchSchool['searchText'] === undefined || this.searchSchool['searchText'] === '') {
          this.toastr.error('Validation error in name');
        } else {
          this.currentUser['school'].push({
            name: this.searchSchool['searchText'],
            from: from,
            to: to,
          });
        }
        this.searchSchool = {};
      } else {
        this.toastr.warning('Invalid years');
      }

    } catch (e) {
      this.toastr.error('Validation error');
    }
  }
}

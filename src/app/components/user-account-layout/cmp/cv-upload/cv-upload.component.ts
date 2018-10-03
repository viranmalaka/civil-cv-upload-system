import {Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cv-upload',
  templateUrl: './cv-upload.component.html',
  styleUrls: ['./cv-upload.component.scss']
})
export class CvUploadComponent implements OnInit {

  user;

  constructor(private userAPI: UserService, private el: ElementRef, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.user = this.userAPI.currentUsr;
  }

  upload() {
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#cv');
    console.log(inputEl.files.item(0));
    this.userAPI.getBase64(inputEl.files.item(0), (err, b64) => {
      if (!err) {
        this.userAPI.uploadCV(b64).subscribe(data => {
          console.log(data);
          // if (data.err.length > 0) {
          //   this.toastr.error(data.err.length + ' number of error rows');
          // } else {
          //   this.toastr.success('Success');
          //   this.toastr.success(data.succ.length + ' number of records added');
          // }
        });
      } else {
        this.toastr.error('CSV Encoding Error');
      }
    });
  }
}

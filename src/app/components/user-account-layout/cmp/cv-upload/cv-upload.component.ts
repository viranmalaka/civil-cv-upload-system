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

  selectedOptions;
  options = [
    'Highway Engineering',
    'Bridge',
    'Resavor',
    'Fluid',
    'Building',
    'Foundation',
  ];

  constructor(private userAPI: UserService, private el: ElementRef, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.user = this.userAPI.currentUsr;
    this.selectedOptions = this.user.special;
  }

  upload() {
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#cv');
    console.log(inputEl.files.item(0));
    this.userAPI.getBase64(inputEl.files.item(0), (err, b64) => {
      if (!err) {
        this.userAPI.uploadCV(b64).subscribe(data => {
          console.log(data);
          if (data.success) {
            this.toastr.success('Your CV is uploaded');
          } else {
            this.toastr.error('Something went wrong');
          }
        });
      } else {
        this.toastr.error('PDF Encoding Error');
      }
    });
  }

  saveSpecial() {
    this.userAPI.editSpecial(this.selectedOptions).subscribe(data => {
      if (data['success']) {
        this.toastr.success('Successful');
        this.userAPI.currentUsr = data['newUser'];
        this.selectedOptions = data['newUser'].special;
      } else {
        this.toastr.error('Something went wrong');
      }
    }, error => {
      this.toastr.error('Something went wrong (NET)');
    });
  }
}

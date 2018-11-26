import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {IContext} from '../admin-layout/cmp/admin-batch/admin-batch.component';
import {TemplateModalConfig, ModalTemplate, SuiModalService} from 'ng2-semantic-ui';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

export interface IContext {
  data: any;
}

@Component({
  selector: 'app-user-account-layout',
  templateUrl: './user-account-layout.component.html',
  styleUrls: ['./user-account-layout.component.scss']
})
export class UserAccountLayoutComponent implements OnInit {
  @ViewChild('picMod') public picMod: ModalTemplate<IContext, string, string>;

  mode = 'pdf';
  pagelock = false;
  currentUser;
  jobStatus = false;

  title = 'Personal Details';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  dpSrc = '../../../assets/images/user-dummy.png';

  constructor(private userAPI: UserService, private modalService: SuiModalService, private toastr: ToastrService,
              private router: Router) {
    userAPI.getMe().subscribe(data => {
      userAPI.currentUsr = data.user;
      this.currentUser = data.user;
      if (this.currentUser['status'] === 'first-login') {
        this.mode = 'pass';
        this.pagelock = true;
      }
      if (this.currentUser['hasDP']) {
        this.dpSrc = '/dp/' + this.currentUser.index + '.png';
      }
      this.jobStatus = this.currentUser['lookingForJob'];
    });
  }

  ngOnInit() {

  }

  changeMode(md) {
    if (!this.pagelock) {
      this.mode = md;

      switch (md) {
        case 'pdf':
          this.title = 'Personal Details';
          break;
        case 'pef':
          this.title = 'Experiences';
          break;
        case 'cv':
          this.title = 'Upload your CV';
          break;
        case 'ef':
          this.title = 'Extracurricular Activities';
          break;
        case 'pass':
          this.title = 'Account Settings';
          break;
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
    this.toastr.error('Image Loading Failed');
  }

  public changeProfilePicture() {
    const config = new TemplateModalConfig<IContext, string, string>(this.picMod);

    config.closeResult = 'closed!';
    config.size = 'normal';
    config.mustScroll = true;
    // config.context = {data: row};
    this.modalService
      .open(config)
      .onApprove(result => {
        if (result) {
          this.userAPI.uploadDP(this.croppedImage).subscribe(data => {
            if (data.success) {
              this.toastr.success('Picture Upload successfully');
              this.dpSrc = '/dp/' + this.currentUser.index + '.png?a=' + new Date().getTime();
            } else {
              this.toastr.error('Something went wrong');
            }
          }, error1 => {
            this.toastr.error('Something went wrong (NET)');
          });
        }
      });
  }

  changeJobStatus() {
    this.userAPI.editJobStatus(this.jobStatus).subscribe(data => {
      console.log(data);
    });
  }

  logout() {
    this.userAPI.currentUsr = null;
    this.userAPI.token = '';
    this.userAPI.isLoggedIn = false;
    this.router.navigate(['/']);
  }

}

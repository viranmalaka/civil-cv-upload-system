import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AgGridModule} from 'ag-grid-angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SuiModule} from 'ng2-semantic-ui';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
import {LoginComponent} from './components/login/login.component';
import {NavBarComponent} from './components/widgets/nav-bar/nav-bar.component';
import {LayoutComponent} from './components/layout/layout.component';
import {UserAccountLayoutComponent} from './components/user-account-layout/user-account-layout.component';
import {PersonalComponent} from './components/user-account-layout/cmp/personal/personal.component';
import {ExperienceComponent} from './components/user-account-layout/cmp/experience/experience.component';
import {ExtraFormComponent} from './components/user-account-layout/cmp/extra-form/extra-form.component';
import {CvUploadComponent} from './components/user-account-layout/cmp/cv-upload/cv-upload.component';
import {AdminLayoutComponent} from './components/admin-layout/admin-layout.component';
import {UsrPasswdComponent} from './components/user-account-layout/cmp/usr-passwd/usr-passwd.component';
import {AdminAddOneComponent} from './components/admin-layout/cmp/admin-add/admin-add-one.component';
import {AdminBatchComponent} from './components/admin-layout/cmp/admin-batch/admin-batch.component';
import {AdminFirmComponent} from './components/admin-layout/cmp/admin-firm/admin-firm.component';
import {AdminSchoolComponent} from './components/admin-layout/cmp/admin-school/admin-school.component';
import {AdminPositionsComponent} from './components/admin-layout/cmp/admin-positions/admin-positions.component';
import {FormsModule} from '@angular/forms';
import {AdminBulkAddComponent} from './components/admin-layout/cmp/admin-bulk-add/admin-bulk-add.component';
import {AdminViewComponent} from './components/admin-layout/cmp/admin-view/admin-view.component';
import {AuthGuardService} from './services/auth-guard.service';
import {UserService} from './services/user.service';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {BatchApiService} from './services/batch-api.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UserPublicComponent } from './components/user-public/user-public.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LoginComponent,
    NavBarComponent,
    LayoutComponent,
    UserAccountLayoutComponent,
    PersonalComponent,
    ExperienceComponent,
    ExtraFormComponent,
    CvUploadComponent,
    AdminLayoutComponent,
    UsrPasswdComponent,
    AdminAddOneComponent,
    AdminBatchComponent,
    AdminFirmComponent,
    AdminSchoolComponent,
    AdminPositionsComponent,
    AdminBulkAddComponent,
    AdminViewComponent,
    UserPublicComponent,
],
  imports: [
    FormsModule,
    AgGridModule.withComponents([]),
    BrowserModule,
    AppRoutingModule,
    SuiModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      easing: 'ease-in',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    ImageCropperModule,
  ],
  providers: [AuthGuardService, UserService, BatchApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

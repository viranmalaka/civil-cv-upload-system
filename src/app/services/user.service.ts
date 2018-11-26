import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoggedIn = false;
  token = '';
  currentUsr: any;
  adminCount: any;

  domain = environment.api + 'users/';

  constructor(private http: HttpClient) {
  }

  getHeader() {
    return new HttpHeaders().set('x-access-token', this.token);
  }

  postLogin(usr): Observable<any> {
    return this.http.post(this.domain + 'login', usr);
  }

  getMe(): Observable<any> {
    return this.http.get(this.domain + 'me', {headers: this.getHeader()});
  }

  getAll() {
    return this.http.get(this.domain + 'get-all', {headers: this.getHeader()});
  }

  search(args) {
    return this.http.get(this.domain + 'search', {params: args});
  }

  createOne(data): Observable<any> {
    return this.http.post(this.domain + 'create-user', data, {headers: this.getHeader()});
  }

  bulkAddCSV(formData): Observable<any> {
    return this.http.post(this.domain + 'bulk-users', formData, {headers: this.getHeader()});
  }

  uploadCV(b64): Observable<any> {
    return this.http.post(this.domain + 'cv-upload', {cv: b64}, {headers: this.getHeader()});
  }

  uploadDP(b64): Observable<any> {
    return this.http.post(this.domain + 'dp-upload', {dp: b64}, {headers: this.getHeader()});
  }

  changePassword(oldPass, newPass): Observable<any> {
    return this.http.post(this.domain + 'change-password', {oldPass: oldPass, newPass: newPass},
      {headers: this.getHeader()});
  }

  updatePersonal(usr): Observable<any> {
    return this.http.put(this.domain + 'edit', usr,
      {headers: this.getHeader()});
  }

  editExperience(exp): Observable<any> {
    return this.http.put(this.domain + 'edit-experience', {experience: exp},
      {headers: this.getHeader()});
  }

  editExtra(ext): Observable<any> {
    return this.http.put(this.domain + 'edit-extra', {extra: ext},
      {headers: this.getHeader()});
  }


  editJobStatus(lookingForJob: boolean): Observable<any> {
    return this.http.put(this.domain + 'edit-looking-for-job', {job: lookingForJob},
      {headers: this.getHeader()});
  }

  getPublicPage(userId: string): Observable<any> {
    return this.http.get(this.domain + 'public/' + userId);
  }

  getBase64(file, next) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      next(null, reader.result);
    };
    reader.onerror = function (error) {
      next(error);
    };
  }

  changeJobStates(arr: any[], value): Observable<any> {
    return this.http.put(this.domain + 'edit-jobs', {arr: arr, val: value},
      {headers: this.getHeader()});
  }

  editSpecial(selectedOptions: any) {
    return this.http.put(this.domain + 'edit-special', {special: selectedOptions},
      {headers: this.getHeader()});
  }

  getAdminCount(calculate): Observable<any> {
    return this.http.get(this.domain + 'count',
      {headers: this.getHeader(), params: {calculate: calculate.toString()}});
  }


  createAdmin(newAdmin): Observable<any> {
    return this.http.post(this.domain + 'create-admin', newAdmin, {headers: this.getHeader()});
  }

  getAllAdmins(): Observable<any> {
    return this.http.get(this.domain + 'all-admins', {headers: this.getHeader()});
  }
}

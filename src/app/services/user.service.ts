import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoggedIn = false;
  token = '';
  currentUsr: any;

  domain = environment.api + 'users/';

  constructor(private http: HttpClient) {
  }

  postLogin(usr): Observable<any> {
    return this.http.post(this.domain + 'login', usr);
  }

  getMe(): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.get(this.domain + 'me', {headers: headers});
  }

  createOne(data): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.post(this.domain + 'create-user', data, {headers: headers});
  }

  bulkAddCSV(formData): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.post(this.domain + 'bulk-users', formData, {headers: headers});
  }

  uploadCV(b64): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.post(this.domain + 'cv-upload', {cv: b64}, {headers: headers});
  }

  uploadDP(b64): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.post(this.domain + 'dp-upload', {dp: b64}, {headers: headers});
  }

  changePassword(oldPass, newPass): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.post(this.domain + 'change-password', {oldPass: oldPass, newPass: newPass},
      {headers: headers});
  }

  updatePersonal(usr): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.put(this.domain + 'edit', usr,
      {headers: headers});
  }

  editExperience(exp): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.put(this.domain + 'edit-experience', {experience: exp},
      {headers: headers});
  }

  editExtra(ext): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.token);
    return this.http.put(this.domain + 'edit-extra', {extra: ext},
      {headers: headers});
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
}

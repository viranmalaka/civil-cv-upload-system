import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtherApiService {

  isLoggedIn = false;
  token = '';
  currentUsr: any;

  domain = environment.api + 'other/';

  constructor(private http: HttpClient, private user: UserService) {
  }

  getAllFirm(): Observable<any> {
    return this.http.get(this.domain + 'firm');
  }

  editFirm(oldVal, newVal): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.put(this.domain + 'firm', {oldVal: oldVal, newVal: newVal}, {headers: headers});
  }

  getAllSchools(): Observable<any> {
    return this.http.get(this.domain + 'school');
  }

  editSchool(oldVal, newVal): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.put(this.domain + 'school', {oldVal: oldVal, newVal: newVal}, {headers: headers});
  }

  getAllPosition(): Observable<any> {
    return this.http.get(this.domain + 'position');
  }

  editPosition(oldVal, newVal): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.put(this.domain + 'position', {oldVal: oldVal, newVal: newVal}, {headers: headers});
  }

}

import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BatchApiService {
  isLoggedIn = false;
  token = '';
  currentUsr: any;

  domain = environment.api + 'batch/';

  constructor(private http: HttpClient, private user: UserService) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.domain);
  }

  createNew(btch): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.post(this.domain, btch, {headers: headers});
  }

  editById(id, btch): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.put(this.domain + id, btch, {headers: headers});
  }

  deleteById(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('x-access-token', this.user.token);
    return this.http.delete(this.domain + id, {headers: headers});
  }

}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseURL = 'http://localhost:8090/';

  constructor(private httpClient: HttpClient, private route: Router) {
  }

  save(account: Account): Observable<any> {
    const url = this.baseURL + 'login';
    return this.httpClient.post(url, account);
  }

  changePassword(password: string): Observable<any> {
    const url = this.baseURL + 'change-password';
    return this.httpClient.post(url, password);
  }

  changePhone(phone: string): Observable<any> {
    const url = this.baseURL + 'change-phone';
    return this.httpClient.post(url, phone);
  }

  getAccountsList(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(`${this.baseURL}`);
  }
}

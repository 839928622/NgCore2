import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../models/user';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.baseUrl;
private currentUserSource = new ReplaySubject<IUser>(1);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router,
              private toastr: ToastrService) {
    console.log(this.currentUserSource);
    console.log(this.currentUser$ );
  }
  login(model: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', model).pipe( map( (response: IUser) => {
      if (response) {
        // localStorage.setItem('user', JSON.stringify(response));
        // this.currentUserSource.next(response);
        this.setCurrentUser(response);
        this.toastr.success('you are logged in, welcome', '');
        this.router.navigateByUrl('/members');
      }

    }));
  }

  register(model: any): Observable<void> {
return this.http.post(this.baseUrl + 'account/register', model).pipe(
  map((user: IUser) => {
    if (user){

      this.setCurrentUser(user);

    }
  })
);
  }

  setCurrentUser(user: IUser): void {

    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    this.currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  getDecodedToken(token: string): any
  {
    return JSON.parse(atob(token.split('.')[1]));
  }

 }

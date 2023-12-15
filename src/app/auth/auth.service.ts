import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../shared/models/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CrossStorageClient } from 'cross-storage';
import { UserInformationService } from './user-information.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User | any;
  public lastUrl: string = "/";

  private headers!: Headers;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.getUser();
  }

  public checkSingleSignOn(url: string): Observable<boolean> {
    return new Observable<boolean>((ob) => {
      if (!this.user) {
        var storage = new CrossStorageClient(environment.signOn, {});
        storage.onConnect().then(() => {
          storage.get('de6ee1c350d80711a36682ac397d5d10a7e1f364-auth').then(val => {
            storage.close();
            const user = JSON.parse(val);
            if (user)
              this.verifyTokenPlatform(user).subscribe({
                next: (res: any) => {
                  user.permissions = res.permissions;
                  user.role = res.role;
                  user.email = res.email;
                  user.token = res.token;
                  this.user = new User(user);
                  ob.next(true);
                },
                error: (err: any) => {
                  console.log(err.message);
                }
              });
            else
              ob.next(false);
          });
        }).catch(e => {
          console.log(e.message);
          storage.close();
          ob.next(false);
        });
      } else {
        ob.next(true);
      }
    });
  }

  public isAuthenticated(url: any): Observable<boolean> {
    return new Observable<boolean>(ob => {
      if (url != "/") this.lastUrl = url;
      ob.next(this.user != undefined && this.user?.permissions != undefined);
    });
  }

  verifyTokenPlatform(user: any): Observable<any> {
    let url = environment.apiBase + '/api/central-auth/single-auth/verify';
    return this.http.post(url, {
      token: user.token,
      behaviorString: "string"
    });
  }

  public getUser() {
    try {
      if (!this.user && isPlatformBrowser(this.platformId)) {
        let user = JSON.parse((window as { [key: string]: any })[environment.storage].getItem(`${environment.appName}-auth`));

        if (user)
          this.user = new User(user);
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      return this.user;
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      (window as { [key: string]: any })[environment.storage].removeItem(`${environment.appName}-auth`);
    }
    this.user = undefined;
    window.location.href = `${environment.signOn}/auth/logout`;
  }

}

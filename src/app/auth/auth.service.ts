import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../shared/models/User';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CrossStorageClient } from 'cross-storage';
import { UserInformationService } from './user-information.service';
import { shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private user!: User | any;
  public lastUrl: string = "/";

  private headers!: Headers;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private router: Router) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.getUser();
  }

  // public checkSingleSignOn(url: string): Observable<boolean> {
  //   return new Observable<boolean>((ob) => {
  //     if (!this.user) {
  //       var storage = new CrossStorageClient(environment.signOn, {});
  //       storage.onConnect().then(() => {
  //         storage.get('de6ee1c350d80711a36682ac397d5d10a7e1f364-auth').then(val => {
  //           storage.close();
  //           const user = JSON.parse(val);
  //           if (user)
  //             this.verifyTokenPlatform(user).subscribe({
  //               next: (res: any) => {
  //                 user.permissions = res.permissions;
  //                 user.role = res.role;
  //                 user.email = res.email;
  //                 user.token = res.token;
  //                 this.user = new User(user);
  //                 ob.next(true);
  //               },
  //               error: (err: any) => {
  //                 console.log(err.message);
  //               }
  //             });
  //           else
  //             ob.next(false);
  //         });
  //       }).catch(e => {
  //         console.log(e.message);
  //         storage.close();
  //         ob.next(false);
  //       });
  //     } else {
  //       ob.next(true);
  //     }
  //   });
  // }

  public isAuthenticated(url: any): Observable<boolean> {
    return new Observable<boolean>(ob => {
      if (url != "/") this.lastUrl = url;
      ob.next(this.user != undefined && this.user?.permissions != undefined);
    });
  }

  // verifyTokenPlatform(user: any): Observable<any> {
  //   let url = environment.apiBase + '/api/central-auth/single-auth/verify';
  //   return this.http.post(url, {
  //     token: user.token,
  //     behaviorString: "string"
  //   });
  // }

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

  // logout() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     (window as { [key: string]: any })[environment.storage].removeItem(`${environment.appName}-auth`);
  //   }
  //   this.user = undefined;
  //   window.location.href = `${environment.signOn}/auth/logout`;
  // }

  private baseUrl: string = 'https://localhost:8745/api/user';
  private userPayload:any;

  signUp(userObj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}register`, userObj)
  }

  // signIn(loginObj : any){
  //   return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  // }

  //log in to the system
  login(username:string, password:string){
    let queryParams = new HttpParams();

    queryParams = queryParams.append('username',username);
    queryParams = queryParams.append('password',password);

    return this.httpClient.post<any>(`${this.baseUrl}/login`,{queryParams}).pipe(tap(res => this.setSession(res)),shareReplay());
  }

  //to store token in session
  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }  

  logout(): void {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.Moment | null {
    const expiration = localStorage.getItem("expires_at");
  
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }

    return null;
  }

  // signOut(){
  //   localStorage.clear();
  //   this.router.navigate(['login'])
  // }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }
  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }
  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  // isLoggedIn(): boolean{
  //   return !!localStorage.getItem('token')
  // }

  // decodedToken(){
  //   const jwtHelper = new JwtHelperService();
  //   const token = this.getToken()!;
  //   console.log(jwtHelper.decodeToken(token))
  //   return jwtHelper.decodeToken(token)
  // }

  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  // renewToken(tokenApi : TokenApiModel){
  //   return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  // }
}

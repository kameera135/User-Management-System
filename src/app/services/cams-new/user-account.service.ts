import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PaginatedResponse } from 'src/app/shared/models/Cams-new/PaginatedResponse';
import { User } from 'src/app/shared/models/Cams-new/User';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService) { }

  apiUrl = this.appService.appConfig[0].apiUrl;
  //user = this.appService.user;
  user = this.auth.getUser();

  getUserDetails(userId: string){
    let queryParams = new HttpParams();

    queryParams = queryParams.append("userId", userId);

    const url = `${this.apiUrl}/api/user/userDetails`;
    return this.httpClient.get(url, { params: queryParams });
  }

  putUser(model: User) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }
}

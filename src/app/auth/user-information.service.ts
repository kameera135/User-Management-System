import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppService } from '../app.service';
import { auth } from '../shared/models/Cams-new/auth';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {

  constructor(private appConfigService: AppService, private httpClient: HttpClient) { }

  public basicUserInfo(userID: number, fistName: string, lastName: string, role: string, email: string) {

    //return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl + '', {});
    let baseApi = this.appConfigService.appConfig[0].apiUrl;

    const apiUrl= this.appConfigService.appConfig[0].apiUrl;

    let rqURL: string = `${baseApi}/api/user/basic-user-info?userID=${userID}&firstName=${fistName}&lastName=${lastName}&email=${email}&role=${role}`;

    return this.httpClient.post(rqURL, {});

  }

  public getFreshAsseteTreeObject(userID: number) {

    return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl + '/api/user/' + userID + '/get-assete-tree', {});

  }

  login(model: auth){
    let queryParams = new HttpParams();

    return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl+`/api/user/login`,model,{
      params:queryParams
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { auth } from 'src/app/shared/models/Cams-new/auth';
import { forgotPassword } from 'src/app/shared/models/Cams-new/forgotPassword';
import { resetPassword } from 'src/app/shared/models/Cams-new/resetPassword';
import { AppService } from 'src/app/app.service';
//import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private httpClient: HttpClient, private appConfigService: AppService) { }
    /***
     * Get All User
     */
    /*getAll() {
        return this.http.get<User[]>(`api/users`);
    }*/

    /***
     * Facked User Register
     */
    /*register(user: User) {
        return this.http.post(`/users/register`, user);
    }*/

    login(model: auth){
        let queryParams = new HttpParams();
    
        return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl+`/api/user/login`,model,{
          params:queryParams
        });
    }
    
    forgotPassword(model: forgotPassword){
        let queryParams = new HttpParams();

        return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl+`/api/user/ForgotPassword`,model,{
            params:queryParams
        });
    }
    
    resetPassword(model: resetPassword){
        let queryParams = new HttpParams();

        return this.httpClient.post(this.appConfigService.appConfig[0].apiUrl+`/api/user/ResetPassword`,model,{
            params:queryParams
        });
    }
}

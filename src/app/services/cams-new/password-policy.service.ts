import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class PasswordPolicyService {
  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  //user = this.appService.user;
  user = this.auth.getUser();

  getPasswordPolicy(): Observable<any> {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);

    const url = `${this.apiUrl}/api/common/settings/system-data/UMS_PP`;
    return this.httpClient.get<any>(url);
  }

  putPasswordPolicy(setting: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("passwordPolicy", setting);
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(
      `${this.apiUrl}/api/password-policy`,
      {},
      {
        params: queryParams,
      }
    );
  }
}

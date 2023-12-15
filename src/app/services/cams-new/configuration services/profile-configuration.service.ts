import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppService } from "src/app/app.service";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProfileConfigurationService {
  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  baseUrl = this.appService.appConfig[0].apiUrl;
  apiUrl: string = this.baseUrl + "/api/profile-configuration/";

  apiUrlService: string = this.baseUrl + "/api/common/tbs/services-of-unit/";
}

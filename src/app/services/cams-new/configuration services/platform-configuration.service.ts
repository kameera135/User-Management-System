import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { PlatformConfigurationComponent } from "src/app/pages/modules/tbs/platform-configuration/platform-configuration.component";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class PlatformConfigurationService {
  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  baseUrl = this.appService.appConfig[0].apiUrl;

  apiUrl: string = this.baseUrl + "/api/platform-configuration/";

  apiUrlService: string = this.baseUrl + "/api/common/tbs/services-of-unit/";
}

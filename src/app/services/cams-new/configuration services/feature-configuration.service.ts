import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class FeatureConfigurationService {
  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  baseUrl = this.appService.appConfig[0].apiUrl;

  apiUrl = this.baseUrl + "/api/feature-configuration/";
}

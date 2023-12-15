import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";
import { Meter } from "src/app/shared/models/Tbs/meter";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";

@Injectable({
  providedIn: "root",
})
export class UsersViewService {
  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  baseUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user.id;
}

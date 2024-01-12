import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { PlatformConfigurationComponent } from "src/app/pages/modules/cams-new/platform-configuration/platform-configuration.component";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { Platform } from "src/app/shared/models/Cams-new/Platform";

@Injectable({
  providedIn: "root",
})
export class PlatformConfigurationService {
  constructor(private appService: AppService, private httpClient: HttpClient) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getAllPlatforms(page: number, page_size: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);

    const url = `${this.apiUrl}/api/configuration/platforms/${page}/${page_size}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  // getPlatformsByRole(role: string, page: number, pageSize: number) {
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("viewedBy", this.user.id);
  //   queryParams = queryParams.append("role", role);
  //   queryParams = queryParams.append("page", page);
  //   queryParams = queryParams.append("pageSize", pageSize);

  //   const url = `${this.apiUrl}/end-point`;
  //   return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  // }

  // getSearchedPlatforms(searchedTerm: string, page: number, pageSize: number) {
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("viewedBy", this.user.id);
  //   queryParams = queryParams.append("searchedTerm", searchedTerm);
  //   queryParams = queryParams.append("page", page);
  //   queryParams = queryParams.append("pageSize", pageSize);

  //   const url = `${this.apiUrl}/end-point`;
  //   return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  // }

  getSearchedPlatforms(searchedTerm: string, page: number, page_size: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("searchedPlatformName", searchedTerm);

    const url = `${this.apiUrl}/api/configuration/platforms/${page}/${page_size}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  postPlatform(model: Platform) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/platform`, model, {
      params: queryParams,
    });
  }

  putPlatform(model: Platform) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  deletePlatform(list: number[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }

  activatePlatform(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("activatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }

  deactivatePlatform(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deactivatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }
}

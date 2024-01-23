import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { PlatformRole } from "src/app/shared/models/Cams-new/PlatformRole";
import { User } from "src/app/shared/models/Cams-new/User";
import { UserRoleBulk } from "src/app/shared/models/Cams-new/UserRoleBulk";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersViewService {
  constructor(private appService: AppService, private httpClient: HttpClient) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getAllUsers(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", 0);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getUsersByPlatform(platformId: number, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsers(searchedTerm: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", 0);
    queryParams = queryParams.append("userName", searchedTerm);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsersByPlatform(
    searchedTerm: string,
    platformId: number,
    page: number,
    pageSize: number
  ) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("userName", searchedTerm);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  postUser(model: User) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }

  postBulkUsers(model: UserRoleBulk) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/users/bulk`, model, {
      params: queryParams,
    });
  }

  putUser(model: User) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }

  deleteUser(list: number[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user.id);

    return this.httpClient.delete(`${this.apiUrl}/api/users`, {
      params: queryParams,
      body: list,
    });
  }

  getRolesAndPlatforms(userId: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("userId", userId);

    const url = `${this.apiUrl}/api/user/platforms_and_roles`;
    return this.httpClient.get<PlatformRole[]>(url, { params: queryParams });
  }

  getPlatformList() {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);

    const url = `${this.apiUrl}/api/configuration/platforms/combobox`;
    return this.httpClient.get(url, { params: queryParams });
  }
}

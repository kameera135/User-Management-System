import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { ActivityLogData } from "src/app/shared/models/Cams-new/ActivityLogData";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";

@Injectable({
  providedIn: "root",
})
export class ActivityLogsService {
  constructor(private appService: AppService, private httpClient: HttpClient) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getPlatformList() {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);

    const url = `${this.apiUrl}/api/configuration/platforms/combobox`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getRoleList(platformId: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);

    const url = `${this.apiUrl}/api/configuration/roles/combobox/${platformId}`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getActivityLogs(
    year: string,
    month: string,
    page: number,
    pageSize: number,
    platformId: number,
    roleId: number
  ) {
    let queryParams = new HttpParams();
    // queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("roleId", roleId);

    const url = `${this.apiUrl}/api/activity_logs/${year}/${month}/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getUsersByRole(role: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("role", role);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/end-point`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsers(searchedTerm: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("searchedTerm", searchedTerm);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/end-point`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsersByRole(
    searchedTerm: string,
    role: string,
    page: number,
    pageSize: number
  ) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("searchedTerm", searchedTerm);
    queryParams = queryParams.append("role", role);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/end-point`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  postUser(model: ActivityLogData) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  putUser(model: ActivityLogData) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  deleteUser(list: number[]) {
    //list is the id list of users which have to be deleted
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }
}

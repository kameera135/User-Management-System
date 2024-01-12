import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppService } from "src/app/app.service";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { Role } from "src/app/shared/models/Cams-new/Role";

@Injectable({
  providedIn: "root",
})  
export class RoleConfigurationService {
  constructor(private appService: AppService, private httpClient: HttpClient) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getAllRoles(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/api/configuration/roles/${page}/${pageSize}`;
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

  getSearchedRoles(searchedTerm: string, page: number, pageSize: number) {
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

  postRole(model: Role) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  putRole(model: Role) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  deleteRoles(list: number[]) {
    //list is the id list of users which have to be deleted
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }

  activateRoles(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("activatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }

  deactivateRoles(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deactivatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }
}

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
  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  //user = this.appService.user;
  user = this.auth.getUser();

  getAllRoles(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/api/configuration/roles/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getUsersByPlatform(platformId: number, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/configuration/roles/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedRoles(searchedTerm: string, page: number, page_size: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("searchedRoleName", searchedTerm);

    const url = `${this.apiUrl}/api/configuration/roles/${page}/${page_size}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedRolesByPlatform(
    searchedTerm: string,
    platformId: number,
    page: number,
    pageSize: number
  ) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("searchedRoleName", searchedTerm);

    const url = `${this.apiUrl}/api/configuration/roles/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  postRole(model: Role) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user?.id);

    return this.httpClient.post(
      `${this.apiUrl}/api/configuration/role`,
      model,
      {
        params: queryParams,
      }
    );
  }

  putRole(model: Role) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(
      `${this.apiUrl}/api/configuration/role`,
      model,
      {
        params: queryParams,
      }
    );
  }

  deleteRoles(list: number[]) {
    //list is the id list of users which have to be deleted
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user?.id);

    return this.httpClient.delete(
      `${this.apiUrl}/api/configuration/roles`,
      {
        params: queryParams,
        body: list,
      }
    );
  }

  activateRoles(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(`${this.apiUrl}/api/configuration/roles/activate`, list, {
      params: queryParams,
    });
  }

  deactivateRoles(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(`${this.apiUrl}/api/configuration/roles/deactivate`, list, {
      params: queryParams,
    });
  }

  getPlatformList() {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);

    const url = `${this.apiUrl}/api/configuration/platforms/combobox`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getPermissionsForRoles(roleId: number, platformId: number){

    let queryParams = new HttpParams();
    queryParams = queryParams.append("roleId",roleId);
    queryParams = queryParams.append("platformId",platformId);

    const url = `${this.apiUrl}/api/configuration/roles/platform-permission/${roleId}/${platformId}`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getPermissionsNotInRole(platformId: number, roleId: number){

    let queryParams = new HttpParams();
    queryParams = queryParams.append("roleId",roleId);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/configuration/permissions/platform/not_in_role`;
    return this.httpClient.get(url, { params: queryParams });
  }

  assignPermissionsToRole(roleId: number, list: number[]){

    let queryParams = new HttpParams();

    const requestBody = {
      roleId: roleId,
      permissionIds: list
    }

    queryParams = queryParams.append("createdBy", this.user?.id);

    return this.httpClient.post(`${this.apiUrl}/api/configuration/permissions/role`,requestBody,
    {
      params: queryParams,
    });
  }
  
  unassignPermissionsFromRole(roleId: number, list: number[]){

    let queryParams = new HttpParams();

    const requestBody = {
      roleId: roleId,
      permissionIds: list
    }

    queryParams = queryParams.append("deletedBy", this.user?.id);

    return this.httpClient.delete(`${this.apiUrl}/api/configuration/permissions/role/unassign`,
    {
      params: queryParams,
      body: requestBody
    });
  }
}

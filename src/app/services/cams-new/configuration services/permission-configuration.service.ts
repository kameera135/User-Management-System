import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { AuthService } from "src/app/auth/auth.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { Permission } from "src/app/shared/models/Cams-new/Permission";

@Injectable({
  providedIn: "root",
})
export class PermissionConfigurationService {
  constructor(private appService: AppService, private httpClient: HttpClient, private auth: AuthService) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  //user = this.appService.user;
  user = this.auth.getUser();

  getAllPermissions(page: number, pageSize: number, platformId: number) {
    let queryParams = new HttpParams();
    //ueryParams = queryParams.append("viewedBy", this.user?.id);
    // queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/configuration/permissions/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  // getPermissionsByRole(role: string, page: number, pageSize: number) {
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("viewedBy", this.user?.id);
  //   queryParams = queryParams.append("role", role);
  //   queryParams = queryParams.append("page", page);
  //   queryParams = queryParams.append("pageSize", pageSize);

  //   const url = `${this.apiUrl}/end-point`;
  //   return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  // }

  // getSearchedPermissions(searchedTerm: string, page: number, pageSize: number) {
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("viewedBy", this.user?.id);
  //   queryParams = queryParams.append("searchedTerm", searchedTerm);
  //   queryParams = queryParams.append("page", page);
  //   queryParams = queryParams.append("pageSize", pageSize);

  //   const url = `${this.apiUrl}/end-point`;
  //   return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  // }

  getSearchedPermissions(
    searchedTerm: string,
    page: number,
    page_size: number,
    platformId: number
  ) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("searchedPermissionName", searchedTerm);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/configuration/permissions/${page}/${page_size}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  // getSearchelPermissionsByRole(
  //   searchedTerm: string,
  //   role: string,
  //   page: number,
  //   pageSize: number
  // ) {
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("viewedBy", this.user?.id);
  //   queryParams = queryParams.append("searchedTerm", searchedTerm);
  //   queryParams = queryParams.append("role", role);
  //   queryParams = queryParams.append("page", page);
  //   queryParams = queryParams.append("pageSize", pageSize);

  //   const url = `${this.apiUrl}/end-point`;
  //   return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  // }

  postPermission(model: Permission) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user?.id);

    return this.httpClient.post(
      `${this.apiUrl}/api/configuration/permission`,
      model,
      {
        params: queryParams,
      }
    );
  }

  putPermission(model: Permission) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(
      `${this.apiUrl}/api/configuration/permission`,
      model,
      {
        params: queryParams,
      }
    );
  }

  deletePermission(list: number[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user?.id);

    return this.httpClient.delete(
      `${this.apiUrl}/api/configuration/permissions`,
      {
        params: queryParams,
        body: list,
      }
    );
  }

  activatePermissions(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(
      `${this.apiUrl}/api/configuration/permissions/activate`,
      list,
      {
        params: queryParams,
      }
    );
  }

  deactivatePermissions(list: any[]) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user?.id);

    return this.httpClient.put(
      `${this.apiUrl}/api/configuration/permissions/deactivate`,
      list,
      {
        params: queryParams,
      }
    );
  }

  getRolesAndPlatforms(permissionId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("permissionId", permissionId);

    const url = `${this.apiUrl}/api/configuration/permission/platforms-roles`;
    return this.httpClient.get(url, { params: queryParams });
  }
}

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppService } from "src/app/app.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { PlatformUser } from "src/app/shared/models/Cams-new/platform-user";

@Injectable({
  providedIn: "root",
})
export class PlatformUsersService {

  private userDataAssignedSource = new Subject<void>();

  constructor(private appService: AppService, private httpClient: HttpClient) {}

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getAllPlatformUsers(platformId: number,page: number, page_size: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", page_size);

    const url = `${this.apiUrl}/api/configuration/platforms/users/${page}/${page_size}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getAllUsers(platformId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("platformId", platformId);
    // queryParams = queryParams.append("page", page);
    // queryParams = queryParams.append("pageSize", page_size);

    const url = `${this.apiUrl}/api/users/platform/un-assigned`;
    //const url = `http://127.0.0.1:3000/api/user/platform`
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }


  getAllPlatformUsersRoles(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/api/user/platform/role`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  // 
  
  getSearchedUsers(platformId: number,searchedTerm: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("userName", searchedTerm);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUnassignUsers(searchedTerm: string, platformId: number) {
    let queryParams = new HttpParams();

    queryParams = queryParams.append('platforomId',platformId);
    queryParams = queryParams.append('searchedUserName', searchedTerm);

    const url = `${this.apiUrl}/api/users/platform/un-assigned`;
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

  postUser(model: PlatformUser) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/end-point`, model, {
      params: queryParams,
    });
  }

  putUser(model: PlatformUser) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("updatedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, model, {
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

  assignUsers(platformId: number, list: number[]){
    let queryParams = new HttpParams();

    const requestBody = {
      platformId: platformId,
      userIds: list
    }

    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/configuration/platform/assign_users`,requestBody,
    {
      params: queryParams,
    });
  }

  unassignUsers(platformId: number, list: number[]){
    let queryParams = new HttpParams();

    const requestBody = {
      platformId: platformId,
      userIds: list
    }

    queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.delete(`${this.apiUrl}/api/configuration/platforms/users/unassign_users`,
    {
      params: queryParams,
      body: requestBody
    });
  }

  getPlatformUserRoles(userId: number, platformId:number){
    let queryParams = new HttpParams();

    queryParams = queryParams.append( "userId" , userId );
    queryParams = queryParams.append( "platformId" , platformId );

    const url = `${this.apiUrl}/api/configuration/roles/platforms/users`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getUserRolesPermissions(userId: number, platformId: number){

    let queryParams = new HttpParams();
    queryParams = queryParams.append( "userId" , userId );
    queryParams = queryParams.append( "platformId" , platformId );

    const url = `${this.apiUrl}/api/users/roles_and_permissions`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getRolesNotAssignUsers(userId: number, platformId: number){
    
    let queryParams = new HttpParams();
    queryParams = queryParams.append('userId', userId);
    queryParams = queryParams.append('platformId',platformId);

    const url = `${this.apiUrl}/api/configuration/roles/platform/not_for_users`;
    return this.httpClient.get(url, { params: queryParams });
  }


  //For call loadData() function in platformUserModalComponent
  userDataAssigned$ = this.userDataAssignedSource.asObservable();

  announceUserDataAssigned() {
    this.userDataAssignedSource.next();
  }

  assigRoleToUser(userId: number, list: number[]){
    let queryParams = new HttpParams();

    const requestBody = {
      userId: userId,
      roleIds: list
    }

    queryParams = queryParams.append("createdBy",this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/user/roles`,requestBody,
    {
      params: queryParams,
    });
  }

  unassignRoleFromUser(userId:number,roleId:number) {
    let queryParams = new HttpParams();

    queryParams = queryParams.append("userId", userId);
    queryParams = queryParams.append("roleId",roleId);
    queryParams = queryParams.append("deletedBy",this.user.id);

    const url = `${this.apiUrl}/api/user/roles`;
    return this.httpClient.delete(url, {params :queryParams});
  }
}

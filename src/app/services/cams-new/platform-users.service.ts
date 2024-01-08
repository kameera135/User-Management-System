import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { PaginatedResponse } from 'src/app/shared/models/Cams-new/PaginatedResponse';
import { PlatformUser } from 'src/app/shared/models/Cams-new/platform-user';

@Injectable({
  providedIn: 'root'
})
export class PlatformUsersService {

  constructor(private appService: AppService, private httpClient: HttpClient) { }

  apiUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user;

  getAllPlatformUsers(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/api/user/platform`;
    //const url = `https://6e8a56b690f74a619f86ce09f1bd46eb.api.mockbin.io/`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getAllPlatformUsersRoles(page: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);

    const url = `${this.apiUrl}/api/user/platform/role`;
    //const url = `https://6e8a56b690f74a619f86ce09f1bd46eb.api.mockbin.io/`;
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
    //list is the id list of users which have to be deleted
    let queryParams = new HttpParams();
    queryParams = queryParams.append("deletedBy", this.user.id);

    return this.httpClient.put(`${this.apiUrl}/end-point`, list, {
      params: queryParams,
    });
  }

}

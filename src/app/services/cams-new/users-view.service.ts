import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import { PaginatedResponse } from "src/app/shared/models/Cams-new/PaginatedResponse";
import { User } from "src/app/shared/models/Cams-new/User";
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
    queryParams = queryParams.append("platformId", "All");

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getUsersByPlatform(platformId: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsers(searchedTerm: string, page: number, pageSize: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", "All");
    queryParams = queryParams.append("userName", searchedTerm);

    const url = `${this.apiUrl}/api/users/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  getSearchedUsersByPlatform(
    searchedTerm: string,
    platformId: string,
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
    //queryParams = queryParams.append("createdBy", this.user.id);

    return this.httpClient.post(`${this.apiUrl}/api/user`, model, {
      params: queryParams,
    });
  }

  putUser(model: User) {
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

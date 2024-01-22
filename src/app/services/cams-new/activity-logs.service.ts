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
    page: number,
    pageSize: number,
    platformId: number,
    roleId: number,
    firstDate: Date,
    lastDate: Date
  ) {
    let queryParams = new HttpParams();
    // queryParams = queryParams.append("viewedBy", this.user.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("roleId", roleId);
    queryParams = queryParams.append(
      "firstDateString",
      firstDate.toISOString()
    );
    queryParams = queryParams.append("lastDateString", lastDate.toISOString());

    // const url = `${this.apiUrl}/api/activity_logs/${year}/${month}/${page}/${pageSize}`;
    const url = `${this.apiUrl}/api/activity_logs/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }
}

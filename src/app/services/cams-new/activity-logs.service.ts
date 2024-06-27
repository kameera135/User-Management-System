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

  getUserList() {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);

    const url = `${this.apiUrl}/api/users/combobox`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getPlatformList() {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);

    const url = `${this.apiUrl}/api/configuration/platforms/combobox`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getRoleList(platformId: number) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("viewedBy", this.user?.id);

    const url = `${this.apiUrl}/api/configuration/roles/combobox/${platformId}`;
    return this.httpClient.get(url, { params: queryParams });
  }

  getActivityLogs(
    page: number,
    pageSize: number,
    platformId: number,
    roleId: number,
    firstDate: Date,
    lastDate: Date,
    userId: number
  ) {
    let queryParams = new HttpParams();
    // queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("roleId", roleId);
    queryParams = queryParams.append("userId", userId);
    queryParams = queryParams.append(
      "firstDateString",
      this.convertToStartOfDay(firstDate.toISOString())
    );
    queryParams = queryParams.append(
      "lastDateString",
      this.convertToStartOfDay(lastDate.toISOString(),true)
    );

    // const url = `${this.apiUrl}/api/activity_logs/${year}/${month}/${page}/${pageSize}`;
    const url = `${this.apiUrl}/api/activity_logs/${page}/${pageSize}`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }

  convertToStartOfDay(dateTimeString: string, addOneDay: boolean = false): string {
    const date = new Date(dateTimeString);
    
    // Get the local timezone offset in minutes
    const timezoneOffset = date.getTimezoneOffset();
    
    // Set the time to 00:00:00 in local time
    date.setHours(0, 0, 0, 0);

    if (addOneDay) {
      date.setDate(date.getDate() + 1);
    }
    
    // Adjust for the timezone offset to get the correct start of the day in UTC
    date.setMinutes(date.getMinutes() - timezoneOffset);
    
    return date.toISOString();
  }

  //For export all activity logs data
  exportAll(
    platformId: number,
    roleId: number,
    firstDate: Date,
    lastDate: Date,
    userId: number
  ) {
    let queryParams = new HttpParams();
    // queryParams = queryParams.append("viewedBy", this.user?.id);
    queryParams = queryParams.append("platformId", platformId);
    queryParams = queryParams.append("roleId", roleId);
    queryParams = queryParams.append("userId", userId);
    queryParams = queryParams.append(
      "firstDateString",
      this.convertToStartOfDay(firstDate.toISOString())
    );
    queryParams = queryParams.append(
      "lastDateString",
      this.convertToStartOfDay(lastDate.toISOString(),true)
    );

    // const url = `${this.apiUrl}/api/activity_logs/${year}/${month}/${page}/${pageSize}`;
    const url = `${this.apiUrl}/api/activity_logs/exportAll`;
    return this.httpClient.get<PaginatedResponse>(url, { params: queryParams });
  }
  
}

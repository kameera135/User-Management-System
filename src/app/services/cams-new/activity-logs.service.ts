import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ActivityLogsService {
  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  baseUrl = this.appService.appConfig[0].apiUrl;
  user = this.appService.user.id;

  getAcknowledgeAlert(): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userID", this.user);

    return this.httpClient.get(`${this.baseUrl}/api/activity-logss/Ack-Alert`, {
      params: queryParams,
    });
  }
}

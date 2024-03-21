import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AssertTreeNode } from 'src/app/shared/models/assertTreeModel';

@Injectable({
  providedIn: 'root'
})
export class AssertTreeService {

  constructor(
    private appService: AppService,
    private httpClient: HttpClient) { }

  baseUrl = this.appService.appConfig[0].apiUrl
  //user = this.appService.user.id

  getAssertTree() {
    return this.httpClient.get<AssertTreeNode>(`${this.baseUrl}/api/common/location-map/units/000`)
  }
}

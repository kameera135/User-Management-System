import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'azbil';


  constructor(private http: HttpClient) {

  }

  @HostListener("window:beforeunload", ["$event"])
  clearLocalStorage(event: any) {
    localStorage.clear();
  }
}

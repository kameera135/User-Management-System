import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'azbil';

  constructor(private http: HttpClient, private router: Router) 
  {
    window.onbeforeunload = function (e) {
      window.onunload = function () {
              window.localStorage.getItem;
      }
      return undefined;
  };
  
  window.onload = function () {
              window.localStorage.clear;
  };
  }
}

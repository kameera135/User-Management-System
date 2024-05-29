import { Component, OnInit, EventEmitter, Output, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from '../../core/services/event.service';

//Logout
import { environment } from '../../../environments/environment';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';

import { AppService } from 'src/app/app.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { Route, Router } from '@angular/router';
import { UserAccountService } from 'src/app/services/cams-new/user-account.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeProfilePicModalComponent } from 'src/app/shared/widget/config/change-profile-pic-modal/change-profile-pic-modal.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  moduleColor: string = this.app.appConfig[0].moduleNameColor;

  userData: any;
  current_theme = this.getCookie('aes-app-theme');

  imageUrl!: string;

  tempuser= this.auth.getUser();
  private sessionToken : string | any = localStorage.getItem('sessionId');

  module: string = "moduleName";
  organization: string = "company_name";


  constructor(@Inject(DOCUMENT) private document: any, private eventService: EventService, public languageService: LanguageService,
    public _cookiesService: CookieService, 
    private app: AppService,
    private auth: AuthService,
    private titleService: Title,
    private router: Router,
    private shared: UserAccountService,
    private http: HttpClient,
    private modalService: NgbModal,
    
  ) { }

  ngOnInit(): void {
    this.changeMode(this.current_theme);
    this.element = document.documentElement;
    this.module = this.app.appConfig[0].moduleName;
    this.organization = this.app.appConfig[0].nameOfOrganization;
    this.titleService.setTitle(this.organization + ' | ' + this.module);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * This function sets a cookie with a given name, value, and expiration date.
   * @param {string} cookieName - A string representing the name of the cookie to be set.
   * @param {string} cookieValue - The value to be stored in the cookie.
   * @param {number} expiryDays - The number of days until the cookie expires and is no longer valid.
   */
  setCookie(cookieName: string, cookieValue: string, expiryDays: number) {
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    var cookieValueEncoded = encodeURIComponent(cookieValue);
    var cookieString = cookieName + "=" + cookieValueEncoded + "; expires=" + expiryDate.toUTCString() + "; path=/";

    document.cookie = cookieString;
  }

  /**
   * This function retrieves the value of a cookie by its name.
   * @param {string} cookieName - a string representing the name of the cookie to retrieve.
   * @returns the value of the cookie with the specified name. If the cookie is not found, an empty
   * string is returned.
   */
  getCookie(cookieName: string) {
    var cookieValue = "light";
    var cookieArray = document.cookie.split(";");

    for (var i = 0; i < cookieArray.length; i++) {
      var cookiePair = cookieArray[i].split("=");
      var name = cookiePair[0].trim();

      if (name === cookieName) {
        cookieValue = decodeURIComponent(cookiePair[1]);
        break;
      }
    }

    return cookieValue;
  }


  //Navigate to user account
  navigateToUserAccount() {
    this.router.navigate(['/user-account']);
  }


  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);
    switch (mode) {
      case 'light':
        document.body.setAttribute('data-layout-mode', "light");
        document.body.setAttribute('data-sidebar', "light");
        this.setCookie("aes-app-theme", "light", 90);
        break;
      case 'dark':
        document.body.setAttribute('data-layout-mode', "dark");
        document.body.setAttribute('data-sidebar', "dark");
        this.setCookie("aes-app-theme", "dark", 90);
        break;
      default:
        document.body.setAttribute('data-layout-mode', "light");
        this.setCookie("aes-app-theme", "light", 90);
        break;
    }
  }

  /**
   * Logout the user
   */
  logout() {

    this.shared.deleteSessionToken(this.tempuser?.id, this.sessionToken).subscribe({
      next: (response) =>{
        console.log(response);
      },
      error:(error)=>{
        alert("Error while logging out!");
      }
    })

    this.auth.logout();
  }

  get manageProfileUrl() {
    return environment.signOn + "/account/profile";
  }

  // get role() {
  //   return this.app.user?.roles.replace("_", " ");
  // }

  get user() {
    return this.app.user?.fName;
  }

  // get profileImage() {
  //   let image = this.app.user?.profileImage;
  //   image = image.replace("localhost", this.app.appConfig[0].camsBackEnd);
  //   console.log(image);
  //   debugger;
  //   if (image == 'http://54.199.228.15:85/' || image == null || image == undefined || image == "") {
  //     return "assets/images/user.png";
  //   }
  //   return image;

  //   return "assets/images/user.png";
  // }

  //add the profile image
  get profileImage(){

    const fullName = this.app.user?.fullName || 'John Doe'

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;
  }

  changeImage(row:any){

    const modalRef = this.modalService.open(ChangeProfilePicModalComponent,{
      size: "l",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.componentInstance.type = "profile";
    modalRef.componentInstance.modalType = "Update Profile Picture";

    
  }

  windowScroll() {
    const body = document.body;
    const documentElement = document.documentElement;
  
    if (body && documentElement) {
      if (body.scrollTop > 100 || documentElement.scrollTop > 100) {
        const backToTopElement = document.getElementById("back-to-top") as HTMLElement;
        if (backToTopElement) {
          backToTopElement.style.display = "block";
        }
  
        const pageTopbarElement = document.getElementById('page-topbar');
        if (pageTopbarElement) {
          pageTopbarElement.classList.add('topbar-shadow');
        }
      } else {
        const backToTopElement = document.getElementById("back-to-top") as HTMLElement;
        if (backToTopElement) {
          backToTopElement.style.display = "none";
        }
  
        const pageTopbarElement = document.getElementById('page-topbar');
        if (pageTopbarElement) {
          pageTopbarElement.classList.remove('topbar-shadow');
        }
      }
    }
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserInformationService } from '../user-information.service';
// import { AsseteTreeService } from 'src/app/services/Modules/aes/assete-tree.service';
// import { MapperService } from 'src/app/services/Modules/aes/mapper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  error!: string;
  loading!: boolean;
  submitted!: boolean;

  isDarkMode: boolean = true;

  constructor(
    private auth: AuthService, private router: Router,
    private actRoute: ActivatedRoute,
    // private asseteTreeService: AsseteTreeService,
    // private mapper: MapperService,
    private userInforService: UserInformationService) { }

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

  ngOnInit(): void {

    this.loading = true;
    this.auth.checkSingleSignOn('/').subscribe(res => {
      if (res) {

        let loggedUser = this.auth.getUser();

        this.router.navigate([this.auth.lastUrl]);
        // this.userInforService.basicUserInfo(loggedUser.id, loggedUser.fName, loggedUser.lName, loggedUser.role, loggedUser.email).subscribe({

        //   next: (response: any) => {

        //     if (response != null) {

        //       const configurations = JSON.parse(JSON.stringify(response));

        //       this.asseteTreeService.setTree(configurations.lstAsseteTree);

        //       this.mapper.setApprovalRequirements(configurations.fmApprovalRequired, configurations.tmApprovalRequired);

        //       this.router.navigate([this.auth.lastUrl]);

        //     }

        //   },
        //   error: (error: any) => { },
        //   complete() { }
        // });

      }
      else {
        this.loading = false;
        window.location.href = environment.signOn;
      }
    });

    this.isDarkMode = this.getCookie('aes-app-theme') == 'dark' ? true : false;

  }


}

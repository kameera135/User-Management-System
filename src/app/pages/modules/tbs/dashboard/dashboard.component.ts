import { ApplicationConfig, Component, HostListener } from "@angular/core";
import { error } from "console";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { MenuService } from "src/app/services/menu.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { UserAccountService } from "src/app/services/cams-new/user-account.service";
import { Observable, catchError, map, of, tap } from "rxjs";
import { STATUS_CODES } from "http";
import { split } from "lodash";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  loadingInProgress: boolean = false;

  hasAlert: boolean = false;
  showAddTile: boolean = true;

  menuItems: any[] = [];

  sessionId = localStorage.getItem("sessionId");
  user = this.auth.getUser();
  //platformList = this.appConfigService.appConfig[0].platformList; // Replace with your service method to get platform list


  generatePlatformMenuItems(): any[] {

    if (!this.user || !this.user.platforms) {
      // Return an empty array or handle the case when user or platforms is undefined
      return [];
    }
    
    const platformList: { label: string; path: string; description: string; }[] = [];
    const uniquePlatforms = new Set(); // Set to keep track of unique platforms
    
    // Function to add platform details to the platform list
    const addPlatform = (platform: string | { platformId: string; platformName: string; platformURL: string }) => {
      let platformId, platformName, platformURL;
      if (typeof platform === 'string') {
        [platformId,platformName, platformURL] = platform.split(" || ");
      } else {
        platformId = platform.platformId;
        platformName = platform.platformName;
        platformURL = platform.platformURL;
      }
      if (platformName && platformURL && !uniquePlatforms.has(platformName)) {
        uniquePlatforms.add(platformName);
        platformList.push({
          label: platformName,
          path: `${platformURL}login?session=${this.sessionId}&platformId=${platformId}`,
          description: `Navigate to ${platformName} dashboard`,
        });
      }
    };
    
    if (Array.isArray(this.user.platforms)) {
      // Handle case when platforms is an array
      this.user.platforms.forEach(addPlatform);
    } else if (typeof this.user.platforms === 'string') {
      // Handle case when platforms is a string
      addPlatform(this.user.platforms);
    }
    
    return platformList.map(platform => ({ subItems: [platform] }));
  }

  menus: any = [
    {
      subItems: [
        {
          label: "My Profile",
          path: "/user-account",
          description: "View My Account",
        },
      ],
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private sideMenuService: MenuService,
    private ActivityLogsService: ActivityLogsService,
    private appConfigService: AppService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private shared: UserAccountService
  ) {}

  ngOnInit(): void {
    //const loginUser = this.route.snapshot.queryParams["user"];
    const platformId = this.route.snapshot.queryParams["platform"];

    if(this.sessionId){
      this.shared.validateSessionTokenFromUrl(this.sessionId,this.user?.id).pipe(
        map((response: any)=> response.statusCode === 200),
        tap((isvalid: boolean)=>{
          if(!isvalid){
            localStorage.clear();
            this.router.navigate(["/login"]);
          }
          else if(platformId){
            const platform = this.user?.platforms.find(
              (item) => item.split('||')[0].trim() == platformId);

            const platformName = this.user?.platforms.find(
              (item) => item.split('||')[1].trim());

            if (platform) {
              const dashboardUrl = `${platformName}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
              this.router.navigateByUrl(dashboardUrl);
              this.initializedashboard();
              } else {
                alert("Platform not found from the Id");
                this.router.navigate(["/login"]);
              }
          }
          else{
            this.initializedashboard();
          }
        })
      );
    }
    else{
      localStorage.clear();
      this.router.navigate(["/login"]);
    }

    this.initializedashboard();

    // if (loginUser) {
    //   if (loginUser == this.user?.id) {
    //     const platform = this.platformList.find(
    //       (item) => item.id == platformId
    //     );

    //     //check the platform with user ID in JWT
    //     if (platform) {
    //       const dashboardUrl = `${platform.Url}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
    //       this.router.navigateByUrl(dashboardUrl);
    //       this.initializedashboard();
    //     } else {
    //       alert("Platform not found from the Id");
    //       this.router.navigate(["/login"]);
    //     }
    //   } else {
    //     alert("Invalid User ID");
    //   }

    //   // if (this.validateUserId(loginUser, this.sessionId)) {
    //   //   const platform = this.platformList.find(
    //   //     (item) => item.id == platformId
    //   //   );

    //   //   if (platform) {
    //   //     const dashboardUrl = `${platform.Url}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
    //   //     this.router.navigateByUrl(dashboardUrl);
    //   //     this.initializedashboard();
    //   //   } else {
    //   //     alert("Platform not found from the Id");
    //   //     this.router.navigate(["/login"]);
    //   //   }
    //   // } else {
    //   //   alert("Invalid User ID");
    //   // }
    // } else {
    //   this.initializedashboard();
    // }
  }

  validateUserId(userId: any, sessionId: any): Observable<boolean> {
    return this.shared.validateSessionTokenFromUrl(sessionId, userId).pipe(
      map((response) => {
        return (
          response && response.valueOf() === 200 && userId == this.user?.id
        );
      }),
      catchError((error) => {
        // Handle error or invalid session
        this.router.navigate(["/login"]); // Redirect to login page
        return of(false);
      })
    );
  }

  initializedashboard() {
    this.menuItems = [...this.menus, ...this.generatePlatformMenuItems()];

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Dashboard", active: true },
    ]);
  }
}

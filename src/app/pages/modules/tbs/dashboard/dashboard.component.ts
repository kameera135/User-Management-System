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

  platformList = this.user?.UserDetails.filter(item => item.PlatformURL && item.PlatformName);

  generatePlatformMenuItems(): any[] {

    if (!this.user || !this.user.UserDetails) {
      // Return an empty array or handle the case when user or UserDetails is undefined
      return [];
    }

    const uniquePlatforms = new Set(); // Set to keep track of unique PlatformIDs
    const platformList: { label: string; path: string; description: string; }[] = [];

    this.user.UserDetails.forEach(item => {
      if (Array.isArray(item)) {
        item.forEach(nestedItem => {
          if (nestedItem.PlatformURL && nestedItem.PlatformName && !uniquePlatforms.has(nestedItem.PlatformID)) {
            uniquePlatforms.add(nestedItem.PlatformID);
            platformList.push({
              label: nestedItem.PlatformName,
              path: `${nestedItem.PlatformURL}login?session=${this.sessionId}`,
              description: `Navigate to ${nestedItem.PlatformName} dashboard`,
            });
          }
        });
      } else {
        if (item.PlatformURL && item.PlatformName && !uniquePlatforms.has(item.PlatformID)) {
          uniquePlatforms.add(item.PlatformID);
          platformList.push({
            label: item.PlatformName,
            path: `${item.PlatformURL}login?session=${this.sessionId}`,
            description: `Navigate to ${item.PlatformName} dashboard`,
          });
        }
      }
    });
    
    return platformList.map(platform => ({ subItems: [platform] }));
    
    // const platformList = this.user.UserDetails.filter(item => item.PlatformURL && item.PlatformName);

    // return platformList.map((platform) => {
    //   return {
    //     subItems: [
    //       {
    //         label: platform.PlatformName,
    //         path: `${platform.PlatformURL}login?session=${this.sessionId}`, // Adjust the path as needed
    //         description: `Navigate to ${platform.PlatformName} dashboard`,
    //       },
    //     ],
    //   };
    // });
  }

  menus: any = [
    // {
    //   //label: "Users",
    //   subItems: [
    //     {
    //       label: "Tenant Billing system",
    //       path: "https://www.google.com/",
    //       description: "View users and customize users",
    //     },
    //   ],
    // },

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
            const platform = this.platformList?.find(
              (item) => item.PlatformID == platformId);

            if (platform) {
              const dashboardUrl = `${platform.PlatformName}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
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
      ).subscribe();
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

import { ApplicationConfig, Component, HostListener } from "@angular/core";
import { error } from "console";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { MenuService } from "src/app/services/menu.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { UserAccountService } from "src/app/services/cams-new/user-account.service";
import { Observable, catchError, map, of } from "rxjs";
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
  platformList = this.appConfigService.appConfig[0].platformList; // Replace with your service method to get platform list

  generatePlatformMenuItems(): any[] {
    return this.platformList.map((platform) => {
      return {
        subItems: [
          {
            label: platform.value,
            path: `${platform.Url}/login?session=${this.sessionId}&user=${this.user?.id}`, // Adjust the path as needed
            description: `Navigate to ${platform.value} dashboard`,
          },
        ],
      };
    });
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
    const loginUser = this.route.snapshot.queryParams["user"];
    const platformId = this.route.snapshot.queryParams["platform"];

    if (loginUser) {
      if (loginUser == this.user?.id) {
        const platform = this.platformList.find(
          (item) => item.id == platformId
        );

        //check the platform with user ID in JWT
        if (platform) {
          const dashboardUrl = `${platform.url}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
          this.router.navigateByUrl(dashboardUrl);
          this.initializedashboard();
        } else {
          alert("Platform not found from the Id");
          this.router.navigate(["/login"]);
        }
      } else {
        alert("Invalid User ID");
      }

      // if (this.validateUserId(loginUser, this.sessionId)) {
      //   const platform = this.platformList.find(
      //     (item) => item.id == platformId
      //   );

      //   if (platform) {
      //     const dashboardUrl = `${platform.Url}/dashboard?session=${this.sessionId}&user=${this.user?.id}`;
      //     this.router.navigateByUrl(dashboardUrl);
      //     this.initializedashboard();
      //   } else {
      //     alert("Platform not found from the Id");
      //     this.router.navigate(["/login"]);
      //   }
      // } else {
      //   alert("Invalid User ID");
      // }
    } else {
      this.initializedashboard();
    }
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

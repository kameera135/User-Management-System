import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { AuthService } from "src/app/auth/auth.service";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { UserAccountService } from "src/app/services/cams-new/user-account.service";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";

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

  sessionId: any = localStorage.getItem("sessionId");
  user = this.auth.getUser();

  get profileImage() {

    const fullName = this.app.user?.fullName || 'John Doe'

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;
  }

   //If avatar image is not loading
   fallbackImage(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/user1.png';
  }

  get greetBasedOnTime(): string {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else {
      return "Good Afternoon";
    }
  }

  tempuser: any = this.auth.getUser()

  get userName() {
    return this.tempuser?.fName + " " + this.tempuser?.lName;
  }

  get userRole() {
    return this.tempuser?.roles;
  }


  generatePlatformMenuItems(): any[] {

    // Return an empty array or handle the case when user or platforms is undefined
    if (!this.user || !this.user.platforms) return [];

    const platformList: { label: string; path: string; description: string; iconPath: string; }[] = [];
    const uniquePlatforms = new Set(); // Set to keep track of unique platforms

    // Function to add platform details to the platform list
    const addPlatform = (platform: string | { platformName: string; platformURL: string; platformId: string; }) => {
      let platformId, platformName, platformURL;
      if (typeof platform === 'string') {
        [platformName, platformURL, platformId] = platform.split(" || ");
      } else {
        platformId = platform.platformId;
        platformName = platform.platformName;
        platformURL = platform.platformURL;
      }
      if (platformName && platformURL && !uniquePlatforms.has(platformName)) {
        uniquePlatforms.add(platformName);
        platformList.push({
          label: platformName,
          path: `${platformURL}/login?session=${this.sessionId}&platformId=${platformId}`,
          description: platformName,
          iconPath: `${platformURL}/assets/icons/logo/svg/sign-in-logo.svg`,
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

  constructor(
    private breadcrumbService: BreadcrumbService,
    private auth: AuthService,
    private app: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private shared: UserAccountService,
    private alertService: MessageService
  ) { }


  logout() {
    try {
      this.shared.deleteSessionToken(this.tempuser?.id, this.sessionId).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          alert("Error while logging out!");
        }
      })

      this.auth.logout();

      this.alertService.sideSuccessAlert(
        "Logout Success",
        "You are logged out from your account.",
      );
    }
    catch (e) {
      console.log(e);
    }
  }

  ngOnInit(): void {
    //const loginUser = this.route.snapshot.queryParams["user"];
    const platformId = this.route.snapshot.queryParams["platform"];

    if (this.sessionId) {
      this.shared.validateSessionTokenFromUrl(this.sessionId, this.user?.id).pipe(
        map((response: any) => response.statusCode === 200),
        tap((isvalid: boolean) => {
          if (!isvalid) {
            localStorage.clear();
            this.router.navigate(["/login"]);
          }
          else if (platformId) {
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
          else {
            this.initializedashboard();
          }
        })
      );
    }
    else {
      localStorage.clear();
      this.router.navigate(["/login"]);
    }

    this.initializedashboard();
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
    this.menuItems = [...this.generatePlatformMenuItems()];

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Dashboard", active: true },
    ]);
  }
}

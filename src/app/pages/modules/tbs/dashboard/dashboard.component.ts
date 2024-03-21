import { ApplicationConfig, Component } from "@angular/core";
import { error } from "console";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { MenuService } from "src/app/services/menu.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";

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

  generatePlatformMenuItems(): any[] {
    const platformList = this.appConfigService.appConfig[0].platformList; // Replace with your service method to get platform list
  
    return platformList.map((platform) => {
      return {
        subItems: [
          {
            label: platform.value,
            path: `/${platform.id.toLowerCase()}-dashboard`, // Adjust the path as needed
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

    // {
    //   //label: "Configuration",
    //   subItems: [
    //     {
    //       label: "Aircon Extention System",
    //       path: "https://www.facebook.com/",
    //       description: "Aircon extension configuration site",
    //     },
    //   ],
    // },

    // {
    //   //label: "Configuration",
    //   subItems: [
    //     {
    //       label: "Configuration management system",
    //       path: "https://www.linkedin.com/",
    //       description: "Customize configurations of sites",
    //     },
    //   ],
    // },

    // {
    //   //label: "Configuration",
    //   subItems: [
    //     {
    //       label: "Facility Booking system",
    //       path: "/permission-configuration",
    //       description: "Customize permission configuration",
    //     },
    //   ],
    // },

    // {
    //   //label: "Activity Logs",
    //   subItems: [
    //     {
    //       label: "Activity Logs",
    //       path: "/activity-logs",
    //       description: "View Activity Logs",
    //     },
    //   ],
    // },

    // {
    //   subItems: [
    //     {
    //       label: "Password Policy",
    //       path: "/password-policy",
    //       description: "Customize password policies",
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
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // this.showAlert();

    this.menuItems = [...this.menus,
      ...this.generatePlatformMenuItems()]

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Dashboard", active: true },
    ]);
  }

  // showAlert(): any {
  //   this.ActivityLogsService.getAcknowledgeAlert().subscribe({
  //     next: (result) => {
  //       this.hasAlert = result.hasAlert;

  //       if (this.hasAlert) {
  //         this.menuItems[4].subItems[0].hasAlert = true;
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
}

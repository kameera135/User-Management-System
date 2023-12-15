import { Component } from "@angular/core";
import { error } from "console";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { MenuService } from "src/app/services/menu.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  loadingInProgress: boolean = false;

  hasAlert: boolean = false;

  menuItems: any = [];
  menus: any = [
    {
      label: "Users",
      subItems: [
        {
          label: "Users ",
          path: "/users-view",
          description: "View users and customize users",
        },
        // {
        //   label: "View Invoice",
        //   path: "/view-invoice",
        //   description:
        //     "View invoices for Tenants and download the invoice as a PDF.",
        // },
        // {
        //   label: "Send Invoice",
        //   path: "/send-invoice",
        //   description:
        //     "Manually email invoices to tenants (Individual Or Bulk)",
        // },
      ],
    },
    {
      label: "Configuration",
      subItems: [
        {
          label: "Platform Configuration",
          path: "/platform-configuration",
          description: "Customize platform configuration",
        },
        {
          label: "Feature Configuration",
          path: "/feature-configuration",
          description: "Customize feature configuration",
        },
        {
          label: "Profile Configuration",
          path: "/profile-configuration",
          description: "Customize profile configuration",
        },
      ],
    },
    {
      label: "Activity Logs",
      subItems: [
        {
          label: "Activity Logs",
          path: "/activity-logs",
          description: "View Activity Logs",
        },
        // {
        //   label: "Meter Compensate",
        //   path: "/meter-compensate",
        //   description: "View meter compensates and add meter compensates",
        // },
        // {
        //   label: "Meter Daily Summary",
        //   path: "/meter-daily-summary",
        //   description: "View summary of daily consumption per Meters",
        // },
        // {
        //   label: "Manual Meter Readings",
        //   path: "/manual-meter-readings",
        //   description:
        //     "View manual meter readings and add or delete meter readings",
        // },
      ],
    },
    {
      label: "User Account",
      subItems: [
        {
          label: "User Account",
          path: "/user-account",
          description: "Customize user account.",
        },
        // {
        //   label: "Meter Daily Summary",
        //   path: "/meter-daily-summary",
        //   description: "View summary of daily consumption per Meters",
        // },
        // {
        //   label: "Manual Meter Readings",
        //   path: "/manual-meter-readings",
        //   description:
        //     "View manual meter readings and add or delete meter readings",
        // },
        // {
        //   label: "Activity Logs",
        //   path: "/activity-logs",
        //   description: "View Activity Logs data and acknowledge Activity Logss",
        //   hasAlert: false,
        // },
      ],
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private sideMenuService: MenuService,
    private ActivityLogsService: ActivityLogsService
  ) {}

  ngOnInit(): void {
    this.showAlert();

    this.menuItems = this.menus;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Dashboard", active: true },
    ]);
  }

  showAlert(): any {
    this.ActivityLogsService.getAcknowledgeAlert().subscribe({
      next: (result) => {
        this.hasAlert = result.hasAlert;

        if (this.hasAlert) {
          this.menuItems[2].subItems[4].hasAlert = true;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}

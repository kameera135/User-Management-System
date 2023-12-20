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
  showAddTile: boolean = true;

  menuItems: any[] = [];
  menus: any = [
    {
      //label: "Users",
      subItems: [
        {
          label: "Users ",
          path: "/users-view",
          description: "View users and customize users",
        },
      ],
    },

    {
      //label: "Configuration",
      subItems: [
        {
          label: "Platform Configuration",
          path: "/platform-configuration",
          description: "Customize platform configuration",
        },
      ],
    }, 

    {
      //label: "Configuration",
      subItems: [
        {
          label: "Role Configuration",
          path: "/role-configuration",
          description: "Customize role configuration",
        },
      ],
    },

    {
      //label: "Configuration",
      subItems: [
        {
          label: "Permission Configuration",
          path: "/permission-configuration",
          description: "Customize permission configuration",
        },
      ],
    },

    {
      //label: "Activity Logs",
      subItems: [
        {
          label: "Activity Logs",
          path: "/activity-logs",
          description: "View Activity Logs",
        },
      ],
    },

    {
      subItems: [
        {
          label: "Password Policy",
          path: "/password-policy",
          description: "Customize password policies",
        },
      ],
    },

    {
      subItems: [
        {
          label: "Tokens",
          path: "/api-token",
          description: "View API Tokens",
        },
      ],
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private sideMenuService: MenuService,
    private ActivityLogsService: ActivityLogsService
  ) {}

  ngOnInit(): void {
    // this.showAlert();

    this.menuItems = this.menus;

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

  addTile(): void {
    // Find the 'Add Platform' menu item in the 'menus' array
    const addPlatformMenuItem = this.menus.find((menu: { subItems: any[] }) =>
      menu.subItems.some(
        (subItem: { label: string }) => subItem.label === "Add Platform"
      )
    );

    if (addPlatformMenuItem) {
      // Create a new tile and add it to the 'Add Platform' subItems array
      const newTile = {
        label: "New Tile",
        path: "/new-tile-path",
        description: "Description of the new tile",
        hasAlert: false,
      };

      addPlatformMenuItem.subItems.push(newTile);

      // Update the 'menuItems' array to reflect the changes
      this.updateDashboard();
    }
  }

  updateDashboard(): void {
    let tiles: any[] = [];
    for (let menu of this.menus) {
      tiles = tiles.concat(menu.subItems);
    }
    this.menuItems = this.chunkArray(tiles, 3);
  }

  chunkArray(arr: any[], size: number): any[][] {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  }
}


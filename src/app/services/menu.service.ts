import { Injectable } from "@angular/core";
import { MenuItem } from "../layouts/menu.model";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  moduleID: any = 0;

  MENU: MenuItem[] = [
    {
      id: 100,
      label: "Users",
      icon: "bi-people",
      module: "1",
      subItems: [
        {
          id: 5,
          label: "Users ",
          link: "/users-view",
          parentId: 800,
          module: "1",
        },
        // {
        //   id: 3,
        //   label: "View Invoice",
        //   link: "/view-invoice",
        //   parentId: 101,
        //   module: "1",
        // },
        // {
        //   id: 4,
        //   label: "Send Invoice",
        //   link: "/send-invoice",
        //   parentId: 102,
        //   module: "1",
        // },
      ],
    },
    {
      id: 200,
      label: "Configuration",
      collapseid: "sidebarDashboards5",
      icon: "bi-file-earmark-text",
      module: "1",
      subItems: [
        {
          id: 3,
          label: "Platform Configuration",
          link: "/platform-configuration",
          parentId: 100,
          module: "1",
        },
        {
          id: 4,
          label: "Role Configuration",
          link: "/feature-configuration",
          parentId: 100,
          module: "1",
        },
        {
          id: 6,
          label: "Permission Configuration",
          link: "/profile-configuration",
          parentId: 100,
          module: "1",
        },
      ],
    },
    {
      id: 400,
      label: "Password Policy",
      collapseid: "sidebarDashboards",
      icon: "bi-file-earmark-lock",
      module: "1",
      subItems: [
        {
          id: 4,
          label: "Password Policy",
          link: "/password-policy",
          parentId: 102,
          module: "1",
        },
      ],
    },
    {
      id: 500,
      label: "Tokens",
      collapseid: "sidebarDashboards",
      icon: "bi-shield-lock",
      module: "1",
      subItems: [
        {
          id: 2,
          label: "API Tokens",
          link: "/api-tokens",
          parentId: 102,
          module: "1",
        },
      ],
    },
    {
      id: 300,
      label: "Activity Logs",
      collapseid: "sidebarDashboards",
      icon: "bi-activity",
      module: "1",
      subItems: [
        {
          id: 6,
          label: "Activity Logs",
          link: "/activity-logs",
          parentId: 800,
          module: "1",
        },
        // {
        //   id: 3,
        //   label: "Meter Compensate",
        //   link: "/meter-compensate",
        //   parentId: 800,
        //   module: "1",
        // },
        // {
        //   id: 4,
        //   label: "Meter Daily Summary",
        //   link: "/meter-daily-summary",
        //   parentId: 800,
        //   module: "1",
        // },
        // {
        //   id: 5,
        //   label: "Manual Meter Readings",
        //   link: "/manual-meter-readings",
        //   parentId: 800,
        //   module: "1",
        // },
      ],
    },
    {
      id: 300,
      label: "User Account",
      collapseid: "sidebarDashboards",
      icon: "bi-person-circle",
      module: "1",
      subItems: [
        {
          id: 2,
          label: "User Account",
          link: "/user-account",
          parentId: 102,
          module: "1",
        },
      ],
    },
  ];

  constructor() {}

  setModuleID(module: any) {
    this.moduleID = module;
  }

  getModuleID(): any {
    return this.moduleID;
  }

  resetModuleID() {
    this.moduleID = 0;
  }

  getMenu(): MenuItem[] {
    return this.MENU;
  }
}

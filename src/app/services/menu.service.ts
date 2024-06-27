import { Injectable } from "@angular/core";
import { MenuItem } from "../layouts/menu.model";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  moduleID: any = 0;

  MENU: MenuItem[] = [
    {
      id: 10,
      label: "Dashboard",
      icon: "bi-speedometer2",
      module: "1",
      link: "/dashboard",
      subItems: [],
    },
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
        }
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
          label: "Platforms",
          link: "/platform-configuration",
          parentId: 100,
          module: "1",
        },
        {
          id: 4,
          label: "Roles",
          link: "/role-configuration",
          parentId: 100,
          module: "1",
        },
        {
          id: 6,
          label: "Permissions",
          link: "/permission-configuration",
          parentId: 100,
          module: "1",
        },
      ],
    },
    // {
    //   id: 400,
    //   label: "Password Policy",
    //   collapseid: "sidebarDashboards",
    //   icon: "bi-file-earmark-lock",
    //   module: "1",
    //   subItems: [
    //     {
    //       id: 4,
    //       label: "Password Policy",
    //       link: "/password-policy",
    //       parentId: 102,
    //       module: "1",
    //     },
    //   ],
    // },
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
          link: "/system-tokens",
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
        }
      ],
    }
  ];

  constructor() { }

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

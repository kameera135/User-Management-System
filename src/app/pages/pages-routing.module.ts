import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages
import { PlatformConfigurationComponent } from "./modules/cams-new/platform-configuration/platform-configuration.component";
import { FeatureConfigurationComponent } from "./modules/cams-new/feature-configuration/feature-configuration.component";
import { RoleConfigurationComponent } from "./modules/cams-new/role-configuration/role-configuration.component";
import { ActivityLogsComponent } from "./modules/cams-new/activity-logs/activity-logs.component";
import { DashboardComponent } from "./modules/tbs/dashboard/dashboard.component";
import { UserAccountComponent } from "./modules/cams-new/user-account/user-account.component";
import { UsersViewComponent } from "./modules/cams-new/users-view/users-view.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "user-account",
    component: UserAccountComponent,
  },
  {
    path: "platform-configuration",
    component: PlatformConfigurationComponent,
  },
  {
    path: "feature-configuration",
    component: FeatureConfigurationComponent,
  },
  {
    path: "role-configuration",
    component: RoleConfigurationComponent,
  },
  {
    path: "users-view",
    component: UsersViewComponent,
  },
  {
    path: "activity-logs",
    component: ActivityLogsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

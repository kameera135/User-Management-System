import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages
import { PlatformConfigurationComponent } from "./modules/tbs/platform-configuration/platform-configuration.component";
import { FeatureConfigurationComponent } from "./modules/tbs/feature-configuration/feature-configuration.component";
import { ProfileConfigurationComponent } from "./modules/tbs/profile-configuration/profile-configuration.component";
import { ActivityLogsComponent } from "./modules/tbs/activity-logs/activity-logs.component";
import { DashboardComponent } from "./modules/tbs/dashboard/dashboard.component";
import { UserAccountComponent } from "./modules/tbs/user-account/user-account.component";
import { UsersViewComponent } from "./modules/tbs/users-view/users-view.component";

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
    path: "profile-configuration",
    component: ProfileConfigurationComponent,
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

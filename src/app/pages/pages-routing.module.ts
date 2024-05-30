import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages
import { PlatformConfigurationComponent } from "./modules/cams-new/platform-configuration/platform-configuration.component";
import { PermissionConfigurationComponent } from "./modules/cams-new/permission-configuration/permission-configuration.component";
import { RoleConfigurationComponent } from "./modules/cams-new/role-configuration/role-configuration.component";
import { ActivityLogsComponent } from "./modules/cams-new/activity-logs/activity-logs.component";
import { DashboardComponent } from "./modules/tbs/dashboard/dashboard.component";
import { UserAccountComponent } from "./modules/cams-new/user-account/user-account.component";
import { UsersViewComponent } from "./modules/cams-new/users-view/users-view.component";
import { SystemTokensComponent } from "./modules/cams-new/system-tokens/system-tokens.component";
import { PasswordPolicyComponent } from "./modules/cams-new/password-policy/password-policy.component";
import { PlatformUsersComponent } from "./modules/cams-new/platform-users/platform-users.component";
//import { LoginComponent } from "../auth/login/login.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "platform-configuration",
    component: PlatformConfigurationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "permission-configuration",
    component: PermissionConfigurationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "role-configuration",
    component: RoleConfigurationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "users-view",
    component: UsersViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "activity-logs",
    component: ActivityLogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "system-tokens",
    component: SystemTokensComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "password-policy",
    component: PasswordPolicyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "platform-users/:id/:name",
    component: PlatformUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user-account",
    component: UserAccountComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

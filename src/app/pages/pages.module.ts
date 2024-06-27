import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  NgbAlertModule,
  NgbToastModule,
  NgbProgressbarModule,
  NgbNavModule,
  NgbCarouselModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";

import { FlatpickrModule } from "angularx-flatpickr";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from "../shared/widget/widget.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { PlatformConfigurationComponent } from "./modules/cams-new/platform-configuration/platform-configuration.component";
import { PermissionConfigurationComponent } from "./modules/cams-new/permission-configuration/permission-configuration.component";
import { RoleConfigurationComponent } from "./modules/cams-new/role-configuration/role-configuration.component";
import { ActivityLogsComponent } from "./modules/cams-new/activity-logs/activity-logs.component";
import { DashboardComponent } from "./modules/tbs/dashboard/dashboard.component";
import { UserAccountComponent } from "./modules/cams-new/user-account/user-account.component";
import { UsersViewComponent } from "./modules/cams-new/users-view/users-view.component";
import { PasswordPolicyComponent } from './modules/cams-new/password-policy/password-policy.component';
import { SystemTokensComponent } from './modules/cams-new/system-tokens/system-tokens.component';
import { PlatformUsersComponent } from "./modules/cams-new/platform-users/platform-users.component";


@NgModule({
  declarations: [
    PlatformConfigurationComponent,
    PermissionConfigurationComponent,
    RoleConfigurationComponent,
    ActivityLogsComponent,
    DashboardComponent,
    UserAccountComponent,
    UsersViewComponent,
    PasswordPolicyComponent,
    SystemTokensComponent,
    PlatformUsersComponent
  ],  
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    NgSelectModule,
    NgbAlertModule,
    NgbModule,
    FormsModule
  ],
})
export class PagesModule {
  constructor() {
    // defineElement(lottie.loadAnimation);
  }
}

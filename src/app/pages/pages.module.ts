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
import { PlatformConfigurationComponent } from "./modules/tbs/platform-configuration/platform-configuration.component";
import { FeatureConfigurationComponent } from "./modules/tbs/feature-configuration/feature-configuration.component";
import { ProfileConfigurationComponent } from "./modules/tbs/profile-configuration/profile-configuration.component";
import { ActivityLogsComponent } from "./modules/tbs/activity-logs/activity-logs.component";
import { DashboardComponent } from "./modules/tbs/dashboard/dashboard.component";
import { UserAccountComponent } from "./modules/tbs/user-account/user-account.component";
import { UsersViewComponent } from "./modules/tbs/users-view/users-view.component";

@NgModule({
  declarations: [
    PlatformConfigurationComponent,
    FeatureConfigurationComponent,
    ProfileConfigurationComponent,
    ActivityLogsComponent,
    DashboardComponent,
    UserAccountComponent,
    UsersViewComponent,
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
  ],
})
export class PagesModule {
  constructor() {
    // defineElement(lottie.loadAnimation);
  }
}

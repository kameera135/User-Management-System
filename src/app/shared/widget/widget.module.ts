import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  NgbTooltipModule,
  NgbProgressbarModule,
  NgbDropdownModule,
  NgbModule,
  NgbAlertModule,
  NgbCarouselModule,
  NgbModalModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";

import { TableComponent } from "./table/table.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule } from "@angular/common/http";
import { TreeviewCheckboxComponent } from "./treeview/treeview.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { DropdownListComponent } from "./dropdown-list/dropdown-list.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgToastModule } from "ng-angular-popup";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { WaitingCircleComponent } from "./waiting-circle/waiting-circle.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonExportComponent } from "./common-export/common-export.component";
import { SimplebarAngularModule } from "simplebar-angular";
import { TablePaginatorComponent } from "./table-paginator/table-paginator.component";
import { NgxPaginationModule } from "ngx-pagination";
import { DatepickerNewComponent } from "./datepicker/datepicker.component";
import { RightTreeNodeComponent } from "./right-tree-node/right-tree-node.component";
import { DashboardCardComponent } from "./dashboard-card/dashboard-card.component";
import { UserViewModalComponent } from "./config/user-view-modal/user-view-modal.component";
import { ActivityLogsModalComponent } from "./config/activity-logs-modal/activity-logs-modal.component";
import { MatRadioModule } from "@angular/material/radio";
import { UpdateConfirmationModalComponent } from "./config/update-confirmation-modal/update-confirmation-modal.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { PlatformConfigurationModalComponent } from "./config/platform-configuration-modal/platform-configuration-modal.component";
import { PermissionConfigurationModalComponent } from "./config/permission-configuration-modal/permission-configuration-modal.component";
import { RoleConfigurationModalComponent } from "./config/role-configuration-modal/role-configuration-modal.component";
import { SystemTokenModalComponent } from "./config/system-token-modal/system-token-modal/system-token-modal.component";
import { PlatformUserModalComponent } from "./config/platform-user-modal/platform-user-modal.component";
import { AddBulkUsersModalComponent } from "./config/add-bulk-users-modal/add-bulk-users-modal.component";

@NgModule({
  declarations: [
    TableComponent,
    TreeviewCheckboxComponent,
    DropdownListComponent,
    WaitingCircleComponent,
    CommonExportComponent,
    TablePaginatorComponent,
    DatepickerNewComponent,
    RightTreeNodeComponent,
    DashboardCardComponent,
    UserViewModalComponent,
    ActivityLogsModalComponent,
    UpdateConfirmationModalComponent,
    SidebarComponent,
    PlatformConfigurationModalComponent,
    PermissionConfigurationModalComponent,
    RoleConfigurationModalComponent,
    SystemTokenModalComponent,
    PlatformUserModalComponent,
    AddBulkUsersModalComponent,
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    FlatpickrModule.forRoot(),
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    NgToastModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    SimplebarAngularModule,
    NgxPaginationModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],

  exports: [
    TableComponent,
    TreeviewCheckboxComponent,
    DropdownListComponent,
    WaitingCircleComponent,
    DatepickerNewComponent,
    RightTreeNodeComponent,
    DashboardCardComponent,
    UserViewModalComponent,
    MatCheckboxModule,
  ],
})
export class WidgetModule {
  constructor() {
    // defineElement(lottie.loadAnimation);
  }
}

import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgToastService } from "ng-angular-popup";
import { PermissionConfigurationService } from "src/app/services/cams-new/configuration services/permission-configuration.service";
import { ConsumptionByMeter } from "src/app/shared/models/Tbs/consumptionByMeter";
import { AppService } from "src/app/app.service";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { LocationMapService } from "src/app/services/location-map.service";
import { isNull } from "lodash";
import { ReportService } from "src/app/services/ReportServices/report.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { Permission } from "src/app/shared/models/Cams-new/Permission";
import { PermissionConfigurationModalComponent } from "src/app/shared/widget/config/permission-configuration-modal/permission-configuration-modal.component";
import { UpdateConfirmationModalComponent } from "src/app/shared/widget/config/update-confirmation-modal/update-confirmation-modal.component";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";

@Component({
  selector: "app-permission-configuration",
  templateUrl: "./permission-configuration.component.html",
  styleUrls: ["./permission-configuration.component.scss"],
})
export class PermissionConfigurationComponent {

  asseteTreeData: any = {};
  userId: number = 0;
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedMeter: string = "";
  selectedService: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  service: string = "";
  meterCodeList: any[] = [];
  meterName: string = "";
  serviceList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  extensionData: any[] = [];
  loadingInProgress: boolean = false;
  loading: boolean = false;
  pageSize: any[] = [50];
  selectedPageSize: number = 50;
  nameOfOrganization: string = "";
  moduleName: string = "";
  reportMonth: string = "";
  dateTime: string = "";

  selectedUnit!: Unit;
  unitId!: string;

  permissionList!: Permission[];
  permissionModal!: Permission;

  totalDataCount!: number;
  serchedTerm!: string;
  searchTerm!: string;
  selectedPlatform: number = 1;

  selectedPermission: string = "All";
  selectedPage: number = 1;

  platformList: any[] = [];
  permissionDetailsArray: any = [];

  permissionConfigTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    // {
    //   Head: "Permission ID",
    //   FieldName: "PermissionId",
    //   ColumnType: "Data",
    // },
    {
      Head: "Permission Name",
      FieldName: "PermissionName",
      ColumnType: "Data",
    },
    // {
    //   Head: "Platform",
    //   FieldName: "PlatformName",
    //   ColumnType: "Data",
    // },
    // { Head: "Created Date", FieldName: "CreatedDate", ColumnType: "Data" },
    { Head: "Status", FieldName: "Status", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  dataArray: any[] = [];

  tableData: any = [];


  constructor(
    private breadcrumbService: BreadcrumbService,
    private notifierService: NgToastService,
    private locationMap: LocationMapService,
    private appService: AppService,
    private reportService: ReportService,
    private modalService: NgbModal,
    private alertService: MessageService,
    private shared: PermissionConfigurationService,
    private activityLogsService: ActivityLogsService
  ) {}

  ngOnInit(): void {

    this.getPlatformList();

    this.permissionConfigTableOptions.allowCheckbox = true;
    this.permissionConfigTableOptions.allowBulkDeleteButton = true;
    this.permissionConfigTableOptions.allowDeleteButton = true;
    this.permissionConfigTableOptions.allowUpdateButton = true;
    this.permissionConfigTableOptions.allowViewButton = true;
    this.permissionConfigTableOptions.allowActivateButton = true;
    this.permissionConfigTableOptions.allowBulkActivateButton = true;
    this.permissionConfigTableOptions.allowDeactivateButton = true;
    this.permissionConfigTableOptions.allowBulkDeactivateButton = true;
    this.permissionConfigTableOptions.displayPagination = true;

    this.permissionConfigTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdatePermissionConfirmationMessage;
    this.permissionConfigTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeletePermissionConfirmationMessage;
    this.permissionConfigTableOptions.recordApproveConfirmationMessage =
      this.appService.popUpMessageConfig[0].ActivatePermissionConfirmationMessage;
    this.permissionConfigTableOptions.recordRejectingConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeactivatePermissionConfirmationMessage;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Permissions", active: true },
    ]);

    this.loadData();
  }

  getPlatformList() {
    this.activityLogsService.getPlatformList().subscribe({
      next: (response: any) => {
        // this.platformList = response;
        this.platformList = response;
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetPlatformComboboxListErrorSideAlertMessage
        );
      },
    });
  }

  loadData() {
    this.loadingInProgress = true;
    if (
      this.searchTerm == undefined ||
      this.searchTerm == null ||
      this.searchTerm == ""
    ) {
      this.getAllPermissions();
    } else if (
      this.searchTerm != undefined ||
      this.searchTerm != null ||
      this.searchTerm != ""
    ) {
      this.searchPermissions(this.searchTerm);
    } else {
      this.getAllPermissions();
      this.alertService.sideErrorAlert(
        "Error",
        this.appService.popUpMessageConfig[0]
          .CouldNotRetriveDataErrorSideAlertMessage
      );
    }
  }

  searchPermissions(serchedTerm: string) {
    this.shared
      .getSearchedPermissions(
        serchedTerm,
        this.selectedPage,
        this.selectedPageSize,
        this.selectedPlatform || 0
      )
      .subscribe({
        next: (response: any) => {
          this.permissionList = response.response;
          this.totalDataCount = response.rowCount;

          if (this.totalDataCount > 0) {
            this.updateTable();
            this.loadingInProgress = false;
          } else {
            this.alertService.warningSweetAlertMessage(
              this.appService.popUpMessageConfig[0].NoDataNotificationMessage,
              "No Data!",
              4000
            );
            this.getAllPermissions();
          }
        },
        error: (error: any) => {
          this.alertService.sideErrorAlert(
            "Error",
            this.appService.popUpMessageConfig[0]
              .GetPermissionListErrorSideAlertMessage
          );

          this.permissionList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  getAllPermissions() {
    this.shared
      .getAllPermissions(
        this.selectedPage,
        this.selectedPageSize,
        this.selectedPlatform || 0
      )
      .subscribe({
        next: (response) => {
          this.permissionList = response.response;
          this.totalDataCount = response.rowCount;
          this.updateTable();
          this.loadingInProgress = false;
        },
        error: (error) => {
          this.alertService.sideErrorAlert(
            "Error",
            this.appService.popUpMessageConfig[0]
              .GetPermissionListErrorSideAlertMessage
          );

          this.permissionList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  updateTable() {
    this.permissionDetailsArray = this.permissionList.map((item) => ({
      PermissionId: item.permissionId,
      PermissionName: item.permission,
      PlatformName: item.platformName,
      CreatedDate: item.createdAt ? item.createdAt.slice(0, 10) : null,
      Status: item.status ? "Activated" : "Deactivated",
      StatusBool: item.status,
      isRejecteableOrApprovableRecord: true,
    }));
    this.tableData = this.permissionDetailsArray;
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onAddPermissionButtonClicked(): void {
    this.openModal("Add", "New Permission", "", "", "", "", true);
  }

  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Permission Details",
      row.PermissionId,
      row.PermissionName,
      row.CreatedDate,
      row.Status,
      row.StatusBool
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Permission Details",
      row.PermissionId,
      row.PermissionName,
      row.CreatedDate,
      row.Status,
      row.StatusBool
    );
  }

  openModal(
    type: string,
    modalTitle: string,
    permissionId: string,
    permissionName: string,
    createdDate: string,
    status: string,
    statusBool: boolean
  ): void {
    const modalRef = this.modalService.open(
      PermissionConfigurationModalComponent,
      {
        size: "s",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.permissionId = permissionId;
    modalRef.componentInstance.platformId = this.selectedPlatform;
    modalRef.componentInstance.permissionName = permissionName;
    modalRef.componentInstance.createdDate = createdDate;
    modalRef.componentInstance.status = status;
    modalRef.componentInstance.statusBool = statusBool;

    modalRef.result
      .then((result) => {
        if (result) {
          console.log("Getting data from Permission Configuration Modal");
          console.log(result);

          this.permissionModal = result;
          if (type == "Add") {
            this.postPermission(this.permissionModal);
          } else if (type == "Edit") {
            this.putPermission(this.permissionModal);
          } else if (type == "View") {
            //confirmation modal open
            const modalRefForConfirmation = this.modalService.open(
              UpdateConfirmationModalComponent,
              {
                centered: true,
                backdrop: "static",
                keyboard: false,
              }
            );
            modalRefForConfirmation.componentInstance.notificationMessage =
              this.permissionConfigTableOptions.rowEditConfirmationMessage;
            modalRefForConfirmation.result
              .then((result) => {
                if (result == "Yes") {
                  console.log("Confirmed to edit");
                  this.openModal(
                    "Edit",
                    "Edit Permission Details",
                    permissionId,
                    permissionName,
                    createdDate,
                    status,
                    statusBool
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Permission",
                    permissionId,
                    permissionName,
                    createdDate,
                    status,
                    statusBool
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
            //second modal closed
          }
        } else {
          console.log("Data not submitted from add Permission View Modal");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  putPermission(permission: Permission) {
    this.shared.putPermission(permission).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PermissionUpdatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PermissionUpdatedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        if (
          error.error ==
          "The specified permission name is already assigned to another permission. Please choose a unique name for the permission you are trying to update."
        ) {
          this.alertService.warningSweetAlertMessage(
            error.error,
            "Error!",
            4000
          );
        }
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionUpdatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  postPermission(permission: any) {
    console.log("Add", permission);
    this.shared.postPermission(permission).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PermissionAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PermissionAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        if (
          error.error ==
          "Unable to create new permission. The specified permission name is already in use."
        ) {
          this.alertService.warningSweetAlertMessage(
            error.error,
            "Error!",
            4000
          );
        }
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionAddedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  getSearchTerm($event: KeyboardEvent) {
    this.selectedPage = 1;
    if ($event.key === "Enter" || this.searchTerm =="") {
      this.loadData();
    }
  }

  searchOnClick() {
    this.loadData();
  }

  deletePermission(items: any): void {
    let ids: number[] = [];
    console.log("items", items);
    items.forEach((element: any) => {
      ids.push(element.PermissionId);
    });

    this.removePermissions(ids);
  }

  removePermissions(ids: number[]): void {
    this.shared.deletePermission(ids).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PermissionDeletedSuccessSideAlertMessage
        );

        if(ids.length > 1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .PermissionsDeletedNotificationMessage,
            "Deleted!",
            4000
          );
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .PermissionDeletedNotificationMessage,
            "Deleted!",
            4000
          );
        }

        this.loadData();
      },

      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionDeletedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  activatePermissions(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.PermissionId);
    });

    console.log(ids);

    this.activatePermission(ids);
  }

  deactivatePermissions(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.PermissionId);
    });

    console.log(ids);

    this.deactivatePermission(ids);
  }

  activatePermission(ids: number[]): void {
    this.shared.activatePermissions(ids).subscribe({
      next: (response: any) => {
        console.log("Activating a Platform: ");
        console.log(response);
        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PermissionActivatedSuccessSideAlertMessage
        );

        if(ids.length > 1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0].PermissionsActivateNotificationMessage,
            "Activated!",
            4000
          );
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0].PermissionActivateNotificationMessage,
            "Activated!",
            4000
          );
        }

        this.loadData();
      },

      error: (error: any) => {
        console.log("Activating a Platform: error");
        console.log(error);
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionActivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deactivatePermission(ids: number[]): void {
    console.log("ids", ids);
    this.shared.deactivatePermissions(ids).subscribe({
      next: (response: any) => {
        console.log("Deactivating a Platform: ");
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PermissionDeactivatedSuccessSideAlertMessage
        );

        if(ids.length > 1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .PermissionsDeactivateNotificationMessage,
            "Deactivated!",
            4000
          );
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .PermissionDeactivateNotificationMessage,
            "Deactivated!",
            4000
          );
        }

        this.loadData();
      },

      error: (error: any) => {
        console.log("Deactivating a Platform: error");
        console.log(error);
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionDeactivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  getDateTime() {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    var time =
      today.getHours().toString().padStart(2, "0") +
      ":" +
      today.getMinutes().toString().padStart(2, "0") +
      ":" +
      today.getSeconds().toString().padStart(2, "0");
    this.dateTime = date + " " + time;
  }
}

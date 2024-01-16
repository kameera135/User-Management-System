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

  selectedPermission: string = "All";
  selectedPage: number = 1;

  platformList: any[] = [{ value: "All", id: 1 }];
  permissionDetailsArray: any = []


  permissionConfigTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Permission Code", FieldName: "PermissionCode", ColumnType: "Data" },
    {
      Head: "Permission Name",
      FieldName: "PermissionName",
      ColumnType: "Data",
    },
    // { Head: "Created Date", FieldName: "CreatedDate", ColumnType: "Data" },
    { Head: "Status", FieldName: "Status", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  dataArray: any[] = [];

  tableData: any = [];
  

  // yearList = [
  //   { value: '', id: 0 }
  // ]

  //this is fake data, just for demo purpose
  // tableData = [
  //   // do this
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  // tableData1 = [
  //   // do this
  //   { 'Date': '2023-06-01', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-02', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-03', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-04', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-05', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-06', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-07', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-08', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-09', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  constructor(
    private breadcrumbService: BreadcrumbService,
    private notifierService: NgToastService,
    private locationMap: LocationMapService,
    private appService: AppService,
    private reportService: ReportService,
    private modalService: NgbModal,
    private alertService: MessageService,
    private shared: PermissionConfigurationService,
  ) {}

  ngOnInit(): void {
    //this.consumptionTableOptions.allowCheckbox = true;
    // this.consumptionTableOptions.allowGenerateButton = true;

    // this.nameOfOrganization = this.appService.appConfig[0].nameOfOrganization;
    // this.moduleName = this.appService.appConfig[0].moduleName;
    var platforms = this.appService.appConfig[0].roleList;
    for (let i = 0; i < platforms.length; i++) {
      this.platformList.push(platforms[i]);
    }

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

  // onAsseteTreeChanged(selectedItems: any[]): void {
  //   window.alert(selectedItems.map(x => x.unitName).join(", ") + " selected")
  // }

  loadData() {
    this.loadingInProgress = true;
    if (
      (this.serchedTerm == undefined ||
        this.serchedTerm == null ||
        this.serchedTerm == "") &&
      (this.selectedPermission == undefined ||
        this.selectedPermission == null ||
        this.selectedPermission == "All" ||
        this.selectedPermission == "")
    ) {
      this.getAllPermissions();
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedPermission == undefined ||
        this.selectedPermission == null ||
        this.selectedPermission == "All" ||
        this.selectedPermission == "")
    ) {
      this.searchPermissions(this.serchedTerm);
    } else {
      this.getAllPermissions();
      this.alertService.sideErrorAlert("Error", "Could not retrive data");
    } 
  }


  searchPermissions(serchedTerm: string) {
    this.shared
      .getSearchedPermissions(
        serchedTerm,
        this.selectedPage,
        this.selectedPageSize
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

          this.platformList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  getAllPermissions() {
    this.shared
    .getAllPermissions(this.selectedPage, this.selectedPageSize)
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
      PermissionCode: item.permissionId,
      PermissionName: item.permission1,
      //CreatedDate: item.createdDate,
      Status: item.status,
      isRejecteableOrApprovableRecord:true

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
    this.openModal("Add", "New Permission", "", "", "", "");
  }

  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Permission Details",
      row.PermissionCode,
      row.PermissionName,
      row.CreatedDate,
      row.Status
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Permission Details",
      row.PermissionCode,
      row.PermissionName,
      row.CreatedDate,
      row.Status
    );
  }

  openModal(
    type: string,
    modalTitle: string,
    permissionCode: string,
    permissionName: string,
    createdDate: string,
    status: string
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

    modalRef.componentInstance.permissionCode = permissionCode;
    modalRef.componentInstance.permissionName = permissionName;
    modalRef.componentInstance.createdDate = createdDate
    modalRef.componentInstance.status = status;

    modalRef.result
      .then((result) => {
        if (result) {
          console.log("Getting data from Role Configuration Modal");
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
                    permissionCode,
                    permissionName,
                    createdDate,
                    status
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Permission",
                    permissionCode,
                    permissionName,
                    createdDate,
                    status
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
            //second modal closed
          }
        } else {
          console.log("Data not submitted from add Role View Modal");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  putPermission(permission: Permission) {
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
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionAddedErrorSideAlertMessage
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
    if ($event.key === "Enter") {
      this.loadData();
    }
  }

  deletePermission(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.id);
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
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PermissionDeletedNotificationMessage,
          "Deleted!",
          4000
        );

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
      ids.push(element.id);
    });

    console.log(ids);

    this.activatePermission(ids);
  }

  deactivatePermissions(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.id);
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
            .RoleActivatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .RoleActivateNotificationMessage,
          "Actvated!",
          4000
        );

        this.loadData();
      },

      error: (error: any) => {
        console.log("Activating a Platform: error");
        console.log(error);
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleActivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deactivatePermission(ids: number[]): void {
    this.shared.deactivatePermissions(ids).subscribe({
      next: (response: any) => {
        console.log("Deactivating a Platform: ");
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .RoleDeactivatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .RoleDeactivateNotificationMessage,
          "Deactvated!",
          4000
        );

        this.loadData();
      },

      error: (error: any) => {
        console.log("Deactivating a Platform: error");
        console.log(error);
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleDeactivatedErrorSideAlertMessage
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

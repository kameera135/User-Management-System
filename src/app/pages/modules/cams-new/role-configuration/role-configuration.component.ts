import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgToastService } from "ng-angular-popup";
import { RoleConfigurationService } from "src/app/services/cams-new/configuration services/role-configuration.service";
import { AppService } from "src/app/app.service";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { LocationMapService } from "src/app/services/location-map.service";
import { ReportService } from "src/app/services/ReportServices/report.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PlatformConfigurationModalComponent } from "src/app/shared/widget/config/platform-configuration-modal/platform-configuration-modal.component";
import { UpdateConfirmationModalComponent } from "src/app/shared/widget/config/update-confirmation-modal/update-confirmation-modal.component";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { Role } from "src/app/shared/models/Cams-new/Role";
import { RoleConfigurationModalComponent } from "src/app/shared/widget/config/role-configuration-modal/role-configuration-modal.component";

@Component({
  selector: "app-role-configuration",
  templateUrl: "./role-configuration.component.html",
  styleUrls: ["./role-configuration.component.scss"],
})
export class RoleConfigurationComponent {

  loadingInProgress: boolean = false;
  loading: boolean = false;
  consumptionHistoryData: any[] = [];
  pageSize: any[] = [50];
  selectedPageSize: number = 20;

  searchTerm!: string;

  roleModel!: Role;
  roleList!: Role[];
  
  serchedTerm!: string;
  totalDataCount!: number;
  roleDetailsArray: any = []
  
  platformList: any[] = [{ value: "All", id: 1 }];
  selectedRole: string = "All";

  selectedPage: number = 1;

  tableData: any;
  
  roleConfigTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Role Code", FieldName: "RoleCode", ColumnType: "Data" },
    {
      Head: "Role Name",
      FieldName: "RoleName",
      ColumnType: "Data",
    },
    { Head: "Description", FieldName: "Description", ColumnType: "Data" },
    { Head: "Created Date", FieldName: "CreatedDate", ColumnType: "Data" },
    { Head: "Status", FieldName: "Status", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  // tableData = [
  //   {
  //     PlatformCode: "Code001",
  //     PlatformName: "PlatformL",
  //     Description: "This is description one",
  //     Status: "Active",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  //   {
  //     PlatformCode: "Code002",
  //     PlatformName: "PlatformM",
  //     Description: "This is description two",
  //     Status: "Active",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  //   {
  //     PlatformCode: "Code002",
  //     PlatformName: "PlatformM",
  //     Description: "This is description three",
  //     Status: "Active",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  // ];

  dataArray: any = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: RoleConfigurationService,
    private appService: AppService,
    private modalService: NgbModal,
    private alertService: MessageService

  ) {}

  ngOnInit(): void {
    var platforms = this.appService.appConfig[0].roleList;
    for (let i = 0; i < platforms.length; i++) {
      this.platformList.push(platforms[i]);
    }

    this.roleConfigTableOptions.allowCheckbox = true;
    this.roleConfigTableOptions.allowBulkDeleteButton = true;
    this.roleConfigTableOptions.allowDeleteButton = true;
    this.roleConfigTableOptions.allowUpdateButton = true;
    this.roleConfigTableOptions.allowViewButton = true;
    this.roleConfigTableOptions.allowActivateButton = true;
    this.roleConfigTableOptions.allowBulkActivateButton = true;
    this.roleConfigTableOptions.allowDeactivateButton = true;
    this.roleConfigTableOptions.allowBulkDeactivateButton = true;

    this.roleConfigTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateRoleConfirmationMessage;
    this.roleConfigTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteRoleConfirmationMessage;
    this.roleConfigTableOptions.recordApproveConfirmationMessage =
      this.appService.popUpMessageConfig[0].ActivateRoleConfirmationMessage;
    this.roleConfigTableOptions.recordRejectingConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeactivateRoleConfirmationMessage;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Roles", active: true },
    ]);

    this.loadData();
  }

  loadData() {
    this.loadingInProgress = true;
    if (
      (this.serchedTerm == undefined ||
        this.serchedTerm == null ||
        this.serchedTerm == "") &&
      (this.selectedRole == undefined ||
        this.selectedRole == null ||
        this.selectedRole == "All" ||
        this.selectedRole == "")
    ) {
      this.getAllRoles();
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedRole == undefined ||
        this.selectedRole == null ||
        this.selectedRole == "All" ||
        this.selectedRole == "")
    ) {
      this.searchRoles(this.serchedTerm);
    } else {
      this.getAllRoles();
      this.alertService.sideErrorAlert("Error", "Could not retrive data");
    } 
    // else if (
    //   (this.serchedTerm == undefined ||
    //     this.serchedTerm == null ||
    //     this.serchedTerm == "") &&
    //   (this.selectedRole != undefined ||
    //     this.selectedRole != null ||
    //     this.selectedRole != "All" ||
    //     this.selectedRole != "")
    // ){}
    // ) {
    //   this.getPlatformsByRole(this.serchedTerm);
    // } else if (
    //   (this.serchedTerm != undefined ||
    //     this.serchedTerm != null ||
    //     this.serchedTerm != "") &&
    //   (this.selectedRole != undefined ||
    //     this.selectedRole != null ||
    //     this.selectedRole != "All" ||
    //     this.selectedRole != "")
    // ) {
    //   this.searchPlatformsByRole(this.serchedTerm, this.selectedRole);
    // } else {
    //   this.getAllPlatforms();
    //   this.alertService.sideErrorAlert("Error", "Could not retrive data");
    // }
      
  }
  
  searchRoles(serchedTerm: string) {
    this.shared
      .getSearchedRoles(
        serchedTerm,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response: any) => {
          this.roleList = response.response;
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
            this.getAllRoles();
          }
        },
        error: (error: any) => {
          this.alertService.sideErrorAlert(
            "Error",
            this.appService.popUpMessageConfig[0]
              .GetPlatformListErrorSideAlertMessage
          );

          this.platformList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }


  getAllRoles() {
    this.shared
    .getAllRoles(this.selectedPage, this.selectedPageSize)
    .subscribe({
      next: (response) => {
        this.roleList = response.response;
        this.totalDataCount = response.rowCount;
        this.updateTable();
        this.loadingInProgress = false;
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetRoleListErrorSideAlertMessage
        );

        this.roleList = [];
        this.totalDataCount = 0;

        this.updateTable();
        this.loadingInProgress = false;
      },
    });
  }

  updateTable() {

    this.roleDetailsArray = this.roleList.map((item) => ({
      RoleCode: item.roleCode,
      RoleName: item.roleName,
      Description: item.description,
      CreatedDate: item.createdDate,
      Status: item.status,
      isRejecteableOrApprovableRecord:true

    }));
    this.tableData = this.roleDetailsArray;
    
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onAddRoleButtonClicked(): void {
    this.openModal("Add", "New Role", "", "", "", "","");
  }


  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Role Details",
      row.RoleCode,
      row.RoleName,
      row.Description,
      row.CreatedDate,
      row.Status
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Role Details",
      row.RoleCode,
      row.RoleName,
      row.Description,
      row.CreatedDate,
      row.Status
    );
  }


  openModal(
    type: string,
    modalTitle: string,
    roleCode: string,
    roleName: string,
    description: string,
    createdDate: string,
    status: string
  ): void {
    const modalRef = this.modalService.open(
      RoleConfigurationModalComponent,
      {
        size: "s",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.roleCode = roleCode;
    modalRef.componentInstance.roleName = roleName;
    modalRef.componentInstance.description = description;
    modalRef.componentInstance.createdDate = createdDate
    modalRef.componentInstance.status = status;

    modalRef.result
      .then((result) => {
        if (result) {
          console.log("Getting data from Role Configuration Modal");
          console.log(result);

          this.roleModel = result;
          if (type == "Add") {
            this.postRole(this.roleModel);
          } else if (type == "Edit") {
            this.putRole(this.roleModel);
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
              this.roleConfigTableOptions.rowEditConfirmationMessage;
            modalRefForConfirmation.result
              .then((result) => {
                if (result == "Yes") {
                  console.log("Confirmed to edit");
                  this.openModal(
                    "Edit",
                    "Edit Role Details",
                    roleCode,
                    roleName,
                    description,
                    createdDate,
                    status
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Role",
                    roleCode,
                    roleName,
                    description,
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

  putRole(role: any) {
    console.log("Add", role);
    this.shared.postRole(role).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PlatformAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PlatformAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PlatformAddedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  
  postRole(role: any) {
    console.log("Add", role);
    this.shared.postRole(role).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .RoleAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .RoleAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleAddedErrorSideAlertMessage
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

  // getDateTime() {
  //   var today = new Date();
  //   var date =
  //     today.getFullYear() +
  //     "-" +
  //     (today.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     today.getDate().toString().padStart(2, "0");
  //   var time =
  //     today.getHours().toString().padStart(2, "0") +
  //     ":" +
  //     today.getMinutes().toString().padStart(2, "0") +
  //     ":" +
  //     today.getSeconds().toString().padStart(2, "0");
  //   this.dateTime = date + " " + time;
  // }

  // downloadExcel() {
  //   var reportName =
  //     this.appService.appConfig[0].consumptionReportName[0]
  //       .consumption_history +
  //     ` ${this.selectedYear}-${this.selectedMonth.padStart(2, "0")} (${
  //       this.unitCode
  //     })`;
  //   //var sheetName = `${this.unitName}`;
  //   var sheetName =
  //     this.appService.appConfig[0].consumptionSheetName[0].consumption_history;

  //   var headArray = this.reportHeadArray;

  //   var arrayOfArrayData = [
  //     [this.nameOfOrganization + " - " + this.moduleName],
  //     [],
  //     ["Consumption History Report"],
  //     [],
  //     ["Unit Id", `${this.unitId}`],
  //     ["Unit Name", `${this.unitName}`],
  //     ["Year and Month", `${this.selectedYear} - ${this.reportMonth}`],
  //     [],
  //     headArray,
  //   ];

  //   for (var i = 0; i < this.tableData.length; i++) {
  //     var rowData: any = [
  //       this.tableData[i].Date,
  //       this.tableData[i].Water,
  //       this.tableData[i].Electricity,
  //       this.tableData[i].AC,
  //       this.tableData[i].Gas,
  //     ];

  //     rowData = rowData.filter((value: any) => value !== undefined);

  //     arrayOfArrayData.push(rowData);
  //   }

  //   this.getDateTime();
  //   arrayOfArrayData.push([], ["Generated At : " + `${this.dateTime}`]);
  //   console.log("dd", arrayOfArrayData);

  //   this.reportService.generateExcelFile(
  //     arrayOfArrayData,
  //     sheetName,
  //     reportName
  //   );
  // }

  deleteRoles(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.id);
    });

    this.removeRoles(ids);
  }

  removeRoles(ids: number[]): void {
    this.shared.deleteRoles(ids).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .RoleDeletedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .RoleDeletedNotificationMessage,
          "Deleted!",
          4000
        );

        this.loadData();
      },

      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleDeletedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  activateRoles(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.id);
    });

    console.log(ids);

    this.activateRole(ids);
  }

  deactivateRoles(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.id);
    });

    console.log(ids);

    this.deactivateRole(ids);
  }

  activateRole(ids: number[]): void {
    this.shared.activateRoles(ids).subscribe({
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

  deactivateRole(ids: number[]): void {
    this.shared.deactivateRoles(ids).subscribe({
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
}

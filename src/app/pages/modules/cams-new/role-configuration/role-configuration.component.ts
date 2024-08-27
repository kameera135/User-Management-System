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
  selectedPageSize: number = 50;

  searchTerm!: string;

  roleModel!: Role;
  roleList!: Role[];
  
  serchedTerm!: string;
  totalDataCount!: number;
  roleDetailsArray: any = []
  
  platformListDefault: any[] = [{ value: "All Platforms", id: "0" }];
  platformList: any[] = [];

  selectedRole: string = "All";

  selectedPage: number = 1;
  selectedPlatform!: number;

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
    {
      Head: "Platform Name",
      FieldName: "PlatformName",
      ColumnType: "Data",
    },
    // { Head: "Description", FieldName: "Description", ColumnType: "Data" },
    // { Head: "Created Date", FieldName: "CreatedDate", ColumnType: "Data" },
    { Head: "Status", FieldName: "StatusName", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  dataArray: any = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: RoleConfigurationService,
    private appService: AppService,
    private modalService: NgbModal,
    private alertService: MessageService

  ) {}

  ngOnInit(): void {
    this.roleConfigTableOptions.allowCheckbox = true;
    this.roleConfigTableOptions.allowBulkDeleteButton = true;
    this.roleConfigTableOptions.allowDeleteButton = true;
    this.roleConfigTableOptions.allowUpdateButton = true;
    this.roleConfigTableOptions.allowViewButton = true;
    this.roleConfigTableOptions.allowActivateButton = true;
    this.roleConfigTableOptions.allowBulkActivateButton = true;
    this.roleConfigTableOptions.allowDeactivateButton = true;
    this.roleConfigTableOptions.allowBulkDeactivateButton = true;
    this.roleConfigTableOptions.displayPagination = true;

    //show permission view button
    this.roleConfigTableOptions.allowToViewPermissions = true;

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

    this.getPlatformList();

  }

  loadData() {
    this.loadingInProgress = true;
    if (
      (this.searchTerm == undefined ||
      this.searchTerm == null ||
      this.searchTerm == "") &&
      (this.selectedPlatform == undefined ||
        this.selectedPlatform == null ||
        this.selectedPlatform == 0)
    ) {
      this.getAllRoles();
    } else if (
      (this.searchTerm != undefined ||
      this.searchTerm != null ||
      this.searchTerm != "") &&
      (this.selectedPlatform == undefined ||
        this.selectedPlatform == null ||
        this.selectedPlatform == 0)
    ) {
      this.searchRoles(this.searchTerm);
    } else if (
      (this.searchTerm == undefined ||
        this.searchTerm == null ||
        this.searchTerm == "") &&
      (this.selectedPlatform != undefined ||
        this.selectedPlatform != null ||
        this.selectedPlatform != 0)
    ) {
      this.getUsersByPlatform(this.selectedPlatform);
    } else if (
      (this.searchTerm != undefined ||
        this.searchTerm != null ||
        this.searchTerm != "") &&
      (this.selectedPlatform != undefined ||
        this.selectedPlatform != null ||
        this.selectedPlatform != 0)
    ) {
      this.searchUsersByPlatform(this.searchTerm, this.selectedPlatform);
     } else {
      this.getAllRoles();
      this.alertService.sideErrorAlert(
        "Error",
        this.appService.popUpMessageConfig[0]
          .CouldNotRetriveDataErrorSideAlertMessage
      );
    }
  }

  onPlatformSelect() {
    this.selectedPage = 1;
    this.loadData();
  }


  searchUsersByPlatform(searchedTerm: string, platformId: number) {
    this.shared
      .getSearchedRolesByPlatform(
        searchedTerm,
        platformId,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response) => {
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
            this.searchTerm = "";
            this.loadData();
          }
        },
        error: (error) => {
          this.alertService.sideErrorAlert(
            "Error",
            this.appService.popUpMessageConfig[0]
              .GetUserListErrorSideAlertMessage
          );

          this.roleList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }


  getUsersByPlatform(platformId: number) {
    this.shared
      .getUsersByPlatform(platformId, this.selectedPage, this.selectedPageSize)
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
              .GetUserListErrorSideAlertMessage
          );

          this.roleList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  getSearchTerm($event: KeyboardEvent) {
    this.selectedPage = 1;
    if ($event.key === "Enter" || this.searchTerm === "" ) {
      this.loadData();
    }
  }

  searchOnClick() {
    this.loadData();
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
            this.searchTerm = "";
            this.loadData();
          }
        },
        error: (error: any) => {
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
      RoleCode: item.roleId,
      RoleName: item.role,
      PlatformName: item.platform,
      PlatformId: item.platformId,
      // Description: item.description,
      CreatedDate:  item.createdAt ? item.createdAt.slice(0, 10) : null,
      StatusName: item.status ? "Activated" : "Deactivated",
      Status: item.status,
      PermissionIds: item.permissionIds,
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
    this.openModal("Add", "New Role", "", "", "", "","","",true,0);
  }

  onViewPermissionButtonClicked(row: any) {
    this.openModal(
      "Permission",
      "Assign Permissions",
      row.RoleCode,
      row.RoleName,
      row.PlatformId,
      row.PlatformName,
      "",
      "",
      row.Status,
      row.permissionIds
    );
  }


  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Role Details",
      row.RoleCode,
      row.RoleName,
      row.PlatformId,
      row.PlatformName,
      row.CreatedDate,
      row.StatusName,
      row.Status,
      0
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Role Details",
      row.RoleCode,
      row.RoleName,
      row.PlatformId,
      row.PlatformName,
      row.CreatedDate,
      row.StatusName,
      row.Status,
      0
    );
  }


  openModal(
    type: string,
    modalTitle: string,
    roleCode: string,
    roleName: string,
    platformId: string,
    platformName:string,
    //description: string,
    createdDate: string,
    statusName: string,
    status:boolean,
    permissionIds:number,
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
    modalRef.componentInstance.platformId = platformId;
    modalRef.componentInstance.platformName = platformName;
    modalRef.componentInstance.createdDate = createdDate
    modalRef.componentInstance.status = status;
    modalRef.componentInstance.statusName = statusName;
    modalRef.componentInstance.permissionIds = permissionIds;

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
          }else if(type == "Permission"){
            //this.assignPermissionsForRoles(this.roleModel);
          } 
          else if (type == "View") {
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
                    platformId,
                    platformName,
                    createdDate,
                    statusName,
                    status,
                    0
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Role",
                    roleCode,
                    roleName,
                    platformId,
                    platformName,
                    createdDate,
                    statusName,
                    status,
                    0
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

  putRole(role: Role) {
    console.log("Add", role);
    this.shared.putRole(role).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .RoleUpdatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .RoleUpdatedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        console.log(error);
        if (error.error) {
          this.alertService.warningSweetAlertMessage(
              error.error.errorDetails, 
              "Error!",
              4000
          );
        }

        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleUpdatedErrorSideAlertMessage
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
          "Added!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        if (error.error && error.error.errorDetails) {
          this.alertService.warningSweetAlertMessage(
              error.error.errorDetails, // Use error.error.errorDetails for the specific error message
              "Error!",
              4000
          );
        }
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .RoleAddedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deleteRoles(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.RoleCode);
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

        if(ids.length > 1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RolesDeletedNotificationMessage,
            "Deleted!",
            4000
          );
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RoleDeletedNotificationMessage,
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
            .RoleDeletedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  activateRoles(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.RoleCode);
    });

    console.log(ids);

    this.activateRole(ids);
  }

  deactivateRoles(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.RoleCode);
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

        if(ids.length > 1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RolesActivateNotificationMessage,
            "Activated!",
            4000
          );
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RoleActivateNotificationMessage,
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

        if(ids.length>1){
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RolesDeactivateNotificationMessage,
            "Deactivated!",
            4000
          );  
        }
        else{
          this.alertService.successSweetAlertMessage(
            this.appService.popUpMessageConfig[0]
              .RoleDeactivateNotificationMessage,
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
            .RoleDeactivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  getPlatformList() {
    this.shared.getPlatformList().subscribe({
      next: (response: any) => {
        this.platformList = response;

        var platforms = this.platformList;
        for (let i = 0; i < platforms.length; i++) {
          this.platformListDefault.push(platforms[i]);
        }
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetPlatformComboboxListErrorSideAlertMessage
        );
      },
    });
  }
}

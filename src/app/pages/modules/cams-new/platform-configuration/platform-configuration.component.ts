import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PlatformConfigurationService } from "src/app/services/cams-new/configuration services/platform-configuration.service";
import { AppService } from "src/app/app.service";
import { Platform } from "src/app/shared/models/Cams-new/Platform";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { PlatformConfigurationModalComponent } from "src/app/shared/widget/config/platform-configuration-modal/platform-configuration-modal.component";
import { UpdateConfirmationModalComponent } from "src/app/shared/widget/config/update-confirmation-modal/update-confirmation-modal.component";

@Component({
  selector: "app-platform-configuration",
  templateUrl: "./platform-configuration.component.html",
  styleUrls: ["./platform-configuration.component.scss"],
})
export class PlatformConfigurationComponent {
  loadingInProgress: boolean = false;

  platformModel!: Platform;
  platformList!: Platform[];
  platformDetailsArray: any = [];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  searchTerm!: string;

  roleList: any[] = [{ value: "All", id: 1 }];
  selectedRole: string = "All";

  platformUpdatedNotificationMessage!: string;

  serchedTerm!: string;

  platformConfigTableOptions: tableOptions = new tableOptions();

  tableData: any;

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Platform Code", FieldName: "PlatformCode", ColumnType: "Data" },
    {
      Head: "Platform Name",
      FieldName: "PlatformName",
      ColumnType: "Data",
    },
    { Head: "Description", FieldName: "Description", ColumnType: "Data" },
    { Head: "Status", FieldName: "Status", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  //to remove
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

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: PlatformConfigurationService,
    private modalService: NgbModal,
    private appService: AppService,
    private alertService: MessageService
  ) {}

  ngOnInit(): void {
    var roles = this.appService.appConfig[0].roleList;
    for (let i = 0; i < roles.length; i++) {
      this.roleList.push(roles[i]);
    }

    this.platformConfigTableOptions.allowCheckbox = true;
    this.platformConfigTableOptions.allowBulkDeleteButton = true;
    this.platformConfigTableOptions.allowDeleteButton = true;
    this.platformConfigTableOptions.allowUpdateButton = true;
    this.platformConfigTableOptions.allowViewButton = true;
    this.platformConfigTableOptions.allowActivateButton = true;
    this.platformConfigTableOptions.allowBulkActivateButton = true;
    this.platformConfigTableOptions.allowDeactivateButton = true;
    this.platformConfigTableOptions.allowBulkDeactivateButton = true;
    
    //for display paginations. It is not default.
    this.platformConfigTableOptions.displayPagination = true;

    //for show users in respective platforms
    this.platformConfigTableOptions.allowToViewPlatformUsers = true;


    this.platformConfigTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdatePlatformConfirmationMessage;
    this.platformConfigTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeletePlatformConfirmationMessage;
    this.platformConfigTableOptions.recordApproveConfirmationMessage =
      this.appService.popUpMessageConfig[0].ActivatePlatformConfirmationMessage;
    this.platformConfigTableOptions.recordRejectingConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeactivatePlatformConfirmationMessage;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Platforms", active: true },
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
      this.getAllPlatforms();
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedRole == undefined ||
        this.selectedRole == null ||
        this.selectedRole == "All" ||
        this.selectedRole == "")
    ) {
      this.searchPlatforms(this.serchedTerm);
    } else if (
      (this.serchedTerm == undefined ||
        this.serchedTerm == null ||
        this.serchedTerm == "") &&
      (this.selectedRole != undefined ||
        this.selectedRole != null ||
        this.selectedRole != "All" ||
        this.selectedRole != "")
    ) {
      this.getPlatformsByRole(this.serchedTerm);
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedRole != undefined ||
        this.selectedRole != null ||
        this.selectedRole != "All" ||
        this.selectedRole != "")
    ) {
      this.searchPlatformsByRole(this.serchedTerm, this.selectedRole);
    } else {
      this.getAllPlatforms();
      this.alertService.sideErrorAlert("Error", "Could not retrive data");
    }
  }

  updateTable() {
    this.platformDetailsArray = this.platformList.map((item) => ({
      PlatformCode: item.platformCode,
      PlatformName: item.platformName,
      Description: item.description,
      Status: item.status,
      isRejecteableOrApprovableRecord:true
    }));
    this.tableData = this.platformDetailsArray;
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onAddPlatformButtonClicked(): void {
    this.openModal("Add", "New Platform", "", "", "", "");
  }

  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Platform Details",
      row.PlatformCode,
      row.PlatformName,
      row.Description,
      row.Status
    );
  }


  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Platform Details",
      row.PlatformCode,
      row.PlatformName,
      row.Description,
      row.Status
    );
  }

  
  openModal(
    type: string,
    modalTitle: string,
    platformCode: string,
    platformName: string,
    description: string,
    status: string
  ): void {
    const modalRef = this.modalService.open(
      PlatformConfigurationModalComponent,
      {
        size: "s",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.platformCode = platformCode;
    modalRef.componentInstance.platformName = platformName;
    modalRef.componentInstance.description = description;
    modalRef.componentInstance.status = status;

    modalRef.result
      .then((result) => {
        if (result) {
          console.log("Getting data from Platform Configuration Modal");
          console.log(result);

          this.platformModel = result;
          if (type == "Add") {
            this.postPlatform(this.platformModel);
          } else if (type == "Edit") {
            this.putPlatform(this.platformModel);
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
              this.platformConfigTableOptions.rowEditConfirmationMessage;
            modalRefForConfirmation.result
              .then((result) => {
                if (result == "Yes") {
                  console.log("Confirmed to edit");
                  this.openModal(
                    "Edit",
                    "Edit Platform Details",
                    platformCode,
                    platformName,
                    description,
                    status
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Platform",
                    platformCode,
                    platformName,
                    description,
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
          console.log("Data not submitted from add Platform View Modal");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getSearchTerm($event: KeyboardEvent) {
    this.selectedPage = 1;
    if ($event.key === "Enter") {
      this.loadData();
    }
  }

  getAllPlatforms() {
    this.shared
      .getAllPlatforms(this.selectedPage, this.selectedPageSize)
      .subscribe({
        next: (response) => {
          this.platformList = response.response;
          this.totalDataCount = response.rowCount;
          this.updateTable();
          this.loadingInProgress = false;
        },
        error: (error) => {
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

  getPlatformsByRole(role: string) {
    this.shared
      .getPlatformsByRole(role, this.selectedPage, this.selectedPageSize)
      .subscribe({
        next: (response: any) => {
          this.platformList = response.response;
          this.totalDataCount = response.rowCount;
          this.updateTable();
          this.loadingInProgress = false;
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

  searchPlatforms(serchedTerm: string) {
    this.shared
      .getSearchedPlatforms(
        serchedTerm,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response: any) => {
          this.platformList = response.response;
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
            this.getAllPlatforms();
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

  searchPlatformsByRole(serchedTerm: string, role: string) {
    this.shared
      .getSearchedPlatformsByRole(
        serchedTerm,
        role,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response: any) => {
          this.platformList = response.response;
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
            this.getAllPlatforms();
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

  postPlatform(platform: any) {
    console.log("Add", platform);
    this.shared.postPlatform(platform).subscribe({
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

  putPlatform(platform: Platform): void {
    console.log("Edit", platform);
    this.shared.putPlatform(platform).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PlatformUpdatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PlatformUpdatedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PlatformUpdatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deletePlatforms(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.id);
    });

    this.removeplatforms(ids);
  }

  removeplatforms(ids: number[]): void {
    this.shared.deletePlatform(ids).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PlatformDeletedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PlatformDeletedNotificationMessage,
          "Deleted!",
          4000
        );

        this.loadData();
      },

      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PlatformDeletedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  activatePlatforms(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.id);
    });

    console.log(ids);

    this.activatePlatform(ids);
  }

  deactivatePlatforms(items: any): void {
    let ids: number[] = [];

    items[0].forEach((element: any) => {
      ids.push(element.id);
    });

    console.log(ids);

    this.deactivatePlatform(ids);
  }

  activatePlatform(ids: number[]): void {
    this.shared.activatePlatform(ids).subscribe({
      next: (response: any) => {
        console.log("Activating a Platform: ");
        console.log(response);
        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PlatformActivatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PlatformActivateNotificationMessage,
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
            .PlatformActivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deactivatePlatform(ids: number[]): void {
    this.shared.deactivatePlatform(ids).subscribe({
      next: (response: any) => {
        console.log("Deactivating a Platform: ");
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .PlatformDeactivatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .PlatformDeactivateNotificationMessage,
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
            .PlatformDeactivatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }
}

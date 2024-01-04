import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';
import { MessageService } from 'src/app/services/PopupMessages/message.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb/breadcrumb.service';
import { SystemTokensService } from 'src/app/services/cams-new/system-tokens.service';
import { SystemToken } from 'src/app/shared/models/Cams-new/SystemToken';
import { tableOptions } from 'src/app/shared/models/tableOptions';
import { SystemTokenModalComponent } from 'src/app/shared/widget/config/system-token-modal/system-token-modal/system-token-modal.component';
import { UpdateConfirmationModalComponent } from 'src/app/shared/widget/config/update-confirmation-modal/update-confirmation-modal.component';

@Component({
  selector: "app-system-tokens",
  templateUrl: "./system-tokens.component.html",
  styleUrls: ["./system-tokens.component.scss"],
})
export class SystemTokensComponent {

  loadingInProgress: boolean = false;
  loading: boolean = false;
  consumptionHistoryData: any[] = [];
  pageSize: any[] = [50];
  selectedPageSize: number = 20;

  searchTerm!: string;

  tokenModel!: SystemToken;
  tokenList!: SystemToken[];
  tokenDetailsArray: any = []

  serchedTerm!: string;
  totalDataCount!: number;
  roleDetailsArray: any = []
  
  platformList: any[] = [{ value: "All", id: 1 }];
  selectedRole: string = "All";

  selectedPage: number = 1;

  tableData: any;
  dataArray: any = [];
  
  tokenConfigTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Id", FieldName: "Id", ColumnType: "Data" },
    {
      Head: "Token",
      FieldName: "Token",
      ColumnType: "Data",
    },
    { Head: "Created Date", FieldName: "CreatedDate", ColumnType: "Data" },
    { Head: "Expire Date", FieldName: "ExpireDate", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];


  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: SystemTokensService,
    private appService: AppService,
    private modalService: NgbModal,
    private alertService: MessageService

  ) {}

  ngOnInit(): void {
    // var platforms = this.appService.appConfig[0].roleList;
    // for (let i = 0; i < platforms.length; i++) {
    //   this.platformList.push(platforms[i]);
    // }

    this.tokenConfigTableOptions.allowCheckbox = true;
    this.tokenConfigTableOptions.allowBulkDeleteButton = true;
    this.tokenConfigTableOptions.allowDeleteButton = true;
    this.tokenConfigTableOptions.allowUpdateButton = true;
    this.tokenConfigTableOptions.allowViewButton = true;
    // this.tokenConfigTableOptions.allowActivateButton = true;
    // this.tokenConfigTableOptions.allowBulkActivateButton = true;
    // this.tokenConfigTableOptions.allowDeactivateButton = true;
    // this.tokenConfigTableOptions.allowBulkDeactivateButton = true;
    this.tokenConfigTableOptions.displayPagination = true;

    this.tokenConfigTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateTokenConfirmationMessage;
    this.tokenConfigTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteTokenConfirmationMessage;
    

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Tokens", active: false },
      { label: "API Tokens", active: true },
    ]);

    this.loadData();
  }

  loadData() {
    this.loadingInProgress = true;
    // if (
    //   (this.serchedTerm == undefined ||
    //     this.serchedTerm == null ||
    //     this.serchedTerm == "") &&
    //   (this.selectedRole == undefined ||
    //     this.selectedRole == null ||
    //     this.selectedRole == "All" ||
    //     this.selectedRole == "")
    // ) {
    //   this.getAllRoles();
    // } else if (
    //   (this.serchedTerm != undefined ||
    //     this.serchedTerm != null ||
    //     this.serchedTerm != "") &&
    //   (this.selectedRole == undefined ||
    //     this.selectedRole == null ||
    //     this.selectedRole == "All" ||
    //     this.selectedRole == "")
    // ) {
    //   this.searchRoles(this.serchedTerm);
    // } else {
    //   this.getAllRoles();
    //   this.alertService.sideErrorAlert("Error", "Could not retrive data");
    // } 
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
       this.getAllTokens();
    //   this.alertService.sideErrorAlert("Error", "Could not retrive data");
    // }
      
  }
  
  searchTokens(serchedTerm: string) {
    this.shared
      .getSearchedTokens(
        serchedTerm,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response: any) => {
          this.tokenList = response.response;
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
            this.getAllTokens();
          }
        },
        error: (error: any) => {
          this.alertService.sideErrorAlert(
            "Error",
            this.appService.popUpMessageConfig[0]
              .GetTokenListErrorSideAlertMessage
          );

          this.tokenList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }


  getAllTokens() {
    this.shared
    .getAllTokens(this.selectedPage, this.selectedPageSize)
    .subscribe({
      next: (response) => {
        this.tokenList = response.response;
        this.totalDataCount = response.rowCount;
        this.updateTable();
        this.loadingInProgress = false;
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetTokenListErrorSideAlertMessage
        );

        this.tokenList = [];
        this.totalDataCount = 0;

        this.updateTable();
        this.loadingInProgress = false;
      },
    });
  }

  updateTable() {

    this.tokenDetailsArray = this.tokenList.map((item) => ({
      Id: item.id,
      Token: item.token,
      CreatedDate: item.createdDate,
      ExpireDate: item.expireDate,
      isRejecteableOrApprovableRecord:true

    }));
    this.tableData = this.tokenDetailsArray;
    
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onAddTokenButtonClicked(): void {
    this.openModal("Add", "New Token", "", "", "", "");
  }


  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit Role Details",
      row.Id,
      row.Token,
      row.CreatedDate,
      row.ExpireDate,
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Role Details",
      row.Id,
      row.Token,
      row.CreatedDate,
      row.ExpireDate,
    );
  }


  openModal(
    type: string,
    modalTitle: string,
    id: string,
    token: string,
    createdDate: string,
    expireDate: string,
  ): void {
    const modalRef = this.modalService.open(
      SystemTokenModalComponent,
      {
        size: "s",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.id = id;
    modalRef.componentInstance.token = token;
    modalRef.componentInstance.createdDate = createdDate
    modalRef.componentInstance.expireDate = expireDate;

    modalRef.result
      .then((result) => {
        if (result) {
          // console.log("Getting data from Role Configuration Modal");
          console.log(result);

          this.tokenModel = result;
          if (type == "Add") {
            this.postToken(this.tokenModel);
          } else if (type == "Edit") {
            this.putToken(this.tokenModel);
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
              this.tokenConfigTableOptions.rowEditConfirmationMessage;
            modalRefForConfirmation.result
              .then((result) => {
                if (result == "Yes") {
                  console.log("Confirmed to edit");
                  this.openModal(
                    "Edit",
                    "Edit Role Details",
                    id,
                    token,
                    createdDate,
                    expireDate
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "Token",
                    id,
                    token,
                    createdDate,
                    expireDate
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

  putToken(token: any) {
    console.log("Add", token);
    this.shared.postToken(token).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .TokenAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .TokenAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .TokenAddedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  
  postToken(token: any) {
    console.log("Add", token);
    this.shared.postToken(token).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .TokenAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .TokenAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .TokenAddedErrorSideAlertMessage
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

  deleteTokens(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.id);
    });

    this.removeTokens(ids);
  }

  removeTokens(ids: number[]): void {
    this.shared.deleteToken(ids).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .TokenDeletedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .TokenDeletedNotificationMessage,
          "Deleted!",
          4000
        );

        this.loadData();
      },

      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .TokenDeletedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  // activateRoles(items: any): void {
  //   let ids: number[] = [];

  //   items[0].forEach((element: any) => {
  //     ids.push(element.id);
  //   });

  //   console.log(ids);

  //   this.activateRole(ids);
  // }

  // deactivateRoles(items: any): void {
  //   let ids: number[] = [];

  //   items[0].forEach((element: any) => {
  //     ids.push(element.id);
  //   });

  //   console.log(ids);

  //   this.deactivateRole(ids);
  // }

  // activateRole(ids: number[]): void {
  //   this.shared.activateRoles(ids).subscribe({
  //     next: (response: any) => {
  //       console.log("Activating a Platform: ");
  //       console.log(response);
  //       this.alertService.sideSuccessAlert(
  //         "Success",
  //         this.appService.popUpMessageConfig[0]
  //           .RoleActivatedSuccessSideAlertMessage
  //       );
  //       this.alertService.successSweetAlertMessage(
  //         this.appService.popUpMessageConfig[0]
  //           .RoleActivateNotificationMessage,
  //         "Actvated!",
  //         4000
  //       );

  //       this.loadData();
  //     },

  //     error: (error: any) => {
  //       console.log("Activating a Platform: error");
  //       console.log(error);
  //       this.alertService.sideErrorAlert(
  //         "Error",
  //         this.appService.popUpMessageConfig[0]
  //           .RoleActivatedErrorSideAlertMessage
  //       );
  //       //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
  //     },
  //   });
  // }

  // deactivateRole(ids: number[]): void {
  //   this.shared.deactivateRoles(ids).subscribe({
  //     next: (response: any) => {
  //       console.log("Deactivating a Platform: ");
  //       console.log(response);

  //       this.alertService.sideSuccessAlert(
  //         "Success",
  //         this.appService.popUpMessageConfig[0]
  //           .RoleDeactivatedSuccessSideAlertMessage
  //       );
  //       this.alertService.successSweetAlertMessage(
  //         this.appService.popUpMessageConfig[0]
  //           .RoleDeactivateNotificationMessage,
  //         "Deactvated!",
  //         4000
  //       );

  //       this.loadData();
  //     },

  //     error: (error: any) => {
  //       console.log("Deactivating a Platform: error");
  //       console.log(error);
  //       this.alertService.sideErrorAlert(
  //         "Error",
  //         this.appService.popUpMessageConfig[0]
  //           .RoleDeactivatedErrorSideAlertMessage
  //       );
  //       //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
  //     },
  //   });
  // }

}

import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  selectedPageSize: number = 20;

  searchTerm!: string;

  tokenModel!: SystemToken;
  tokenList!: SystemToken[];
  tokenDetailsArray: any = []

  totalDataCount!: number;
  roleDetailsArray: any = []
  
  platformList: any[] = [{ value: "All", id: 1 }];
  selectedRole: string = "All";

  selectedPage: number = 1;

  tableData: any;
  dataArray: any = [];

  //For date time picker
  firstDate: Date = new Date();
  lastDate: Date = new Date(new Date().getTime() + 86400000);
  model_from!: NgbDateStruct;
  model_to!: NgbDateStruct;
  initialFromDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate() - 1,
  };
  initialToDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  placement = "bottom";

  thisMonth: string = (new Date().getMonth() + 1).toString();
  thisYear: string = new Date().getFullYear().toString();
  yearList: any[] = [];
  monthList: any[] = [];
  
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

    this.model_from = this.initialFromDate;
    this.model_to = this.initialToDate;

    this.tokenConfigTableOptions.allowCheckbox = true;
    this.tokenConfigTableOptions.allowBulkDeleteButton = true;
    this.tokenConfigTableOptions.allowDeleteButton = true;
    this.tokenConfigTableOptions.allowUpdateButton = true;
    this.tokenConfigTableOptions.displayPagination = true;

    this.tokenConfigTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateTokenConfirmationMessage;
    this.tokenConfigTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteTokenConfirmationMessage;

      const currentYear = new Date().getFullYear();
      this.yearList = Array.from(
        { length: this.appService.appConfig[0].maximumYearRange },
        (_, index) => {
          const year = currentYear - index;
          return { value: year.toString(), id: index + 1 };
        }
      );
  
      this.monthList = this.appService.appConfig[0].months;
    

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Tokens", active: false },
      { label: "API Tokens", active: true },
    ]);

    this.loadData();
  }

  loadData() {
    this.loadingInProgress = true;
    if (
      this.firstDate == undefined ||
      this.firstDate == null &&
      this.lastDate == undefined ||
      this.lastDate == null
    ) {
      this.getAllTokens();
    } else if (
      this.firstDate != undefined ||
      this.firstDate != null &&
      this.lastDate != undefined ||
      this.lastDate != null
    ) {
      this.searchTokens(this.firstDate, this.lastDate);
    } else {
      this.getAllTokens();
      this.alertService.sideErrorAlert("Error", "Could not retrive data");
    }
  }
  
  searchTokens(firstDate: Date, lastDate: Date) {
    this.shared
      .getSearchedTokens(
        firstDate,
        lastDate,
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
      Id: item.tokenId,
      Token: item.token,
      CreatedDate: item.createdAt ? item.createdAt.slice(0, 10) : null,
      ExpireDate: item.expireDate ? item.expireDate.slice(0,10) : null,
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
      "Edit Token",
      row.Id,
      row.Token,
      row.CreatedDate,
      row.ExpireDate,
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "Token Details",
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

    let modalSize = "s";
    if (type === "Add" || type === 'Edit') {
      modalSize = "lg";
    }

    const modalRef = this.modalService.open(
      SystemTokenModalComponent,
      {
        size:modalSize,
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
    this.shared.putToken(token).subscribe({
      next: (response: any) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .TokenUpdatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0]
            .TokenUpdatedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .TokenUpdatedErrorSideAlertMessage
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

  onFromDateClicked() {
    this.firstDate = this.convertToObjectToDate(this.model_from);
    this.lastDate = this.convertToObjectToDate(this.model_to);

    if (this.firstDate >= this.lastDate) {
      this.model_from = this.initialFromDate;
      this.model_to = this.initialToDate;
      this.firstDate = this.convertToObjectToDate(this.model_from);
      this.lastDate = this.convertToObjectToDate(this.model_to);

      this.alertService.sideErrorAlert("Error", "Select a valid date");
    }

    this.loadData();
  }

  onToDateClicked() {
    this.firstDate = this.convertToObjectToDate(this.model_from);
    this.lastDate = this.convertToObjectToDate(this.model_to);
    if (this.firstDate >= this.lastDate) {
      this.model_from = this.initialFromDate;
      this.model_to = this.initialToDate;
      this.firstDate = this.convertToObjectToDate(this.model_from);
      this.lastDate = this.convertToObjectToDate(this.model_to);

      this.alertService.sideErrorAlert("Error", "Select a valid date range");
    }

    this.loadData();
  }

  //"2024-01-17T02:56:10.733 -> Jan 17, 2024, 2:56:10 AM
  convertDateFormat(inputDate: string): string {
    const inputDateTime = new Date(inputDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const year = inputDateTime.getFullYear();
    const month = monthNames[inputDateTime.getMonth()];
    const day = inputDateTime.getDate();
    const hours = inputDateTime.getHours();
    const minutes = inputDateTime.getMinutes();
    const seconds = inputDateTime.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedDate = `${month} ${day}, ${year}, ${
      hours % 12 || 12
    }:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )} ${ampm}`;

    return formattedDate;
  }

  convertToObjectToDate(dateObject: {
    year: number;
    month: number;
    day: number;
  }): Date {
    const { year, month, day } = dateObject;

    const jsDate = new Date(year, month - 1, day);

    return jsDate;
  }

  deleteTokens(items: any): void {
    let ids: number[] = [];

    items.forEach((element: any) => {
      ids.push(element.Id);
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
}

import { Component, inject } from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { ReportService } from "src/app/services/ReportServices/report.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { ActivityLogData } from "src/app/shared/models/Cams-new/ActivityLogData";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { ActivityLogsModalComponent } from "src/app/shared/widget/config/activity-logs-modal/activity-logs-modal.component";

@Component({
  selector: "app-activity-logs",
  templateUrl: "./activity-logs.component.html",
  styleUrls: ["./activity-logs.component.scss"],
})
export class ActivityLogsComponent {
  loadingInProgress: boolean = false;

  selectedYear!: string;
  selectedMonth!: string;
  selectedMonthName!: string;
  thisMonth: string = (new Date().getMonth() + 1).toString();
  thisYear: string = new Date().getFullYear().toString();
  yearList: any[] = [];
  monthList: any[] = [];

  activityLogList!: ActivityLogData[];
  activityLogsArray: any = [];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  searchTerm!: string;

  roleList: any[] = [];
  selectedRole!: any;
  platformList: any[] = [];
  userList: any[] = [];
  selectedPlatform!: number;
  selectedUser!: number;

  UserUpdatedNotificationMessage!: string;

  userListDefault: any[] = [{ value: "All Users", id: "0" }];
  platformListDefault: any[] = [{ value: "All Platforms", id: "0" }];
  roleListDefault: any[] = [{ value: "All Roles", id: "0" }];

  isInitialized: boolean = false;

  exportDateTime!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "Log Id", FieldName: "LogId", ColumnType: "Data" },
    { Head: "Username", FieldName: "UserName", ColumnType: "Data" },
    { Head: "Platform", FieldName: "PlatformName", ColumnType: "Data" },
    { Head: "Role", FieldName: "RoleName", ColumnType: "Data" },
    { Head: "Activity Type", FieldName: "ActivityType", ColumnType: "Data" },
    { Head: "Description", FieldName: "Description", ColumnType: "Data" },
    { Head: "Time", FieldName: "CreatedAt", ColumnType: "Data" },
    { Head: "Actions", FieldName: "", ColumnType: "Action" },
  ];

  tableData: any = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: ActivityLogsService,
    private modalService: NgbModal,
    private appService: AppService,
    private alertService: MessageService,
    private reportService: ReportService
  ) {
    const today = new Date();
  }

  model_from!: NgbDateStruct;
  model_to!: NgbDateStruct;
  placement = "bottom";
  firstDate: Date = new Date();
  lastDate: Date = new Date(new Date().getTime() - 86400000);

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

  ngOnInit(): void {
    this.usersViewTableOptions.allowExportButton = true;

    this.model_from = this.initialFromDate;

    this.model_to = this.initialToDate;

    this.getPlatformList();
    this.getUserList();

    const currentYear = new Date().getFullYear();
    this.yearList = Array.from(
      { length: this.appService.appConfig[0].maximumYearRange },
      (_, index) => {
        const year = currentYear - index;
        return { value: year.toString(), id: index + 1 };
      }
    );

    this.monthList = this.appService.appConfig[0].months;

    this.usersViewTableOptions.allowViewActionsButton = true;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Activity Logs", active: false },
      { label: "Activity Logs", active: true },
    ]);

    this.loadData();
  }

  loadData() {
    this.loadingInProgress = true;

    if (this.selectedUser == 0 || this.selectedUser == undefined) {
      if (this.selectedPlatform == 0 || this.selectedPlatform == undefined) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          0,
          0,
          this.firstDate,
          this.lastDate,
          0
        );
      } else if (
        this.selectedPlatform != 0 &&
        this.selectedPlatform != undefined &&
        (this.selectedRole == 0 || this.selectedRole == undefined)
      ) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          this.selectedPlatform,
          0,
          this.firstDate,
          this.lastDate,
          0
        );
      } else if (
        this.selectedPlatform != 0 &&
        this.selectedPlatform != undefined &&
        this.selectedRole != 0 &&
        this.selectedRole != undefined
      ) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          this.selectedPlatform,
          this.selectedRole,
          this.firstDate,
          this.lastDate,
          0
        );
      }
    } else {
      if (this.selectedPlatform == 0 || this.selectedPlatform == undefined) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          0,
          0,
          this.firstDate,
          this.lastDate,
          this.selectedUser
        );
      } else if (
        this.selectedPlatform != 0 &&
        this.selectedPlatform != undefined &&
        (this.selectedRole == 0 || this.selectedRole == undefined)
      ) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          this.selectedPlatform,
          0,
          this.firstDate,
          this.lastDate,
          this.selectedUser
        );
      } else if (
        this.selectedPlatform != 0 &&
        this.selectedPlatform != undefined &&
        this.selectedRole != 0 &&
        this.selectedRole != undefined
      ) {
        this.getActivityLogs(
          this.selectedPage,
          this.selectedPageSize,
          this.selectedPlatform,
          this.selectedRole,
          this.firstDate,
          this.lastDate,
          this.selectedUser
        );
      }
    }
  }

  updateTable() {
    this.activityLogsArray = this.activityLogList.map((item) => ({
      LogId: item.logId,
      UserName: item.userName,
      PlatformName: item.platformName,
      PlatformId: item.platformId,
      RoleName: item.roleName,
      ActivityType: item.activityType,
      Description: item.description,
      Details: item.details,
      CreatedAt: this.convertDateFormat(item.createdAt),
    }));
    this.tableData = this.activityLogsArray;
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onViewButtonClicked(row: any) {
    this.openModal("View", "Extra Details", row.Details);
  }

  openModal(type: string, modalTitle: string, details: any): void {
    const modalRef = this.modalService.open(ActivityLogsModalComponent, {
      size: "s",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.modalTitle = modalTitle;
    modalRef.componentInstance.details = details;
  }

  onPlatformSelect() {
    this.getRoleList();
    this.selectedRole = undefined;
    this.loadData();
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

  getUserList() {
    this.userListDefault = [{ value: "All Users", id: "0" }];

    this.shared.getUserList().subscribe({
      next: (response: any) => {
        this.userList = response;

        var users = this.userList;
        for (let i = 0; i < users.length; i++) {
          this.userListDefault.push(users[i]);
        }
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetUserComboboxListErrorSideAlertMessage
        );
      },
    });
  }

  getPlatformList() {
    this.roleListDefault = [{ value: "All Roles", id: "0" }];

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

  getRoleList() {
    this.roleListDefault = [{ value: "All Roles", id: "0" }];
    this.shared.getRoleList(this.selectedPlatform).subscribe({
      next: (response: any) => {
        this.roleList = response;

        var roles = this.roleList;
        for (let i = 0; i < roles.length; i++) {
          this.roleListDefault.push(roles[i]);
        }
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetRoleComboboxListErrorSideAlertMessage
        );
      },
    });
  }

  getActivityLogs(
    page: number,
    pageSize: number,
    platformId: number,
    roleId: number,
    firstDate: Date,
    lastDate: Date,
    userId: number
  ) {
    this.shared
      .getActivityLogs(
        page,
        pageSize,
        platformId,
        roleId,
        firstDate,
        lastDate,
        userId
      )
      .subscribe({
        next: (response: any) => {
          this.activityLogList = response.response;
          this.totalDataCount = response.rowCount;
          this.updateTable();
          this.loadingInProgress = false;
        },
        error: (error: any) => {
          this.alertService.sideErrorAlert(
            "Error",
            //"Could not retrieve the data list."
            this.appService.popUpMessageConfig[0]
              .GetActivityLogsErrorSideAlertMessage
          );

          this.activityLogList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
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

  //Handle the download button clicking
  downloadExcel() {
    var reportName = `Activity Logs (${this.formatDate(
      this.firstDate
    )} - ${this.formatDate(this.lastDate)})`;
    var sheetName = `Activity Logs`;

    var arrayOfArrayData = [
      ["Activity Logs"],
      [],
      [`From`, `${this.formatDate(this.firstDate)}`],
      [`To`, `${this.formatDate(this.lastDate)}`],
      [
        `User`,
        `${
          this.getSelectedUserName(this.selectedUser) ||
          this.userListDefault[0].value
        }`,
      ],
      [
        `Platform`,
        `${
          this.getSelectedPlatformName(this.selectedPlatform) ||
          this.platformListDefault[0].value
        }`,
      ],
      [
        `Role`,
        `${
          this.getSelectedRoleName(this.selectedRole) ||
          this.roleListDefault[0].value
        }`,
      ],
      [],
      [
        "Log Id",
        "Username",
        "Platform",
        "Role",
        "Activity Type",
        "Description",
        "Time",
      ],
    ];

    for (var i = 0; i < this.tableData.length; i++) {
      var rowData: any = [
        this.tableData[i].LogId,
        this.tableData[i].UserName,
        this.tableData[i].PlatformName,
        this.tableData[i].RoleName,
        this.tableData[i].ActivityType,
        this.tableData[i].Description,
        this.tableData[i].CreatedAt,
      ];
      arrayOfArrayData.push(rowData);
    }

    this.getDateTime();
    arrayOfArrayData.push([], ["Generated On : ", `${this.exportDateTime}`]);

    this.reportService.generateExcelFile(
      arrayOfArrayData,
      sheetName,
      reportName
    );
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
    this.exportDateTime = date + " " + time;
  }

  formatDate(inputDate: Date): string {
    const months = [
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

    const day = inputDate.getDate();
    const month = months[inputDate.getMonth()];
    const year = inputDate.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  getSelectedPlatformName(selectedPlatform: number): string {
    const platform = this.platformListDefault.find(
      (item) => item.id === selectedPlatform
    );
    return platform.value;
  }

  getSelectedRoleName(selectedRole: number): string {
    const role = this.roleListDefault.find((item) => item.id === selectedRole);
    return role.value;
  }

  getSelectedUserName(selectedUser: number): string {
    const user = this.userListDefault.find((item) => item.id === selectedUser);
    return user.value;
  }
}

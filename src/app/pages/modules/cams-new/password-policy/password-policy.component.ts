import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { ActivityLogData } from "src/app/shared/models/Cams-new/ActivityLogData";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { ActivityLogsModalComponent } from "src/app/shared/widget/config/activity-logs-modal/activity-logs-modal.component";

@Component({
  selector: "app-password-policy",
  templateUrl: "./password-policy.component.html",
  styleUrls: ["./password-policy.component.scss"],
})
export class PasswordPolicyComponent {
  loadingInProgress: boolean = false;

  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  yearList: any[] = [];
  monthList: any[] = [];

  userModel!: ActivityLogData;
  userList!: ActivityLogData[];
  userDetailsArray: any = [];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  searchTerm!: string;

  roleList: any[] = [{ value: "All Roles", id: 1 }];
  selectedRole: string = this.roleList[0].value;
  platformList: any[] = [{ value: "All Platforms", id: 1 }];
  selectedPlatform: string = this.platformList[0].value;

  UserUpdatedNotificationMessage!: string;

  serchedTerm!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "ID", FieldName: "ID", ColumnType: "Data" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "Platform", FieldName: "Platform", ColumnType: "Data" },
    { Head: "Role", FieldName: "Role", ColumnType: "Data" },
    { Head: "Activity Type", FieldName: "ActivityType", ColumnType: "Data" },
    { Head: "Description", FieldName: "Description", ColumnType: "Data" },
    { Head: "Time", FieldName: "Time", ColumnType: "Data" },
    { Head: "Actions", FieldName: "", ColumnType: "Action" },
  ];

  //to remove
  tableData = [
    {
      ID: "1254123658",
      UserName: "Harper.Bennett",
      Platform: "TBS",
      Role: "Tenant",
      ActivityType: "SingleSignOn-Auth",
      Description: "Logged into the platform",
      Time: "Dec 19, 2023, 9:15:54 PM",
      Details: {
        Setting: "PS_PAGE",
        Data: 20,
        Description: "Pagination Page Size",
      },
    },
    {
      ID: "4512589562",
      UserName: "Mia.Rodriguez",
      Platform: "TBS",
      Role: "Tenant",
      ActivityType: "SingleSignOn-Auth",
      Description: "Logged into the platform",
      Time: "Dec 19, 2023, 9:05:50 PM",
      Details: "userId = 2218",
    },
    {
      ID: "7895624568",
      UserName: "Nolan.Sullivan",
      Platform: "TBS",
      Role: "Tenant",
      ActivityType: "SingleSignOn-Auth",
      Description: "Logged into the platform",
      Time: "Dec 19, 2023, 19:13:43 PM",
      Details: [
        {
          Date: "2023-10-22T00:00:00",
          NormalConsumption: 27.745999384,
          ExtendedConsumption: 25.045599445,
        },
        {
          Date: "2023-10-21T00:00:00",
          NormalConsumption: 27.777549384,
          ExtendedConsumption: 25.000199445,
        },
        {
          Date: "2023-10-12T00:00:00",
          NormalConsumption: 27.725999384,
          ExtendedConsumption: 29.000199445,
        },
      ],
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: ActivityLogsService,
    private modalService: NgbModal,
    private appService: AppService,
    private alertService: MessageService
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.yearList = Array.from(
      { length: this.appService.appConfig[0].maximumYearRange },
      (_, index) => {
        const year = currentYear - index;
        return { value: year.toString(), id: index + 1 };
      }
    );

    this.monthList = this.appService.appConfig[0].months;

    var roles = this.appService.appConfig[0].roleList;
    for (let i = 0; i < roles.length; i++) {
      this.roleList.push(roles[i]);
    }

    //to edit
    var platforms = [
      { value: "AES", id: 2 },
      { value: "TBS", id: 3 },
      { value: "EMS", id: 4 },
    ];
    for (let i = 0; i < platforms.length; i++) {
      this.platformList.push(platforms[i]);
    }

    this.usersViewTableOptions.allowViewActionsButton = true;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Activity Logs", active: false },
      { label: "Activity Logs", active: true },
    ]);
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
    //   this.getAllUsers();
    // } else if (
    //   (this.serchedTerm != undefined ||
    //     this.serchedTerm != null ||
    //     this.serchedTerm != "") &&
    //   (this.selectedRole == undefined ||
    //     this.selectedRole == null ||
    //     this.selectedRole == "All" ||
    //     this.selectedRole == "")
    // ) {
    //   this.searchUsers(this.serchedTerm);
    // } else if (
    //   (this.serchedTerm == undefined ||
    //     this.serchedTerm == null ||
    //     this.serchedTerm == "") &&
    //   (this.selectedRole != undefined ||
    //     this.selectedRole != null ||
    //     this.selectedRole != "All" ||
    //     this.selectedRole != "")
    // ) {
    //   this.getUsersByRole(this.serchedTerm);
    // } else if (
    //   (this.serchedTerm != undefined ||
    //     this.serchedTerm != null ||
    //     this.serchedTerm != "") &&
    //   (this.selectedRole != undefined ||
    //     this.selectedRole != null ||
    //     this.selectedRole != "All" ||
    //     this.selectedRole != "")
    // ) {
    //   this.searchUsersByRole(this.serchedTerm, this.selectedRole);
    // } else {
    //   this.getAllUsers();
    //   this.alertService.sideErrorAlert("Error", "Could not retrive data");
    // }
  }

  updateTable() {
    this.userDetailsArray = this.userList.map((item) => ({
      UserName: item.username,
      Role: item.role,
    }));
    this.tableData = this.userDetailsArray;
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

  // getAllUsers() {
  //   this.shared
  //     .getAllUsers(this.selectedPage, this.selectedPageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.userList = response.response;
  //         this.totalDataCount = response.rowCount;
  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //       error: (error) => {
  //         this.alertService.sideErrorAlert(
  //           "Error",
  //           this.appService.popUpMessageConfig[0]
  //             .GetUserListSuccessSideAlertMessage
  //         );

  //         this.userList = [];
  //         this.totalDataCount = 0;

  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //     });
  // }

  // getUsersByRole(role: string) {
  //   this.shared
  //     .getUsersByRole(role, this.selectedPage, this.selectedPageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.userList = response.response;
  //         this.totalDataCount = response.rowCount;
  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //       error: (error) => {
  //         this.alertService.sideErrorAlert(
  //           "Error",
  //           this.appService.popUpMessageConfig[0]
  //             .GetUserListSuccessSideAlertMessage
  //         );

  //         this.userList = [];
  //         this.totalDataCount = 0;

  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //     });
  // }

  // searchUsers(serchedTerm: string) {
  //   this.shared
  //     .getSearchedUsers(serchedTerm, this.selectedPage, this.selectedPageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.userList = response.response;
  //         this.totalDataCount = response.rowCount;

  //         if (this.totalDataCount > 0) {
  //           this.updateTable();
  //           this.loadingInProgress = false;
  //         } else {
  //           this.alertService.warningSweetAlertMessage(
  //             this.appService.popUpMessageConfig[0].NoDataNotificationMessage,
  //             "No Data!",
  //             4000
  //           );
  //           this.getAllUsers();
  //         }
  //       },
  //       error: (error) => {
  //         this.alertService.sideErrorAlert(
  //           "Error",
  //           this.appService.popUpMessageConfig[0]
  //             .GetUserListSuccessSideAlertMessage
  //         );

  //         this.userList = [];
  //         this.totalDataCount = 0;

  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //     });
  // }

  // searchUsersByRole(serchedTerm: string, role: string) {
  //   this.shared
  //     .getSearchedUsersByRole(
  //       serchedTerm,
  //       role,
  //       this.selectedPage,
  //       this.selectedPageSize
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.userList = response.response;
  //         this.totalDataCount = response.rowCount;
  //         if (this.totalDataCount > 0) {
  //           this.updateTable();
  //           this.loadingInProgress = false;
  //         } else {
  //           this.alertService.warningSweetAlertMessage(
  //             this.appService.popUpMessageConfig[0].NoDataNotificationMessage,
  //             "No Data!",
  //             4000
  //           );
  //           this.getAllUsers();
  //         }
  //       },
  //       error: (error) => {
  //         this.alertService.sideErrorAlert(
  //           "Error",
  //           this.appService.popUpMessageConfig[0]
  //             .GetUserListSuccessSideAlertMessage
  //         );

  //         this.userList = [];
  //         this.totalDataCount = 0;

  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //     });
  // }
}

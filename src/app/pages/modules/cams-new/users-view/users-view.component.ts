import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { UsersViewService } from "src/app/services/cams-new/users-view.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { AppService } from "src/app/app.service";
import { User } from "src/app/shared/models/Cams-new/User";
import { UserViewModalComponent } from "src/app/shared/widget/config/user-view-modal/user-view-modal.component";
import { UpdateConfirmationModalComponent } from "src/app/shared/widget/config/update-confirmation-modal/update-confirmation-modal.component";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-users-view",
  templateUrl: "./users-view.component.html",
  styleUrls: ["./users-view.component.scss"],
})
export class UsersViewComponent {
  loadingInProgress: boolean = false;

  userModel!: User;
  userList!: User[];
  userDetailsArray: any = [];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  searchTerm!: string;

  platformListDefault: any[] = [{ value: "All", id: "0" }];

  platformList: any[] = [];

  selectedPlatform: string = "All";

  UserUpdatedNotificationMessage!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];
  usersViewService: any;
  tableData: any;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: UsersViewService,
    private notifierService: NgToastService,
    private modalService: NgbModal,
    private appService: AppService,
    private alertService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getPlatformList();

    this.usersViewTableOptions.allowCheckbox = true;
    this.usersViewTableOptions.allowBulkDeleteButton = true;
    this.usersViewTableOptions.allowDeleteButton = true;
    this.usersViewTableOptions.allowUpdateButton = true;
    this.usersViewTableOptions.allowViewButton = true;
    this.usersViewTableOptions.displayPagination = true;

    this.usersViewTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateUserConfirmationMessage;
    this.usersViewTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteUserConfirmationMessage;
    // this.usersViewTableOptions.recordDeletedNotificationMessage =
    //   this.appService.popUpMessageConfig[0].UserDeletedNotificationMessage;
    // this.UserUpdatedNotificationMessage =
    //   this.appService.popUpMessageConfig[0].UserUpdatedNotificationMessage;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Users", active: false },
      { label: "Users", active: true },
    ]);

    this.loadData();
  }

  loadData() {
    this.loadingInProgress = true;
    if (
      (this.searchTerm == undefined ||
        this.searchTerm == null ||
        this.searchTerm == "") &&
      (this.selectedPlatform == undefined ||
        this.selectedPlatform == null ||
        this.selectedPlatform == "All" ||
        this.selectedPlatform == "")
    ) {
      this.getAllUsers();
    } else if (
      (this.searchTerm != undefined ||
        this.searchTerm != null ||
        this.searchTerm != "") &&
      (this.selectedPlatform == undefined ||
        this.selectedPlatform == null ||
        this.selectedPlatform == "All" ||
        this.selectedPlatform == "")
    ) {
      this.searchUsers(this.searchTerm);
    } else if (
      (this.searchTerm == undefined ||
        this.searchTerm == null ||
        this.searchTerm == "") &&
      (this.selectedPlatform != undefined ||
        this.selectedPlatform != null ||
        this.selectedPlatform != "All" ||
        this.selectedPlatform != "")
    ) {
      this.getUsersByPlatform(this.selectedPlatform);
    } else if (
      (this.searchTerm != undefined ||
        this.searchTerm != null ||
        this.searchTerm != "") &&
      (this.selectedPlatform != undefined ||
        this.selectedPlatform != null ||
        this.selectedPlatform != "All" ||
        this.selectedPlatform != "")
    ) {
      this.searchUsersByPlatform(this.searchTerm, this.selectedPlatform);
    } else {
      this.getAllUsers();
      this.alertService.sideErrorAlert("Error", "Could not retrive data");
    }
  }

  updateTable() {
    this.userDetailsArray = this.userList.map((item) => ({
      UserName: item.userName,
      FirstName: item.firstName,
      LastName: item.lastName,
      Email: item.email,
      PhoneNumber: item.phone,
      Password: item.password,
      UserId: item.userId,
      isRejecteableOrApprovableRecord: true,
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

  onAddUserButtonClicked(): void {
    this.openModal("Add", "New User Account", "", "", "", "", "", "", "", "");
  }

  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Edit User Account Details",
      row.UserName,
      row.FirstName,
      row.LastName,
      row.Platform,
      row.Email,
      row.PhoneNumber,
      row.Password,
      row.UserId
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "User Account Details",
      row.UserName,
      row.FirstName,
      row.LastName,
      row.Platform,
      row.Email,
      row.PhoneNumber,
      row.password,
      row.UserId
    );
  }

  openModal(
    type: string,
    modalTitle: string,
    userName: string,
    firstName: string,
    lastName: string,
    platform: string,
    email: string,
    phoneNumber: string,
    password: string,
    userId: string
  ): void {
    const modalRef = this.modalService.open(UserViewModalComponent, {
      size: "s",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.userName = userName;
    modalRef.componentInstance.firstName = firstName;
    modalRef.componentInstance.lastName = lastName;
    modalRef.componentInstance.platform = platform;
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.phoneNumber = phoneNumber;
    modalRef.componentInstance.password = password;
    modalRef.componentInstance.userId = userId;

    modalRef.result
      .then((result) => {
        if (result) {
          console.log("Getting data from User View Modal");
          console.log(result);

          this.userModel = result;
          if (type == "Add") {
            this.postUser(this.userModel);
          } else if (type == "Edit") {
            this.putUser(this.userModel);
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
              this.usersViewTableOptions.rowEditConfirmationMessage;
            modalRefForConfirmation.result
              .then((result) => {
                if (result == "Yes") {
                  console.log("Confirmed to edit");
                  this.openModal(
                    "Edit",
                    "Edit User Account Details",
                    userName,
                    firstName,
                    lastName,
                    platform,
                    email,
                    phoneNumber,
                    password,
                    userId
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "User",
                    userName,
                    firstName,
                    lastName,
                    platform,
                    email,
                    phoneNumber,
                    password,
                    userId
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
            //second modal closed
          }
        } else {
          console.log("Data not submitted from add User View Modal");
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

  getAllUsers() {
    this.shared
      .getAllUsers(this.selectedPage, this.selectedPageSize)
      .subscribe({
        next: (response) => {
          this.userList = response.response;
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

          this.userList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  getUsersByPlatform(platformId: string) {
    this.shared
      .getUsersByPlatform(platformId, this.selectedPage, this.selectedPageSize)
      .subscribe({
        next: (response) => {
          this.userList = response.response;
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

          this.userList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  searchUsers(serchedTerm: string) {
    this.shared
      .getSearchedUsers(serchedTerm, this.selectedPage, this.selectedPageSize)
      .subscribe({
        next: (response) => {
          this.userList = response.response;
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

          this.userList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  searchUsersByPlatform(serchedTerm: string, platform: string) {
    this.shared
      .getSearchedUsersByPlatform(
        serchedTerm,
        platform,
        this.selectedPage,
        this.selectedPageSize
      )
      .subscribe({
        next: (response) => {
          this.userList = response.response;
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

          this.userList = [];
          this.totalDataCount = 0;

          this.updateTable();
          this.loadingInProgress = false;
        },
      });
  }

  postUser(user: any) {
    console.log("Add", user);
    this.shared.postUser(user).subscribe({
      next: (response) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0].UserAddedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0].UserAddedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0].UserAddedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  putUser(user: User): void {
    console.log("Edit", user);
    this.shared.putUser(user).subscribe({
      next: (response) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .UserUpdatedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0].UserUpdatedNotificationMessage,
          "Updated!",
          4000
        );

        this.loadData();
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0].UserUpdatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  deleteUsers(items: any): void {
    let ids: number[] = [];
    items.forEach((element: any) => {
      ids.push(element.UserId);
    });

    this.removeUsers(ids);
  }

  removeUsers(ids: number[]): void {
    this.shared.deleteUser(ids).subscribe({
      next: (response) => {
        console.log(response);

        this.alertService.sideSuccessAlert(
          "Success",
          this.appService.popUpMessageConfig[0]
            .UserDeletedSuccessSideAlertMessage
        );
        this.alertService.successSweetAlertMessage(
          this.appService.popUpMessageConfig[0].UserDeletedNotificationMessage,
          "Deleted!",
          4000
        );

        this.loadData();
      },

      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0].UserDeletedErrorSideAlertMessage
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

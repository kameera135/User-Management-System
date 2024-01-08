import { Component, Input } from "@angular/core";
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
import { PlatformUserModalComponent } from "src/app/shared/widget/config/platform-user-modal/platform-user-modal.component";
import { PlatformUser } from "src/app/shared/models/Cams-new/platform-user";
import { ActivatedRoute } from "@angular/router";
import { PlatformUsersService } from "src/app/services/cams-new/platform-users.service";

@Component({
  selector: 'app-platform-users',
  templateUrl: './platform-users.component.html',
  styleUrls: ['./platform-users.component.scss']
})
export class PlatformUsersComponent {

  loadingInProgress: boolean = false;

  userModel!: PlatformUser;
  userList!: PlatformUser[];
  userDetailsArray: any = [];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  @Input() platform!: string;

  searchTerm!: string;
  

  roleList: any[] = [{ value: "All", id: 1 }];
  platformList: any[] = [{ value: "All", id: 1 }];

  selectedRole: string = "All";

  UserUpdatedNotificationMessage!: string;

  serchedTerm!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    //{ Head: "Platform", FieldName: "Platform", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];
  usersViewService: any;
  tableData: any;

  platformName!: string

  //to remove
  // tableData = [
  //   {
  //     UserName: "Harper.Bennett",
  //     FirstName: "Harper",
  //     LastName: "Bennett",
  //     Platform: "AES",
  //     Email: "harperbennett@yoyo.com",
  //     phoneNumber: "0221513654",
  //     userProfileCode: "UPC12345",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  //   {
  //     UserName: "Mia.Rodriguez",
  //     FirstName: "Mia",
  //     LastName: "Rodriguez",
  //     Platform: "TBS",
  //     Email: "miarodriguez@yoyo.com",
  //     phoneNumber: "0663251985",
  //     userProfileCode: "USR789ABC",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  //   {
  //     UserName: "Nolan.Sullivan",
  //     FirstName: "Nolan",
  //     LastName: "Sullivan",
  //     Platform: "Energy Management System",
  //     Email: "nolansullivan@yoyo.com",
  //     phoneNumber: "0784562354",
  //     userProfileCode: "PROFILE_XYZ987",
  //     isRejecteableOrApprovableRecord: true,
  //   },
  // ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: PlatformUsersService,
    private notifierService: NgToastService,
    private modalService: NgbModal,
    private appService: AppService,
    private alertService: MessageService,
    private http: HttpClient,
    private route:ActivatedRoute
    
  ) {}

  ngOnInit(): void {
    var platforms = this.appService.appConfig[0].platformList;
    for (let i = 0; i < platforms.length; i++) {
      this.platformList.push(platforms[i]);
    }


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
      { label: "Configuration", active: false },
      { label: "Platforms", active: false },
      { label: "Users", active: true },
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
      this.getAllUsers();
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedRole == undefined ||
        this.selectedRole == null ||
        this.selectedRole == "All" ||
        this.selectedRole == "")
    ) {
      this.searchUsers(this.serchedTerm);
    } else if (
      (this.serchedTerm == undefined ||
        this.serchedTerm == null ||
        this.serchedTerm == "") &&
      (this.selectedRole != undefined ||
        this.selectedRole != null ||
        this.selectedRole != "All" ||
        this.selectedRole != "")
    ) {
      // this.getUsersByRole(this.serchedTerm);
    } else if (
      (this.serchedTerm != undefined ||
        this.serchedTerm != null ||
        this.serchedTerm != "") &&
      (this.selectedRole != undefined ||
        this.selectedRole != null ||
        this.selectedRole != "All" ||
        this.selectedRole != "")
    ) {
      this.searchUsersByRole(this.serchedTerm, this.selectedRole);
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
      Platform: item.platform,
      Email: item.email,
      PhoneNumber: item.phoneNumber,
      isRejecteableOrApprovableRecord:true
    }));
    this.tableData = this.userDetailsArray;
  }

  // updateTable(){
  //   this.loadingInProgress = true; // Set loading flag to true before making the API call

  //   this.usersViewService.getUsers().subscribe(
  //     (data: User[]) => {
  //       this.userList = data; // Assign received data to userList
  //       this.loadingInProgress = false; // Set loading flag to false after data retrieval
  //     },
  //     (error: any) => {
  //       // Handle error
  //       console.error('Error fetching data:', error);
  //       this.loadingInProgress = false; // Set loading flag to false in case of an error
  //     }
  //   );
  // }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.loadData();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.loadData();
  }

  onAddUserButtonClicked(): void {
    this.openModal("Add", "New User Account", "", "", "", "", "", "", "");
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
      row.UserProfileCode
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
      row.UserProfileCode
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
    userProfileCode: string
  ): void {

    // Check the 'type' parameter to determine the view 
    let modalSize = "m";
    if(type == "Add"){
      modalSize = "xl"
    }
    
    const modalRef = this.modalService.open(PlatformUserModalComponent, {
      size: modalSize,
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
    modalRef.componentInstance.userProfileCode = userProfileCode;

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
                    userProfileCode
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
                    userProfileCode
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
      .getAllPlatformUsers(this.selectedPage, this.selectedPageSize)
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
  //             .GetUserListErrorSideAlertMessage
  //         );

  //         this.userList = [];
  //         this.totalDataCount = 0;

  //         this.updateTable();
  //         this.loadingInProgress = false;
  //       },
  //     });
  // }

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
            this.getAllUsers();
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

  searchUsersByRole(serchedTerm: string, role: string) {
    this.shared
      .getSearchedUsersByRole(
        serchedTerm,
        role,
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
            this.getAllUsers();
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

  putUser(user: PlatformUser): void {
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
      ids.push(element.id);
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
}

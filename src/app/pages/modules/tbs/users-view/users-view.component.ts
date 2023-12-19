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

  roleList: any[] = [{ value: "All", id: 1 }];

  selectedRole: string = "All";
  UserUpdatedNotificationMessage!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    { Head: "Role", FieldName: "Role", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  //to remove
  tableData = [
    {
      UserName: "Harper.Bennett",
      FirstName: "Harper",
      LastName: "Bennett",
      Role: "Tenant",
      Email: "harperbennett@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
    {
      UserName: "Mia.Rodriguez",
      FirstName: "Mia",
      LastName: "Rodriguez",
      Role: "TM",
      Email: "miarodriguez@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
    {
      UserName: "Nolan.Sullivan",
      FirstName: "Nolan",
      LastName: "Sullivan",
      Role: "Tenant",
      Email: "nolansullivan@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: UsersViewService,
    private notifierService: NgToastService,
    private modalService: NgbModal,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    var roles = this.appService.appConfig[0].roleList;
    for (let i = 0; i < roles.length; i++) {
      this.roleList.push(roles[i]);
    }

    this.usersViewTableOptions.allowCheckbox = true;
    this.usersViewTableOptions.allowBulkDeleteButton = true;
    this.usersViewTableOptions.allowDeleteButton = true;
    this.usersViewTableOptions.allowUpdateButton = true;
    this.usersViewTableOptions.allowViewButton = true;

    this.usersViewTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateUserConfirmationMessage;
    this.usersViewTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteUserConfirmationMessage;
    this.usersViewTableOptions.recordDeletedNotificationMessage =
      this.appService.popUpMessageConfig[0].UserDeletedNotificationMessage;
    this.UserUpdatedNotificationMessage =
      this.appService.popUpMessageConfig[0].UserUpdatedNotificationMessage;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Users", active: false },
      { label: "Users", active: true },
    ]);
  }

  loadData() {
    this.loadingInProgress = true;
  }

  updateTable() {
    this.userDetailsArray = this.userList.map((item) => ({
      UserName: item.userName,
      FirstName: item.firstName,
      LastName: item.lastName,
      Role: item.role,
      Email: item.email,
    }));
    this.tableData = this.userDetailsArray;
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    this.getUsers();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    this.getUsers();
  }

  onAddUserButtonClicked(): void {
    this.openModal("Add", "Add A User", "", "", "", "", "");
  }

  onEditButtonClicked(row: any) {
    this.openModal(
      "Edit",
      "Update User",
      row.UserName,
      row.FirstName,
      row.LastName,
      row.Role,
      row.Email
    );
  }

  onViewButtonClicked(row: any) {
    this.openModal(
      "View",
      "User",
      row.UserName,
      row.FirstName,
      row.LastName,
      row.Role,
      row.Email
    );
  }

  openModal(
    type: string,
    modalTitle: string,
    userName: string,
    firstName: string,
    lastName: string,
    role: string,
    email: string
  ): void {
    const modalRef = this.modalService.open(UserViewModalComponent, {
      size: "s",
      centered: true,
      // backdrop: "static",
      keyboard: false,
    });

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalTitle = modalTitle;

    modalRef.componentInstance.userName = userName;
    modalRef.componentInstance.firstName = firstName;
    modalRef.componentInstance.lastName = lastName;
    modalRef.componentInstance.role = role;
    modalRef.componentInstance.email = email;

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
                    "Update User",
                    userName,
                    firstName,
                    lastName,
                    role,
                    email
                  );
                } else {
                  console.log("Not confirmed to edit");
                  this.openModal(
                    "View",
                    "User",
                    userName,
                    firstName,
                    lastName,
                    role,
                    email
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

  getUsers() {}

  getUsersByRole() {}

  searchUser(item: any) {}

  postUser(user: any) {
    console.log("Add", user);
  }
  putUser(user: any) {
    console.log("Edit", user);
  }
}

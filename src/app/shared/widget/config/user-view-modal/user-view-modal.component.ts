import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { UsersViewService } from "src/app/services/cams-new/users-view.service";
import { PlatformRole } from "src/app/shared/models/Cams-new/PlatformRole";
import { User } from "src/app/shared/models/Cams-new/User";
import { tableOptions } from "src/app/shared/models/tableOptions";

@Component({
  selector: "app-user-view-modal",
  templateUrl: "./user-view-modal.component.html",
  styleUrls: ["./user-view-modal.component.scss"],
})
export class UserViewModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;
  @Input() userName!: string;
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() platform!: any;
  @Input() email!: string;
  @Input() phoneNumber!: string;
  @Input() password!: string;
  @Input() confirmPassword!: string;
  @Input() userId!: number;

  platformsRoles: any = [];
  userPlatformRole!: PlatformRole;
  userPlatformsRoles!: PlatformRole[];

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  loadingInProgress: boolean = false;

  rolesViewTableOptions: tableOptions = new tableOptions();

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: UsersViewService,
    private alertService: MessageService
  ) {}

  ngOnInit() {
    if (this.type == "Add") {
      this.buttonName = "Add";
      this.buttonIcon = "bi-person-plus-fill";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
    }

    if (this.type == "View") {
      this.getRolesAndPlatforms(this.userId);
    }

    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;

    this.rolesViewTableOptions;
  }

  getRolesAndPlatforms(userId: number) {
    this.loadingInProgress = true;
    this.shared.getRolesAndPlatforms(userId).subscribe({
      next: (response) => {
        this.userPlatformsRoles = response;
        this.updateTable();
        this.loadingInProgress = false;
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetUserPlatformsAndRolesErrorSideAlertMessage
        );

        this.tableData = [];

        this.updateTable();
        this.loadingInProgress = false;
      },
    });
  }

  updateTable() {
    this.platformsRoles = this.userPlatformsRoles.map((item) => ({
      PlatformId: item.platformId,
      Platforms: item.platformName,
      RoleId: item.roleId,
      Roles: item.roleName,
    }));
    this.tableData = this.platformsRoles;
  }

  onFormSubmit() {
    if (
      this.userName == "" ||
      this.firstName == "" ||
      this.lastName == "" ||
      this.password == "" ||
      this.email == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    if (this.password != this.confirmPassword) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please confirm the password",
        duration: 2000,
      });
      return;
    }

    const user = new User();
    user.userName = this.userName;
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.email = this.email;
    user.phone = this.phoneNumber;
    user.password = this.password;
    user.userId = this.userId;

    this.activeModal.close(user);
  }

  headArray = [
    { Head: "Platforms", FieldName: "Platforms", ColumnType: "Data" },
    { Head: "Roles", FieldName: "Roles", ColumnType: "Data" },
  ];

  tableData = [];
}

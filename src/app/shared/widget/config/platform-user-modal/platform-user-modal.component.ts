import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgToastService } from 'ng-angular-popup';
import { AppService } from 'src/app/app.service';
import { MessageService } from 'src/app/services/PopupMessages/message.service';
import { PlatformUsersService } from 'src/app/services/cams-new/platform-users.service';
import { User } from 'src/app/shared/models/Cams-new/User';
import { UserRolePermissions } from 'src/app/shared/models/Cams-new/UserRolePermissions';
import { PlatformUser } from 'src/app/shared/models/Cams-new/platform-user';
import { tableOptions } from 'src/app/shared/models/tableOptions';
import { threadId } from 'worker_threads';

interface ListItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-platform-user-modal',
  templateUrl: './platform-user-modal.component.html',
  styleUrls: ['./platform-user-modal.component.scss']
})

export class PlatformUserModalComponent {

  //roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;
  @Input() userName!: string;
  @Input() userId!: number;
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() platform!: any;
  @Input() email!: string;
  @Input() phoneNumber!: string;
  @Input() password!: string;
  @Input() confirmPassword!: string;
  @Input() userProfileCode!: string;
  @Input() role!: string;
  @Input() platformId!: number;
  empId!: number;

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  userList!: PlatformUser[];
  userModal!: PlatformUser;
  rolePermission!: UserRolePermissions[];

  
  showListItems: boolean = false;
  
  listItems: ListItem[] = []; 

  selectedPage: number = 1;
  selectedPageSize: number = 20;
  totalDataCount!: number;

  searchTerm!: string;

  rolesAsString!: string;

  loadingInProgress: boolean = false;

  rolesViewTableOptions: tableOptions = new tableOptions();
  isEditable: boolean = true;

  platformUserModelViewTableOption: tableOptions = new tableOptions();
  userDetailsArray: any;
  rolePermissionArray: any = [];
  tableData: any;
  rolePermissionTableData: any;

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: PlatformUsersService,
    private alertService: MessageService,
  ) {}

  //FOR UNASSIGN USER TABLE
  headArray = [
  
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "EmpId", FieldName: "EmpId", ColumnType: "Data" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
  ];

  //FOR ROLE PERMISSION TABLE
  headArrayRolePermission = [

    { Head: "Role", FieldName: "RoleName", ColumnType: "Data" },
    { Head: "Permissions", FieldName: "Permission", ColumnType: "Data"}
  ];

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
    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;

    this.platformUserModelViewTableOption.allowCheckbox = true;


    if(this.type == 'View'){
      this.getUserRolesPermissions();
    }
    else if(this.type == 'Edit'){
      this.getPlatformUserRoles();
    }
    else{
      this.loadData();
    }
    
  }

  loadData(){
    this.loadingInProgress = true;
   // this.getAllPlatformUsers();
    //this.getAllPlatformUsersRoles();
    this.getAllUsers();
    
  }

  updateTable() {
    this.userDetailsArray = this.userList.map((item) => ({
      EmpId: item.empId,
      UserName: item.userName,
      Email: item.email,
      FirstName: item.firstName,
      LastName: item.lastName,
      isRejecteableOrApprovableRecord:true

    }));
    this.tableData = this.userDetailsArray;
  }

  //FOR ROLE PERMISSION TABLE
  updateRolePermissionTable(){
    this.rolePermissionArray = this.rolePermission.map((item) =>({
      RoleId: item.roleId,
      RoleName : item.roleName,
      PermissionId: item.permissionId,
      Permission: item.permission
    }));

    this.rolePermissionTableData = this.rolePermissionArray
  }

  getSearchTerm($event: KeyboardEvent) {
    this.selectedPage = 1;
    if ($event.key === "Enter") {
      this.loadData();
    }
  }

  getAllPlatformUsers() {
    this.shared
      .getAllPlatformUsers(this.platformId,this.selectedPage, this.selectedPageSize)
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

  getAllUsers() {
    this.shared
      .getAllUsers(this.platformId)
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

  getUserRolesPermissions(){
    this.loadingInProgress = true;
    this.shared.getUserRolesPermissions(this.userId,this.platformId).subscribe({
      next: (response:any) => {
        this.rolePermission = response;
        this.updateRolePermissionTable();
        this.loadingInProgress = false;
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetUserPlatformsAndRolesErrorSideAlertMessage
        );

        this.rolePermission = [];

        this.updateRolePermissionTable();
        this.loadingInProgress = false;
      },
    });
  }

  getAllPlatformUsersRoles() {
    this.shared
      .getAllPlatformUsersRoles(this.selectedPage, this.selectedPageSize)
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

  onFormSubmit() {
    // if (
    //   this.userName == "" ||
    //   this.firstName == "" ||
    //   this.lastName == "" ||
    //   this.platform == "" ||
    //   this.userProfileCode == "" ||
    //   this.email == ""
    // ) {
    //   this.notifierService.warning({
    //     detail: "Warning",
    //     summary: "Please fill required fields",
    //     duration: 2000,
    //   });
    //   return;
    // }

    const user = new PlatformUser();
    user.empId = this.empId;
    user.userName = this.userName;
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.platformName = this.platform;
    user.email = this.email;
    user.phoneNumber = this.phoneNumber;

    this.activeModal.close(user);
  }

  getPlatformUserRoles(){
    this.loadingInProgress = true;
    this.shared.getPlatformUserRoles(this.userId, this.platformId).subscribe({
      next: (response: any) => {
       // console.log("Response from permissions for roles : ", response);
        this.userList = response;
        this.rolesAsString = this.getRolesAsString(response);
        this.loadingInProgress = false;
      },
      error: (error) => {
        // this.alertService.sideErrorAlert(
        //   "Error",
        //   this.appService.popUpMessageConfig[0]
        //     .GetPermissionListErrorSideAlertMessage
        // );

        this.userList = [];
        this.rolesAsString = '';
        this.loadingInProgress = false;
      },
    });
  }

  getRolesNotAssignUsers(){

    this.shared.getRolesNotAssignUsers(this.userId,this.platformId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          
          this.listItems = response.map(item => ({ name: item.role, selected: false }));
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching list items from API:', error);
      }
    });
  }

  getRolesAsString(roles: any[]): string{
    return roles.map(role => `${role.role}`).join('\n');
  }

  toggleListItems() {
      // Toggle the visibility of list items view
      if (this.type !== 'View') {
        this.getRolesNotAssignUsers();
        this.showListItems = !this.showListItems;
      }
  }

  addSelectedItems() {
      // Get selected items and add them to the textarea
     const existing = this.rolesAsString;

     const selectedItems = this.listItems.filter(item => item.selected && existing.indexOf(item.name) === -1)
                                          .map(item => item.name)
                                          .join('\n');

     if(selectedItems){
      this.rolesAsString = existing + (existing ? '\n' : '') + selectedItems;
     }

      // Hide the list items view after adding items to textarea
      this.showListItems = false;
  }
}

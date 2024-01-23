import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgToastService } from 'ng-angular-popup';
import { AppService } from 'src/app/app.service';
import { MessageService } from 'src/app/services/PopupMessages/message.service';
import { PlatformUsersService } from 'src/app/services/cams-new/platform-users.service';
import { User } from 'src/app/shared/models/Cams-new/User';
import { PlatformUser } from 'src/app/shared/models/Cams-new/platform-user';
import { tableOptions } from 'src/app/shared/models/tableOptions';

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

  selectedPage: number = 1;
  selectedPageSize: number = 20;
  totalDataCount!: number;

  loadingInProgress: boolean = false;

  rolesViewTableOptions: tableOptions = new tableOptions();
  isEditable: boolean = true;

  platformUserModelViewTableOption: tableOptions = new tableOptions();
  userDetailsArray: any;
  tableData: any;

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: PlatformUsersService,
    private alertService: MessageService,
  ) {}

  headArray = [
  
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "EmpId", FieldName: "EmpId", ColumnType: "Data" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
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

    this.loadData();
    
  }

  loadData(){
    this.loadingInProgress = true;
    this.getAllPlatformUsers();
    this.getAllPlatformUsersRoles();
    //this.getAllUsers();
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
    if (
      this.userName == "" ||
      this.firstName == "" ||
      this.lastName == "" ||
      this.platform == "" ||
      this.userProfileCode == "" ||
      this.email == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

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


  showListItems: boolean = false;
  
  listItems: ListItem[] = [
      { name: 'Tenenat Manager', selected: false },
      { name: 'Tenant', selected: false },
      { name: 'Admin', selected: false },
  ]; // Replace with your list items

  toggleListItems() {
      // Toggle the visibility of list items view
      if (this.type !== 'View') {
          this.showListItems = !this.showListItems;
      }
  }

  addSelectedItems() {
      // Get selected items and add them to the textarea
      const existing = this.platform
      const selectedItems = this.listItems.filter(item => item.selected).map(item => item.name).join('\n');
      const set = new Set([...existing, ...selectedItems]);
      this.platform = existing + '\n' + selectedItems;

      // Hide the list items view after adding items to textarea
      this.showListItems = false;
  }
}

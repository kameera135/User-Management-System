import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { RoleConfigurationService } from "src/app/services/cams-new/configuration services/role-configuration.service";
import { Role as Role } from "src/app/shared/models/Cams-new/Role";
import { PermissionsForRole } from "src/app/shared/models/Cams-new/PermissionsForRole";
import { error } from "console";
import { tableOptions } from "src/app/shared/models/tableOptions";

interface ListItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: "app-role-configuration-modal",
  templateUrl: "./role-configuration-modal.component.html",
  styleUrls: ["./role-configuration-modal.component.scss"],
})
export class RoleConfigurationModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;
  platformList: any[] = this.appService.appConfig[0].platformList;

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() roleCode!: number;
  @Input() roleId!: number;
  @Input() platformId!: number;
  @Input() roleName!: string;
  @Input() createdDate!: string;
  @Input() description!: string;
  @Input() status!: boolean;
  @Input() statusName!: string;
  @Input() permission!: string;
  @Input() platfromIds: any = [];
  
  @Input() platformName: any = [];

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  // selectedRole: string = "User Managemant System";

  disablePlatforms: boolean = false;

  loadingInProgress: boolean = false;

  permissionsAsString!: string;

  listItems: ListItem[] = [];

  isEditable: boolean = true;

  platformListDefault: any[] = [{ value: "Select Platforms", id: "0" }];
  selectedPlatform!: number;

  permissionsForRoleArray: any = [];
  permissionsForRoleList!: PermissionsForRole[];
  
  permissionsNotInRoleArray: any = [];
  permissionsNotInRoleList!: PermissionsForRole[];

  tableData: any = [];
  tableData2: any = [];

  showListItems: boolean = false;
  
  roleConfigModalTableOptions: tableOptions = new tableOptions();

  // Array to hold the dropdown options
  statusOptions: { label: string; value: string }[] = [
    { label: "Active", value: "Active" },
    { label: "Deactive", value: "Deactive" },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: RoleConfigurationService,
    private alertService: MessageService
  ) {}

  values: string[] = ['Value1', 'Value2', 'Value3'];
  newRoleName: string = '';

  ngOnInit() {

    this.statusName = this.statusName.slice(0, -4) + "e";
    //this.roleConfigModalTableOptions.displayPagination = false;

    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;

    if (this.type == "Add") {
      this.buttonName = "Add";
      this.buttonIcon = "bi-person-plus-fill";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else if(this.type == "Permission")
    {
      this.buttonName = "Assign_Permissions";
      this.buttonIcon = "bi-floppy2-fill";
      this.roleConfigModalTableOptions.displayPagination = false;
      this.roleConfigModalTableOptions.allowAcknowledgeButton = true;
      this.getPermissionsForRoles(); 
    }
     else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
      this.getPermissionsForRoles();
    }

    this.getPlatformList();

    // if(this.type == "Permission"){
    //   this.getUnassignPermissionsForRoles();
    // }

  }

  onFormSubmit() {

    if (
      this.roleCode == null ||
      this.roleName == "" 
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }
    else if(this.type == "Add" && this.roleName == "" || this.platformId == 0){
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const role = new Role();
    role.roleId = this.roleCode;
    role.role = this.roleName;
    role.createdAt = this.createdDate;
    role.platform = this.platformName;
    role.platformIds = this.platfromIds;
    // role.description = this.description;
    role.status = this.status;
    role.statusName = this.statusName;

    this.activeModal.close(role);
  }

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Permissions", FieldName: "Permission", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  // //FOR SHOW PERMISSIONS THAT NOT ASSIGN TO ROLE IN TABLE
  // headArray2 = [
  //   { Head: "", FieldName: "", ColumnType: "CheckBox" },
  //   { Head: "Permissions", FieldName: "Permission", ColumnType: "Data" },
  // ];

  updateTable() {

    this.permissionsForRoleArray = this.permissionsForRoleList.map((item) => ({
      PlatformId: item.platformId,
      Platform: item.platform,
      PermssionId: item.permissionId,
      Permission: item.permission,
      isRejecteableOrApprovableRecord:true
    }));
    this.tableData = this.permissionsForRoleArray;

  }

  //FOR SHOW PERMISSIONS THAT NOT ASSIGN TO ROLE IN TABLE
  updateTable2() {

    this.permissionsNotInRoleArray = this.permissionsNotInRoleList.map((item) => ({
      // PlatformId: item.platformId,
      // Platform: item.platform,
      PermssionId: item.permissionId,
      Permission: item.permission,
      isRejecteableOrApprovableRecord:true
    }));
    this.tableData2 = this.permissionsNotInRoleArray;

  }

  getPermissionsForRoles() {
    this.loadingInProgress = true;
    this.shared.getPermissionsForRoles(this.roleCode, this.platformId).subscribe({
      next: (response: any) => {
       console.log("Response from permissions for roles : ", response);
        this.permissionsForRoleList = response;
        this.updateTable();
       // this.permissionsAsString = this.getPermissionsAsString(response);
        this.loadingInProgress = false;
      },
      error: (error) => {

        this.permissionsForRoleList = [];
        this.updateTable();
        //this.permissionsAsString = '';
        this.loadingInProgress = false;
      },
    });
  }

  getUnassignPermissionsForRoles() {
    this.loadingInProgress = true;
    this.shared.getPermissionsNotInRole(this.platformId,this.roleCode).subscribe({
      next: (response: any) => {
        console.log("Response from permissions not for roles : ", response);
        this.permissionsNotInRoleList = response;
        this.updateTable2();
        //this.permissionsAsString = this.getPermissionsAsString(response);
        this.loadingInProgress = false;
      },
      error: (error) => {

        this.permissionsNotInRoleList = [];
        this.updateTable2();
        //this.permissionsAsString = '';
        this.loadingInProgress = false;
      },
    });
  }

  // getPermissionsAsString(permissions: any[]): string {
  //   return permissions.map(permission => `${permission.permission}`).join('\n');
  // }

  toggleListItems() {
    // Toggle the visibility of list items view
    if (this.type !== "View") {
      this.getListItemsFromAPI();
      this.showListItems = !this.showListItems;
    }
  }

  // addSelectedItems() {
  //   const existing = this.permissionsAsString;

  //   // Filter out items that are already present in the existing string
  //   const selectedItems = this.listItems
  //       .filter(item => item.selected && existing.indexOf(item.name) === -1)
  //       .map(item => item.name)
  //       .join('\n');

  //   // Check if any items are selected
  //   if (selectedItems) {
  //       // Only append a newline character if there are existing items
  //       this.permissionsAsString = existing + (existing ? '\n' : '') + selectedItems;
  //   }

  //   // Hide the list items view after adding items to the textarea
  //   this.showListItems = false;
  // }

  //get permissions that not assign to roles
  getListItemsFromAPI() {
    
    // Make an API request to fetch the list items
    this.shared.getPermissionsNotInRole(this.platformId,this.roleCode).subscribe({
      next: (response: any) => {
        
        // Check if the response is an array before mapping
        if (Array.isArray(response)) {
          
          // Assuming your API response has a structure like [{ permissionId: number, permission: string }, ...]
          this.listItems = response.map(item => ({ name: item.permission, selected: false }));
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching list items from API:', error);
      }
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

  assignPermissionsForRoles(permission: any){
    this.shared.assignPermissionsToRole(permission).subscribe({
      next: (response: any) =>{
        console.log(response);
        this.updateTable();

        // this.alertService.sideSuccessAlert(
        //   "Success",
        //   this.appService.popUpMessageConfig[0]
        //     .PermissionAddedSuccessSideAlertMessage
        // );
        // this.alertService.successSweetAlertMessage(
        //   this.appService.popUpMessageConfig[0]
        //     .PermissionAddedNotificationMessage,
        //   "Updated!",
        //   4000
        // );
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .PermissionAddedErrorSideAlertMessage
        );
      },
    });
    // Prevent the default form submission behavior
    permission.preventDefault();
  }
}

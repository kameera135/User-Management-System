import { Component } from "@angular/core";
import { error } from "console";
import { AuthService } from "src/app/auth/auth.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { UserAccountService } from "src/app/services/cams-new/user-account.service";
import { tableOptions } from "src/app/shared/models/tableOptions";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.scss"],
})
export class UserAccountComponent {
  asseteTreeData: any[] = [];
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedService: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  serviceList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  extensionData: any[] = [];
  loadingInProgress: boolean = false;

  userName!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  email!: string;
  phoneNumber!: string;
  userProfile!: string;

  tempuser: any = {};

  isEditMode: boolean = false; 

  extensionTableOptions: tableOptions = new tableOptions();

  
  constructor(private breadcrumbService: BreadcrumbService, 
              private auth: AuthService,
              private shared: UserAccountService) {}

  user = this.auth.getUser();

  ngOnInit(): void {
    this.extensionTableOptions.allowCheckbox = true;

    // this.extensionData = this.dataArray;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "User Account", active: false },
      { label: "User Account", active: true },
    ]);

    this.getUserDetails();
  }

  getUserDetails() {
    
    this.shared.getUserDetails(this.user?.id).subscribe({
      next: (response) => {
        console.log(response);
        this.tempuser = response;
      },
      error: (error) =>{
        console.log(error);
      }
    });

  }
  // generate() {
  //   window.alert("Invoice Generated");
  // }

  changePassword() {}

  onEditClicked() {

    this.isEditMode = true;
  }

  onSaveClicked() {
    // Implement save functionality
    this.isEditMode = false; // Disable edit mode
  }
}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { error } from "console";
import { result } from "lodash";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { UserAccountService } from "src/app/services/cams-new/user-account.service";
import { User } from "src/app/shared/models/Cams-new/User";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { UserAccountModalComponent } from "src/app/shared/widget/config/user-account-modal/user-account-modal.component";

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
  email!: string;
  phoneNumber!: string;

  tempuser: any = {};
  userModal!: User

  isEditMode: boolean = false; 


  isDirty: boolean = false; // Flag to track if field is dirty (has been touched)
  isPhoneNumberRequired: boolean = false; // Flag for required validation
  isInvalidPattern: boolean = false; // Flag for pattern validation
  isInvalidPhoneNumberType: boolean = false; // Flag for phone number type validation


  extensionTableOptions: tableOptions = new tableOptions();

  
  constructor(private breadcrumbService: BreadcrumbService, 
              private auth: AuthService,
              private shared: UserAccountService,
              private modalService: NgbModal,
              private alertService: MessageService,
              private appService: AppService,) { }

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

  changePassword(row:any) {
    this.openModal(
      "Password",
      "Change Password",
      this.user?.id,
      row.password,
      row.confirmPassword
    );
  }


  onEditClicked() {

    this.isEditMode = true;
  }

  onSaveClicked() {
    // Implement save functionality
    //this.putUser();
    this.isEditMode = false; // Disable edit mode
  }

  onPhoneNumberChanged() {
    // Update validation flags based on phone number value
    this.isDirty = true;
    this.isPhoneNumberRequired = this.phoneNumber.trim() === '';
    this.isInvalidPattern = !/^\d+$/.test(this.phoneNumber.trim());
    this.isInvalidPhoneNumberType = false; // Implement validation logic for phone number type
  }

  openModal(
    type:string,
    modalType:string,
    userId:number,
    password:string,
    confirmPassword:string
  ):void{

    const modalRef = this.modalService.open(
      UserAccountModalComponent,
      {
        size: "s",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );

    modalRef.componentInstance.type = type;
    modalRef.componentInstance.modalType = modalType;
    modalRef.componentInstance.userId = userId;
    modalRef.componentInstance.password = password;
    modalRef.componentInstance.confirmPassword = confirmPassword;

    modalRef.result.then((result) =>{
      if(result){
        console.log(result);
        this.userModal = result;
        this.postPassword(this.userModal);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  postPassword(user:any){
    this.shared.putUser(user).subscribe({
      next:(res)=>{
        console.log(res)
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
      },
      error: (error) => {
        console.log(error);
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0].UserUpdatedErrorSideAlertMessage
        );
        //this.alertService.warningSweetAlertMessage(error.error, "Error!", 4000);
      },
    });
  }

  putUser(user: User): void {
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
}

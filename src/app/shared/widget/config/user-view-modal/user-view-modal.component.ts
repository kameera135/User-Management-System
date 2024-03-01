import { Component, Input } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
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

  form!: FormGroup;

  showRequiredMessage = false;

  rolesViewTableOptions: tableOptions = new tableOptions();

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: UsersViewService,
    private alertService: MessageService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator]]
    });
  }

  phoneNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const phoneNumberRegex = /^[6|8|9]\d{7}$/; // Adjust the regex based on your requirements

    if (control.value && !phoneNumberRegex.test(control.value)) {
      return { 'invalidPhoneNumber': true };
    }

    return null;
  }

  showPasswordFields: boolean = false;

  // Methods to toggle between pages
  showPasswordPage() {
    this.showPasswordFields = true;
  }

  showUserDetailsPage() {
    this.showPasswordFields = false;
  }

  isFormValid(): boolean {
    return this.form.valid && this.form.dirty;
  }

  // Assuming this is in your component class
  isControlInvalidEmail(controlName: string): boolean {
  const control = this.form.get(controlName);

  if (!control) {
    return false;
  }

  if (control.hasError('required') || control.hasError('pattern')) {
    return true;
  }

  // Additional check for email to ensure it contains "@"
  if (controlName === 'email' && control.value && !control.value.includes('@')) {
    return true;
  }

  return false;
  }


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

    // Initialize the form group and controls
    this.form = new FormGroup({
      userName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/), // Only allow numeric input
        this.sgPhoneNumberValidator(), // Custom validator for Singapore phone number
      ],
      ),
      email: new FormControl('', Validators.required),
    });
  }

   // Define a custom validator for Singapore phone number
   sgPhoneNumberValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // Use a regular expression to check if it's a Singapore phone number
      const singaporePhoneNumberPattern = /^65\d{8}$/; // Customize the pattern as needed

      if (value && !singaporePhoneNumberPattern.test(value)) {
        return { invalidPhoneNumber: true };
      }

      return null;
    };
  }

  isControlInvalid(controlName: string): boolean | null{
    const control = this.form?.get(controlName);
    return !!control && (control.dirty||control.touched) && control.invalid;
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

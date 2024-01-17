import { Component } from "@angular/core";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { PasswordPolicyService } from "src/app/services/cams-new/password-policy.service";

@Component({
  selector: "app-password-policy",
  templateUrl: "./password-policy.component.html",
  styleUrls: ["./password-policy.component.scss"],
})
export class PasswordPolicyComponent {
  passwordMinLength!: number;
  passwordMaxLength!: number;
  passwordMinimumValidity!: number;
  passwordMinimumValidityTimeUnit!: string;
  passwordExpiry!: number;
  passwordExpiryTimeUnit!: string;
  passwordRepeatCheck!: number;
  maxAttempts!: number;
  lockoutDuration!: number;
  lockoutDurationTimeUnit!: string;

  canChangePasswordLengthMin: boolean = false;
  canChangePasswordLengthMax: boolean = false;
  canChangePasswordMinimumValidity: boolean = false;
  canChangePasswordExpiry: boolean = false;
  passwordExpiryWarning: boolean = false;
  canChangePasswordRepeatCheck: boolean = false;
  canChangeAccountLockout: boolean = false;
  isAbleLetters: boolean = false;
  isAbleNumericCharacters: boolean = false;
  isAbleSpecialCharacters: boolean = false;
  isAbleMixedCaseLetters: boolean = false;

  passwordMinLengthDefault: number = 1;
  passwordMaxLengthDefault: number = 50;

  timeUnitsList = [
    { id: "SC", value: "Seconds" },
    { id: "MI", value: "Minutes" },
    { id: "HO", value: "Hours" },
    { id: "DY", value: "Days" },
    { id: "WK", value: "Weeks" },
    { id: "YR", value: "Years" },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: PasswordPolicyService,
    private appService: AppService,
    private alertService: MessageService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Password Policy", active: false },
      { label: "Password Policy", active: true },
    ]);

    this.getPasswordPolicy();
  }

  getPasswordPolicy() {
    this.shared.getPasswordPolicy().subscribe({
      next: (response: any) => {
        console.log(response);

        this.passwordMinLength =
          response.password_min_length.value || this.passwordMinLengthDefault;
        this.passwordMaxLength =
          response.password_max_length.value || this.passwordMaxLengthDefault;
        this.passwordMinimumValidity = response.required.value || 0;
        this.passwordMinimumValidityTimeUnit = response.required.unit || "";
        this.passwordExpiry = response.password_expiry.value || 0;
        this.passwordExpiryTimeUnit = response.password_expiry.unit || "";
        this.passwordRepeatCheck = response.password_repeat_check.value || 0;
        this.maxAttempts = response.max_attempts || 0;
        this.lockoutDuration = response.lockout_duration.value || 0;
        this.lockoutDurationTimeUnit = response.lockout_duration.unit || "";
        this.canChangePasswordLengthMin =
          response.password_min_length.isOn || false;
        this.canChangePasswordLengthMax =
          response.password_max_length.isOn || false;
        this.canChangePasswordMinimumValidity = response.required.isOn || false;
        this.canChangePasswordExpiry = response.password_expiry.isOn || false;
        this.passwordExpiryWarning = response.password_expiry_warning || false;
        this.canChangePasswordRepeatCheck =
          response.password_repeat_check.isOn || false;
        this.canChangeAccountLockout = response.account_lockout || false;
        this.isAbleLetters = response.required.letters || false;
        this.isAbleNumericCharacters =
          response.required.numeric_characters || false;
        this.isAbleSpecialCharacters =
          response.required.special_characters || false;
        this.isAbleMixedCaseLetters =
          response.required.mixed_case_letters || false;
      },
      error: (error) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetPasswordPolicyErrorSideAlertMessage
        );
      },
    });
  }

  toggleChangePasswordLengthMin() {
    this.canChangePasswordLengthMin = !this.canChangePasswordLengthMin;
  }

  toggleChangePasswordLengthMax() {
    this.canChangePasswordLengthMax = !this.canChangePasswordLengthMax;
  }

  toggleChangePasswordMinimumValidity() {
    this.canChangePasswordMinimumValidity =
      !this.canChangePasswordMinimumValidity;
  }

  toggleChangePasswordExpiry() {
    this.canChangePasswordExpiry = !this.canChangePasswordExpiry;
  }

  toggleChangePasswordExpiryWarning() {
    this.passwordExpiryWarning = !this.passwordExpiryWarning;
  }

  toggleChangePasswordRepeatCheck() {
    this.canChangePasswordRepeatCheck = !this.canChangePasswordRepeatCheck;
  }

  toggleChangeAccountLockout() {
    this.canChangeAccountLockout = !this.canChangeAccountLockout;
  }

  toggleLetters() {
    this.isAbleLetters = !this.isAbleLetters;
  }

  toggleNumericCharacters() {
    this.isAbleNumericCharacters = !this.isAbleNumericCharacters;
  }

  toggleSpecialCharacters() {
    this.isAbleSpecialCharacters = !this.isAbleSpecialCharacters;
  }

  toggleMixedCaseLetters() {
    this.isAbleMixedCaseLetters = !this.isAbleMixedCaseLetters;
  }

  validateInput(event: any): void {
    const inputValue = event.target.value;
    const minValue = this.passwordMinLengthDefault;
    const maxValue = this.passwordMaxLength || this.passwordMaxLengthDefault;

    if (inputValue < minValue) {
      this.passwordMinLength = minValue;
    } else if (inputValue > maxValue) {
      this.passwordMinLength = maxValue;
    } else {
      this.passwordMinLength = inputValue;
    }
    //have to develop this method
  }

  //UMS_PP
  //{"password_min_length":{"isOn":false,"value":1},"password_max_length":{"isOn":false,"value":50},"required":{"letters":false,"numeric_characters":false,"special_characters":false,"mixed_case_letters":false},"password_expiry":{"isOn":false,"value":50,"unit":"DY"},"password_expiry_warning":false,"password_repeat_check":{"isOn":false,"value":50},"account_lockout":false,"max_attempts":5,"lockout_duration":{"value":50,"unit":"DY"}}
}

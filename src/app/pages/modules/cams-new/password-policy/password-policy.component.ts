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
  retryAttempts!: number;

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
}

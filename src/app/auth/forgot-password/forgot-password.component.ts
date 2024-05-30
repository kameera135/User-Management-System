import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forgotPassword } from 'src/app/shared/models/Cams-new/forgotPassword';
import { AppService } from 'src/app/app.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { MessageService } from 'src/app/services/PopupMessages/message.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {


  forgotPasswordForm!: FormGroup
  successMessage!: string;
  errorMessage!: string;
  showSuccess!: boolean;
  showError!: boolean;

  credentials!: forgotPassword


  constructor(
    private auth: AuthService,
    private userInfo: UserProfileService,
    private appConfigService: AppService,
    private alertService: MessageService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])
    })
  }

  public forgotPassword() {
    this.credentials = {
      email: this.forgotPasswordForm.value.email,
      clientURI: this.appConfigService.appConfig[0].clientURI
    }

    if (this.credentials.email == '') {
      this.alertService.sideErrorAlert(
        "Missing Info",
        "Please enter a email.",
      );
    }
    else if (this.forgotPasswordForm.valid) {
      this.userInfo.forgotPassword(this.credentials).subscribe({
        next: (response: any) => {
          console.log('Response from server: ', response);
          this.alertService.sideSuccessAlert(
            "Email Sent",
            "The link has been sent, please check your email to reset your password.",
          );
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.sideErrorAlert(
            "Wrong Email",
            "Email is not in use. Please check.",
          );
          console.log(this.errorMessage);
        }
      })
    }
    else {
      this.alertService.sideErrorAlert(
        "Email Sent",
        "Email format is incorrect. Enter valid email.",
      );
    }
  }
}

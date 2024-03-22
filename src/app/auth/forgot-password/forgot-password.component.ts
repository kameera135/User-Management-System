import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { auth } from 'src/app/shared/models/Cams-new/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forgotPassword } from 'src/app/shared/models/Cams-new/forgotPassword';
import { AppService } from 'src/app/app.service';
import { UserInformationService } from '../user-information.service';
import { UserProfileService } from 'src/app/core/services/user.service';

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
  
  constructor(private auth: AuthService,private userInfo: UserProfileService,private appConfigService: AppService) { }
  
  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required])
    })
  }

  validateControl = (controlName: string) => {
    const control = this.forgotPasswordForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  hasError = (controlName: string, errorName: string) => {
    const control = this.forgotPasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }

  public forgotPassword() {
    
    this.credentials = {
      email: this.forgotPasswordForm.value.email,
      clientURI: this.appConfigService.appConfig[0].clientURI
    }

    this.showError = this.showSuccess = false;

    this.userInfo.forgotPassword(this.credentials).subscribe({
      next: (response:any) => {
        console.log('Response from server: ', response);
        this.showSuccess = true;
        this.successMessage = 'The link has been sent, please check your email to reset your password.'
      },
      error: (err: HttpErrorResponse) => {

        this.showError = true;
        this.errorMessage = err.message;
        console.log(this.errorMessage);
      }
    })
  }
}

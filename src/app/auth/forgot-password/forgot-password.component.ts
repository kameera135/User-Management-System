import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
forgotPassword(arg0: any) {
throw new Error('Method not implemented.');
}

  forgotPasswordForm!: FormGroup
  successMessage!: string;
  errorMessage!: string;
  showSuccess!: boolean;
  showError!: boolean;
  
  constructor(private auth: AuthService) { }
  
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

  // public forgotPassword = (forgotPasswordFormValue) => {
  //   this.showError = this.showSuccess = false;
  //   const forgotPass = { ...forgotPasswordFormValue };

  //   const forgotPassDto: ForgotPasswordDto = {
  //     email: forgotPass.email,
  //     clientURI: 'http://localhost:4200/authentication/resetpassword'
  //   }

  //   this._authService.forgotPassword('api/accounts/forgotpassword', forgotPassDto)
  //   .subscribe({
  //     next: (_) => {
  //     this.showSuccess = true;
  //     this.successMessage = 'The link has been sent, please check your email to reset your password.'
  //   },
  //   error: (err: HttpErrorResponse) => {
  //     this.showError = true;
  //     this.errorMessage = err.message;
  //   }})
  // }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { resetPassword } from 'src/app/shared/models/Cams-new/resetPassword';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/services/PopupMessages/message.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  resetPasswordForm!: FormGroup
  successMessage!: string;
  errorMessage!: string;
  showSuccess!: boolean;
  showError!: boolean;

  hidePassword1: boolean = true;
  visible1: boolean = true

  hidePassword2: boolean = true;
  visible2: boolean = true


  credentials!: resetPassword

  private token!: string;
  private email!: string;
  
  constructor(private auth: AuthService, private router: ActivatedRoute, private userInfo: UserProfileService, private alertService: MessageService, private app: AppService) { }
  
  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });

    //this.resetPasswordForm.get('confirm').setValidators([Validators.required,this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);

    this.token = this.router.snapshot.queryParams['token'];
    this.email = this.router.snapshot.queryParams['email'];
  }

  validateControl = (controlName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  hasError = (controlName: string, errorName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }

  resetPassword(){

    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    this.credentials = {
      password: this.resetPasswordForm.value.password,
      confirmPassword: this.resetPasswordForm.value.confirm,
      email: this.email,
      token: this.token
    }

    
    if(this.credentials.password == '' && this.credentials.confirmPassword == ''){
      this.alertService.sideErrorAlert(
        "Missing Info",
        this.app.popUpMessageConfig[0].PasswordAndConfirmPasswordMissingErrorAlertMessage,
      );
      return;
    }

    if(this.credentials.password == ''){
      this.alertService.sideErrorAlert(
        "Missing Info",
        this.app.popUpMessageConfig[0].PasswordMissingErrorAlertMessage,
      );
      return;
    }

    if(this.credentials.password != this.credentials.confirmPassword){
      this.alertService.sideErrorAlert(
        "Missing Info",
        this.app.popUpMessageConfig[0].PasswordConfirmationNotMatchingErrorAlertMessage,
      );
      return;
    }

    if(this.resetPasswordForm.valid){
      this.userInfo.resetPassword(this.credentials).subscribe({
        next: (response:any) => {
          console.log('Response from server: ', response);
          this.alertService.sideSuccessAlert(
            "Password Reset Success",
            this.app.popUpMessageConfig[0].PasswordResetSuccessAlertMessage,
          );
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.sideErrorAlert(
            "Password Reset Failed",
            this.app.popUpMessageConfig[0].PasswordResetErrorAlertMessage,
          );
          console.log(this.errorMessage);
        }
      })
    }
  }

  togglePasswordVisibility1(): void {
    this.hidePassword1 = !this.hidePassword1;
    this.visible1 = !this.visible1;
  }

  togglePasswordVisibility2(): void {
    this.hidePassword2 = !this.hidePassword2;
    this.visible2 = !this.visible2;
  }


}

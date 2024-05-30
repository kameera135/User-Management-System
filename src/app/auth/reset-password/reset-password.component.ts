import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { resetPassword } from 'src/app/shared/models/Cams-new/resetPassword';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/services/PopupMessages/message.service';

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

  hidePassword: boolean = true;
  visible: boolean = true


  credentials!: resetPassword

  private token!: string;
  private email!: string;
  
  constructor(private auth: AuthService, private router: ActivatedRoute, private userInfo: UserProfileService, private alertService: MessageService) { }
  
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
        "Please enter a password and confirm the password",
      );
      return;
    }

    if(this.credentials.password == ''){
      this.alertService.sideErrorAlert(
        "Missing Info",
        "Please enter a password",
      );
      return;
    }

    if(this.credentials.password != this.credentials.confirmPassword){
      this.alertService.sideErrorAlert(
        "Missing Info",
        "Password confirmation not match. Enter same password",
      );
      return;
    }

    if(this.resetPasswordForm.valid){
      this.userInfo.resetPassword(this.credentials).subscribe({
        next: (response:any) => {
          console.log('Response from server: ', response);
          this.alertService.sideSuccessAlert(
            "Password Reset Success",
            "Password is reset successfully. Log in using the new password",
          );
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.sideErrorAlert(
            "Password Reset Failed",
            "There is an error in password reset. Contact system administrater",
          );
          console.log(this.errorMessage);
        }
      })
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.visible = !this.visible;
  }

}

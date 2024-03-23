import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { resetPassword } from 'src/app/shared/models/Cams-new/resetPassword';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileService } from 'src/app/core/services/user.service';

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

  credentials!: resetPassword

  private token!: string;
  private email!: string;
  
  constructor(private auth: AuthService, private router: ActivatedRoute, private userInfo: UserProfileService) { }
  
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

    this.credentials = {
      password: this.resetPasswordForm.value.password,
      confirmPassword: this.resetPasswordForm.value.confirm,
      email: this.email,
      token: this.token
    }

    this.showError = this.showSuccess = false;

    this.userInfo.resetPassword(this.credentials).subscribe({
      next: (response:any) => {
        console.log('Response from server: ', response);
        this.showSuccess = true;
      },
      error: (err: HttpErrorResponse) => {

        this.showError = true;
        this.errorMessage = "Please enter same password";
        console.log(this.errorMessage);
      }
    })
  }

}

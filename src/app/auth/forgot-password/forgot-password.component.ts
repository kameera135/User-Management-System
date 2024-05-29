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
import Swal from 'sweetalert2';

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
      email: new FormControl("", [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])
    })
  }

  public forgotPassword() {

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
      email: this.forgotPasswordForm.value.email,
      clientURI: this.appConfigService.appConfig[0].clientURI
    }

    if(this.credentials.email == ''){
      Toast.fire({
        icon: "error",
        title: "Please enter a email."
      });
    }

    if(this.forgotPasswordForm.valid){
      this.userInfo.forgotPassword(this.credentials).subscribe({
        next: (response:any) => {
          console.log('Response from server: ', response);
          Toast.fire({
            icon: "success",
            title: "The link has been sent, please check your email to reset your password."
          });
        },
        error: (err: HttpErrorResponse) => {
          Toast.fire({
            icon: "error",
            title: "Email is not in use. Please check"
          });
          console.log(this.errorMessage);
        }
      })
    }
    else{
      Toast.fire({
        icon: "error",
        title: "Email format is incorrect. Enter valid email"
      });
    }
  }
}

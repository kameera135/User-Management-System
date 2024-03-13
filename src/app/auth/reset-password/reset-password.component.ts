import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
forgotPassword(arg0: any) {
throw new Error('Method not implemented.');
}

  resetPasswordForm!: FormGroup
  successMessage!: string;
  errorMessage!: string;
  showSuccess!: boolean;
  showError!: boolean;
  
  constructor(private auth: AuthService) { }
  
  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required])
    })
  }

  validateControl = (controlName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  hasError = (controlName: string, errorName: string) => {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }

}

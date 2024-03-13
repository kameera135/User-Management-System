import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { WidgetModule } from "../shared/widget/widget.module";
import { LayoutsModule } from '../layouts/layouts.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { PagesModule } from '../pages/pages.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';



@NgModule({
    declarations: [LoginComponent, ResetPasswordComponent, ForgotPasswordComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class AuthModule { }

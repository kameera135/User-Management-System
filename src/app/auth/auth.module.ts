import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { WidgetModule } from "../shared/widget/widget.module";
import { LayoutsModule } from '../layouts/layouts.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../layouts/navbar/navbar.component';



@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        WidgetModule,
        ReactiveFormsModule,
        //LayoutsModule
    ]
})
export class AuthModule { }

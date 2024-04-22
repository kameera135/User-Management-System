import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ScrollspyDirective } from './scrollspy.directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { WidgetModule } from "./widget/widget.module";
import { AuthModule } from '../auth/auth.module';




@NgModule({
    declarations: [
        BreadcrumbsComponent,
        ScrollspyDirective,
    ],
    exports: [
        BreadcrumbsComponent,
        ScrollspyDirective
    ],
    imports: [
        CommonModule,
        NgbNavModule,
        NgbAccordionModule,
        NgbDropdownModule,
        FormsModule,
        MatRadioModule,
        MatButtonModule,
        WidgetModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule { }

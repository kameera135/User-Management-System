import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ScrollspyDirective } from './scrollspy.directive';

import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    BreadcrumbsComponent,
    ScrollspyDirective,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    FormsModule,
    MatRadioModule, 
    MatButtonModule
  ],
  exports: [
    BreadcrumbsComponent,
    ScrollspyDirective
  ]
})
export class SharedModule { }

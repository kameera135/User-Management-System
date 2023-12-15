import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NgbDropdownModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";
import { LanguageService } from "../core/services/language.service";
import { TranslateModule } from "@ngx-translate/core";

// Component pages
import { LayoutComponent } from "./layout.component";
import { FooterComponent } from "./footer/footer.component";
import { HorizontalComponent } from "./theme/theme.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SharedModule } from "../shared/shared.module";
import { TopbarComponent } from "./topbar/topbar.component";

@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    FooterComponent,
    HorizontalComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    TranslateModule,
    SharedModule,
  ],
  providers: [LanguageService],
})
export class LayoutsModule { }

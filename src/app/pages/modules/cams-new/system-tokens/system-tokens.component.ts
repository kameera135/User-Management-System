import { Component } from "@angular/core";
import { SystemTokensService } from "src/app/services/cams-new/system-tokens.service";

@Component({
  selector: "app-system-tokens",
  templateUrl: "./system-tokens.component.html",
  styleUrls: ["./system-tokens.component.scss"],
})
export class SystemTokensComponent {
  constructor(private shared: SystemTokensService) {}
}

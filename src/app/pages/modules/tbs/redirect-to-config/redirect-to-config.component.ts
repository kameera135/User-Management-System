import { Component } from "@angular/core";
import { AppService } from "src/app/app.service";

@Component({
  selector: "app-redirect-to-config",
  templateUrl: "./redirect-to-config.component.html",
  styleUrls: ["./redirect-to-config.component.scss"],
})
export class RedirectToConfigComponent {
  constructor(private appConfigService: AppService) {}

  ngOnInit() {
    window.location.href = this.appConfigService.appConfig[0].configModule;
  }
}

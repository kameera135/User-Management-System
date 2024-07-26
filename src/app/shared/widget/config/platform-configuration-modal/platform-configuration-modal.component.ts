import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { Platform } from "src/app/shared/models/Cams-new/Platform";

@Component({
  selector: "app-platform-configuration",
  templateUrl: "./platform-configuration-modal.component.html",
  styleUrls: ["./platform-configuration-modal.component.scss"],
})
export class PlatformConfigurationModalComponent {
  //roleList: any[] = this.appService.appConfig[0].roleList;
  platformList: any[] = this.appService.appConfig[0].platformList;

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() platformId!: number;
  @Input() platformCode!: string;
  @Input() platformName!: string;
  @Input() description!: string;
  @Input() platformUrl!: string;
  externalLink: boolean = false;

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  // Array to hold the dropdown options
  statusOptions: { label: string; value: string }[] = [
    { label: "Active", value: "Active" },
    { label: "Deactive", value: "Deactive" },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService
  ) { }

  ngOnInit() {
    if (this.type == "Add") {
      //main button
      this.buttonName = "Add";
      this.buttonIcon = "bi-plus-lg";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
    }
    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;
  }

  checkExternalLink(event: any) {
    this.externalLink = event.target.checked;
  }

  onFormSubmit() {
    if (this.type == 'Add' && (this.platformName == "" || this.description == "" || this.platformUrl == "")) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const platform = new Platform();
    platform.platformId = this.platformId;
    platform.platformCode = this.platformCode;
    platform.platformName = this.platformName;
    platform.description = this.description;
    platform.platformUrl = this.platformUrl;
    platform.externalLink = this.externalLink

    this.activeModal.close(platform);
  }
}

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { Feature } from "src/app/shared/models/Cams-new/Feature";

@Component({
  selector: "app-feature-configuration-modal",
  templateUrl: "./feature-configuration-modal.component.html",
  styleUrls: ["./feature-configuration-modal.component.scss"],
})
export class FeatureConfigurationModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() featureCode!: string;
  @Input() feature!: string;
  @Input() createdDate!: string;
  @Input() status!: any;

  buttonName!: string;
  buttonIcon!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService
  ) {}

  ngOnInit() {
    if (this.type == "Add") {
      this.buttonName = "Add";
      this.buttonIcon = "bi-person-plus-fill";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
    }
  }

  onFormSubmit() {
    if (
      this.featureCode == "" ||
      this.feature == "" ||
      this.createdDate == "" ||
      this.status == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const feature = new Feature();
    feature.featureCode = this.featureCode;
    feature.feature = this.feature;
    feature.createdDate = this.createdDate;
    feature.status = this.status;

    this.activeModal.close(feature);
  }
}

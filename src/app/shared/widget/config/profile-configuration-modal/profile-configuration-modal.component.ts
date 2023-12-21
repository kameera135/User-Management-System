import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { Profile } from "src/app/shared/models/Cams-new/Profile";

@Component({
  selector: "app-profile-configuration-modal",
  templateUrl: "./profile-configuration-modal.component.html",
  styleUrls: ["./profile-configuration-modal.component.scss"],
})
export class ProfileConfigurationModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() profileCode!: string;
  @Input() createdDate!: string;
  @Input() createdBy!: string;
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
      this.profileCode == "" ||
      this.createdDate == "" ||
      this.createdBy == "" ||
      this.status == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const profile = new Profile();
    profile.profileCode = this.profileCode;
    profile.createdDate = this.createdDate;
    profile.createdBy = this.createdBy;
    profile.status = this.status;

    this.activeModal.close(profile);
  }
}

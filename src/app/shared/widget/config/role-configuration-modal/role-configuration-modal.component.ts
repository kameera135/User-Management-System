import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { Role as Role } from "src/app/shared/models/Cams-new/Role";

@Component({
  selector: "app-role-configuration-modal",
  templateUrl: "./role-configuration-modal.component.html",
  styleUrls: ["./role-configuration-modal.component.scss"],
})
export class RoleConfigurationModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() roleCode!: string;
  @Input() roleName!: string;
  @Input() createdDate!: string;
  @Input() description!: string;
  @Input() status!: any;

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

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

    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;
  }

  onFormSubmit() {
    if (
      this.roleCode == "" ||
      this.roleName == "" ||
      this.createdDate == "" ||
      this.description == "" ||
      this.status == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const role = new Role();
    role.roleCode = this.roleCode;
    role.roleName = this.roleName;
    role.createdDate = this.createdDate;
    role.description = this.description;
    role.status = this.status;

    this.activeModal.close(role);
  }
}

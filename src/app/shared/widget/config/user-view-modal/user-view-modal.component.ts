import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { User } from "src/app/shared/models/Cams-new/User";

@Component({
  selector: "app-user-view-modal",
  templateUrl: "./user-view-modal.component.html",
  styleUrls: ["./user-view-modal.component.scss"],
})
export class UserViewModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;
  @Input() userName!: string;
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() role!: any;
  @Input() email!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService
  ) {}

  ngOnInit() {
    console.log(
      this.userName,
      this.firstName,
      this.lastName,
      this.role,
      this.email
    );
  }

  onFormSubmit() {
    if (
      this.userName == "" ||
      this.firstName == "" ||
      this.lastName == "" ||
      this.role == "" ||
      this.email == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const user = new User();
    user.userName = this.userName;
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.role = this.role;
    user.email = this.email;

    this.activeModal.close(user);
  }
}

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-update-confirmation-modal",
  templateUrl: "./update-confirmation-modal.component.html",
  styleUrls: ["./update-confirmation-modal.component.scss"],
})
export class UpdateConfirmationModalComponent {
  @Input() notificationMessage!: string;

  constructor(public activeModal: NgbActiveModal) {}

  onYesButtonClicked() {
    this.activeModal.close("Yes");
  }
  onNoButtonClicked() {
    this.activeModal.close("No");
  }
}

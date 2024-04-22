import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MeterReset } from "src/app/shared/models/Tbs/meterReset";

@Component({
  selector: "app-activity-logs-modal",
  templateUrl: "./activity-logs-modal.component.html",
  styleUrls: ["./activity-logs-modal.component.scss"],
})
export class ActivityLogsModalComponent {
  @Input() modalTitle!: string;
  @Input() details!: any;

  constructor(
    public activeModal: NgbActiveModal,
    private appService: AppService
  ) {}

  ngOnInit() {}
}

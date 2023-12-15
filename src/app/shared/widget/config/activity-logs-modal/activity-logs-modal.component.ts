import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { MeterReset } from "src/app/shared/models/Tbs/meterReset";

@Component({
  selector: "app-activity-logs-modal",
  templateUrl: "./activity-logs-modal.component.html",
  styleUrls: ["./activity-logs-modal.component.scss"],
})
export class ActivityLogsModalComponent {
  @Input() modalTitle!: any;
  @Input() status!: boolean;
  @Input() date!: string;
  @Input() timeBeforeReset!: string;
  @Input() valueBeforeReset!: number;
  @Input() meterCode!: string;
  @Input() endValue!: number;
  @Input() startValue!: number;
  @Input() resetMode!: string;
  @Input() ack!: boolean;

  meterReading!: number;

  resetModeList = ["Manual", "Auto"];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService
  ) {}

  add() {}

  onFormSubmit() {
    if (
      this.date == "" ||
      this.timeBeforeReset == "" ||
      this.valueBeforeReset == null ||
      this.meterCode == "" ||
      this.endValue == null ||
      this.startValue == null ||
      this.resetMode == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    } else if (this.endValue < 0 || this.startValue < 0) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please enter positive values",
        duration: 2000,
      });
      return;
    }

    const updatedMeterResetData = new MeterReset();
    updatedMeterResetData.date = this.date;
    updatedMeterResetData.timeBeforeReset = this.timeBeforeReset;
    updatedMeterResetData.valueBeforeReset = this.valueBeforeReset;
    updatedMeterResetData.meterId = this.meterCode;
    updatedMeterResetData.lastValue = this.endValue;
    updatedMeterResetData.startValue = this.startValue;
    updatedMeterResetData.resetMode = "Manual";
    updatedMeterResetData.ack = true;
    this.activeModal.close(updatedMeterResetData);
  }
}

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { Meter } from "src/app/shared/models/Tbs/meter";
import { MeterCompensate } from "src/app/shared/models/Tbs/meterCompensate";

@Component({
  selector: "app-user-view-modal",
  templateUrl: "./user-view-modal.component.html",
  styleUrls: ["./user-view-modal.component.scss"],
})
export class UserViewModalComponent {
  @Input() modalTitle!: any;
  @Input() status!: boolean;
  @Input() meterId!: string;
  @Input() meterName!: string;

  selectedDate!: {
    year: number;
    month: number;
    day: number;
  };

  date!: string;
  meterCode!: string;
  normalCompensate: number = 0;
  extendedCompensate: number = 0;

  selectedMeter: string = "";
  selectedMeterMode: string = "";
  meterList: any[] = [];

  meters!: Meter[];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService
  ) {
    this.selectedDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
    };
  }

  ngOnInit(): void {
    console.log("meterId", this.meterId);
    console.log("meterName", this.meterName);
    this.getMeters();
  }

  getMeters() {
    // this.shared.getMeters().subscribe({
    //   next: (result: any) => {
    //     this.meters = result;
    //     this.meterList = this.meters.map((item: any) => ({
    //       value: item.meterName,
    //       id: item.meterId,
    //     }));
    //   },
    // });
  }

  add() {}

  loadData() {}

  onFormSubmit() {
    this.getDate();

    if (
      this.date == "" ||
      this.meterCode == "" ||
      this.normalCompensate == null ||
      this.extendedCompensate == null
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const inputDate = new Date(this.date);

    if (isNaN(inputDate.getTime()) || inputDate > new Date()) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please select a valid date.",
        duration: 2000,
      });
      return;
    }

    const newMeterCompensate = new MeterCompensate();
    newMeterCompensate.date = this.date;
    newMeterCompensate.meterCode = this.meterId;
    newMeterCompensate.normalCompenstate = this.normalCompensate;
    newMeterCompensate.extendedCompenstate = this.extendedCompensate;

    this.activeModal.close(newMeterCompensate);
  }

  getDate(): void {
    try {
      const yearString = this.selectedDate.year.toString();
      const monthString = this.selectedDate.month.toString().padStart(2, "0");
      const dayString = this.selectedDate.day.toString().padStart(2, "0");

      this.date = yearString + "-" + monthString + "-" + dayString;
    } catch {
      this.date = "0000-00-00";
    }
  }
}

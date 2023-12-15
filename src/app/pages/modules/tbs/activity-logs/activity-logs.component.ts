import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { MeterReset } from "src/app/shared/models/Tbs/meterReset";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { ActivityLogsModalComponent } from "src/app/shared/widget/config/activity-logs-modal/activity-logs-modal.component";
import Swal from "sweetalert2";
@Component({
  selector: "app-activity-logs",
  templateUrl: "./activity-logs.component.html",
  styleUrls: ["./activity-logs.component.scss"],
})
export class ActivityLogsComponent {
  loadingInProgress: boolean = false;
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  serviceList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tableData: any[] = [];
  meterResetDataModel!: MeterReset;
  meterResetData!: MeterReset[];
  meterResetByMeterId!: any;
  extensionTableOptions: tableOptions = new tableOptions();
  headArray = [
    { Head: "Meter ID", FieldName: "MeterCode", ColumnType: "Data" },
    { Head: "Date", FieldName: "Date", ColumnType: "Data" },
    {
      Head: "Time Before Reset",
      FieldName: "TimeBeforeReset",
      ColumnType: "Data",
    },
    {
      Head: "Value Before Reset",
      FieldName: "ValueBeforeReset",
      ColumnType: "Data",
    },
    { Head: "Reset Mode", FieldName: "ResetMode", ColumnType: "Data" },
    { Head: "Reset Value", FieldName: "EndValue", ColumnType: "Data" },
    { Head: "Start Value", FieldName: "StartValue", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];
  meterResetDataArray = [
    {
      Id: 0,
      Date: "",
      TimeBeforeReset: "",
      ValueBeforeReset: 0,
      MeterCode: "",
      LastReading: 0,
      EndValue: 0,
      StartValue: 0,
      ResetMode: "",
      Acknowledge: false,
      changeButton: false,
    },
  ];
  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: ActivityLogsService,
    private notifierService: NgToastService,
    private modalService: NgbModal,
    private appService: AppService,
    private sweetAlert: MessageService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Activity Logs", active: false },
      { label: "Activity Logs", active: true },
    ]);

    const currentYear = new Date().getFullYear();
    this.yearList = Array.from(
      { length: this.appService.appConfig[0].maximumYearRangeForMeterInfo },
      (_, index) => {
        const year = currentYear - index;
        return { value: year.toString(), id: index + 1 };
      }
    );

    //this.monthList = this.shared.monthList;
    this.extensionTableOptions.allowAcknowledgeButton = true;
    this.extensionTableOptions.allowDisplayAcknowledgedButton = true;
    this.extensionTableOptions.allowUpdateMeterResetButton = true;
    this.extensionTableOptions.recordApproveConfirmationMessage =
      "Do you Acknowledge?";
    this.extensionTableOptions.recordRejectingConfirmationMessage =
      "Do you want to remove this Activity Logs record?";
    this.extensionTableOptions.rowEditConfirmationMessage =
      "Do you want to edit this Activity Logs record?";
    this.getMeterResetData();
  }
  getMeterResetData() {
    if (this.selectedYear != "" && this.selectedMonth != "") {
      this.loadData();
    }
  }
  loadData() {
    // this.loadingInProgress = true;
    // this.shared
    //   .getMeterResetData(this.selectedYear, this.selectedMonth)
    //   .subscribe({
    //     next: (result: any) => {
    //       this.meterResetData = result;
    //       this.updateTable();
    //       this.tableData = this.meterResetDataArray;
    //       console.log("get tableData");
    //       console.log(this.tableData);
    //       this.loadingInProgress = false;
    //     },
    //     error: (error) => {
    //       console.log("Getting meter compensate data: error");
    //       console.log(error);
    //       this.meterResetDataArray = [];
    //       this.notifierService.error({
    //         detail: "Error",
    //         summary: "Could not retrieve the data list.",
    //         duration: 4000,
    //       });
    //       this.loadingInProgress = false;
    //     },
    //   });
  }
  updateTable() {
    this.meterResetDataArray = this.meterResetData.map((item) => ({
      Id: item.id,
      Date: item.date.slice(0, -9),
      TimeBeforeReset: item.timeBeforeReset,
      ValueBeforeReset: item.valueBeforeReset,
      MeterCode: item.meterId,
      LastReading: item.lastReading,
      EndValue: item.lastValue,
      StartValue: item.startValue,
      ResetMode: item.resetMode,
      Acknowledge: item.ack,
      changeButton: item.ack === true ? true : false,
    }));
  }
  editMeterReset(item: any): void {
    const addReadingsModal = this.modalService.open(
      ActivityLogsModalComponent,
      {
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }
    );
    addReadingsModal.componentInstance.modalTitle = "Edit Activity Logs";
    addReadingsModal.componentInstance.date = item.Date;
    addReadingsModal.componentInstance.timeBeforeReset = item.TimeBeforeReset;
    addReadingsModal.componentInstance.valueBeforeReset = item.ValueBeforeReset;
    addReadingsModal.componentInstance.meterCode = item.MeterCode;
    addReadingsModal.componentInstance.endValue = item.EndValue;
    addReadingsModal.componentInstance.startValue = item.StartValue;
    addReadingsModal.componentInstance.resetMode = item.ResetMode;
    addReadingsModal.componentInstance.ack = item.Ack;
    this.meterResetByMeterId = this.meterResetData.find(
      (meterReset) => meterReset.id === item.Id
    );
    addReadingsModal.result
      .then((result) => {
        if (result) {
          console.log("Getting data from edit-activity-logs modal to post");
          console.log("main", result);
          this.meterResetDataModel = result;
          const editMeterResetDataArray = {
            lastValue: this.meterResetDataModel.lastValue,
            startValue: this.meterResetDataModel.startValue,
            resetMode: this.meterResetDataModel.resetMode,
            ack: this.meterResetDataModel.ack,
            updatedBy: this.shared.user,
          };
          console.log("editMeterResetDataArray", editMeterResetDataArray);
          this.updateMeterResetData(item.Id, editMeterResetDataArray);
        } else {
          console.log("Data not submitted");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  updateMeterResetData(meterResetId: number, MeterResetData: any) {
    // this.shared.putMeterReset(meterResetId, MeterResetData).subscribe({
    //   next: (results: any) => {
    //     console.log("Editing a Activity Logs: ");
    //     console.log(results);
    //     this.notifierService.success({
    //       detail: "Success",
    //       summary: "Activity Logs edited successfully !",
    //       duration: 4000,
    //     });
    //     this.sweetAlert.successSweetAlertMessage(
    //       "Activity Logs has been updated.",
    //       "Updated!",
    //       4000
    //     );
    //     // Swal.fire({
    //     //   title: 'Edited!',
    //     //   text: 'Activity Logs has been edited.',
    //     //   icon: 'success',
    //     //   confirmButtonColor: '#299CDB',
    //     //   timer: this.appService.popUpMessageConfig[0].messageDurationInMiliSeconds,
    //     //   timerProgressBar: true,
    //     //   willClose: () => {
    //     //     clearInterval(4000);
    //     //   },
    //     // });
    //     this.loadData();
    //   },
    //   error: (error: any) => {
    //     console.log("Editing a Activity Logs : error");
    //     console.log(error);
    //     this.notifierService.error({
    //       detail: "Error",
    //       summary: "Edition failed.",
    //       duration: 4000,
    //     });
    //   },
    // });
  }

  setAsAcknowledged(item: any): void {
    console.log(item);
    const meterResetId = item.Id;

    let acknowledgeDataAray = { ack: "true", updatedBy: this.shared.user };

    // this.shared
    //   .putMeterResetAcknowledge(meterResetId, acknowledgeDataAray)
    //   .subscribe({
    //     next: (results: any) => {
    //       console.log("Acknowledged Activity Logs: ");
    //       console.log(results);
    //       this.notifierService.success({
    //         detail: "Success",
    //         summary: "Activity Logs acknowledged successfully !",
    //         duration: 4000,
    //       });

    //       this.sweetAlert.successSweetAlertMessage(
    //         "Activity Logs has been Acknowledged.",
    //         "Acknowledged!",
    //         4000
    //       );
    //       // Swal.fire({
    //       //   title: 'Acknowledged!',
    //       //   text: 'Activity Logs has been Acknowledged.',
    //       //   icon: 'success',
    //       //   confirmButtonColor: '#299CDB',
    //       //   timer: this.appService.popUpMessageConfig[0].messageDurationInMiliSeconds,
    //       //   timerProgressBar: true,
    //       //   willClose: () => {
    //       //     clearInterval(4000);
    //       //   },
    //       // });
    //       this.loadData();
    //     },
    //     error: (error: any) => {
    //       console.log("Acknowledge Activity Logs : error");
    //       console.log(error);
    //       this.notifierService.error({
    //         detail: "Error",
    //         summary: "Acknowledgement failed.",
    //         duration: 4000,
    //       });
    //     },
    //   });
  }
}

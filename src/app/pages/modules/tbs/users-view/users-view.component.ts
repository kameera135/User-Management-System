import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { UsersViewService } from "src/app/services/cams-new/users-view.service";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { AutoMeterReading } from "src/app/shared/models/Tbs/autoMeterReadings";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { Meter } from "src/app/shared/models/Tbs/meter";
import { ReportService } from "src/app/services/ReportServices/report.service";
import { AppService } from "src/app/app.service";

@Component({
  selector: "app-users-view",
  templateUrl: "./users-view.component.html",
  styleUrls: ["./users-view.component.scss"],
})
export class UsersViewComponent {
  dropDownList = this.appService.tempData[0].users[0].dropDown;

  asseteTreeData: any = {};

  unitName!: string;
  unitId!: string;
  selectedMeterCode: string = "";
  selectedTimeInterval: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  service: string = "";
  serviceUnit: string = "";
  meterType: string = "Auto";
  meterList: any[] = [];
  meterCodeList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  intervalList: any[] = [];
  tableData: any[] = [];
  loadingInProgress: boolean = false;
  unitsLoading: boolean = false;

  meterReadingModel!: AutoMeterReading;
  meterReadings!: AutoMeterReading[];

  selectedUnit!: Unit;

  meterModal!: Meter;
  meters!: Meter[];

  totalDataCount!: number;
  selectedPage: number = 1;
  selectedPageSize: number = 20;

  reportMonth!: any;
  exportDateTime!: string;

  selectedMeterTag: string = "";

  extensionTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "Date", FieldName: "Date", ColumnType: "Data" },
    { Head: "Time", FieldName: "Time", ColumnType: "Data" },
    { Head: "Meter Reading", FieldName: "MeterReading", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  //dataArray = []
  meterReadingsDataArray: any = [];

  meterDataArray = [{ value: "" }];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: UsersViewService,
    private notifierService: NgToastService,
    private modalService: NgbModal,
    private reportService: ReportService,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    if (this.unitId) {
      this.fetchMeterListByUnitId(this.unitId);
    }
    this.fetchAssertTree();

    this.tableData = this.meterReadingsDataArray;

    this.extensionTableOptions.allowExportButton = true;
    this.extensionTableOptions.allowCheckbox = true;
    this.extensionTableOptions.allowBulkApproveButton = true;
    this.extensionTableOptions.allowActivateButton = true;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Users", active: false },
      { label: "Users", active: true },
    ]);

    this.intervalList = [
      { value: "10 Min", id: 1 },
      { value: "30 Min", id: 2 },
      { value: "1 Hour", id: 3 },
    ];

    const currentYear = new Date().getFullYear();
    this.yearList = Array.from(
      { length: this.appService.appConfig[0].maximumYearRangeForMeterInfo },
      (_, index) => {
        const year = currentYear - index;
        return { value: year.toString(), id: index + 1 };
      }
    );

    this.monthList = [
      { value: "January", id: 1 },
      { value: "February", id: 2 },
      { value: "March", id: 3 },
      { value: "April", id: 4 },
      { value: "May", id: 5 },
      { value: "June", id: 6 },
      { value: "July", id: 7 },
      { value: "August", id: 8 },
      { value: "September", id: 9 },
      { value: "October", id: 10 },
      { value: "November", id: 11 },
      { value: "December", id: 12 },
    ];

    // this.asseteTreeData = [
    //   {
    //     name: "Site",
    //     id: 1,
    //     icon: "account_tree",
    //     isUnit: false,
    //     children: [
    //       {
    //         name: "Block1",
    //         id: 2,
    //         icon: "location_city",
    //         isUnit: false,
    //         children: [
    //           {
    //             name: "Tower1",
    //             id: 3,
    //             icon: "reorder",
    //             isUnit: false,
    //             children: [
    //               {
    //                 name: "Level1",
    //                 id: 4,
    //                 icon: "reorder",
    //                 isUnit: false,
    //                 children: [
    //                   {
    //                     name: "Zone1",
    //                     id: 5,
    //                     icon: "widgets",
    //                     isUnit: false,
    //                     children: [
    //                       { name: "STN1-BLD2-UNT-749567", id: 8, icon: "power", isUnit: true },
    //                       { name: "STN1-BLD2-UNT-264591", id: 11, icon: "power", isUnit: true },
    //                       { name: "STN1-BLD2-UNT-264592", id: 13, icon: "power", isUnit: true },
    //                     ]
    //                   },

    //                 ]
    //               },
    //               {
    //                 name: "Zone2",
    //                 id: 9,
    //                 icon: "people",
    //                 isUnit: false,
    //                 children: [
    //                   { name: "STN1-BLD2-UNT-685469", id: 14, icon: "power", isUnit: true },
    //                   { name: "STN1-BLD2-UNT-502549", id: 15, icon: "power", isUnit: true },
    //                 ]
    //               },
    //             ]
    //           }
    //         ]
    //       }

    //     ]
    //   }
    // ];

    this.getAutoMeterReadings();
  }

  onAsseteTreeChanged(selectedItems: any[]): void {
    window.alert(selectedItems.map((x) => x.unitName).join(", ") + " selected");
  }

  getAutoMeterReadings() {
    if (
      this.selectedYear != "" &&
      this.selectedMonth != "" &&
      this.selectedMeterCode != "" &&
      this.unitId != ""
    ) {
      this.fetchTheService(this.unitId);

      // if (this.selectedMeterTag != "") {
      //   this.loadData();
      // }
    }
  }

  loadData() {
    this.loadingInProgress = true;

    // if (this.selectedMeterTag != "" && this.selectedMeterTag != undefined) {
    //   this.shared
    //     .getMeterReadings(
    //       this.selectedMeterTag,
    //       this.selectedYear,
    //       this.selectedMonth,
    //       this.selectedPage,
    //       this.selectedPageSize
    //     )
    //     .subscribe({
    //       next: (result: any) => {
    //         console.log(result);
    //         this.meterReadings = result.response;
    //         this.totalDataCount = result.rowCount;
    //         console.log("Getting meter readings: ");
    //         console.log(this.meterReadings);

    //         this.updateTable();
    //         this.tableData = this.meterReadingsDataArray;
    //         this.loadingInProgress = false;
    //       },
    //       error: (error) => {
    //         console.log("Getting meter readings: error");
    //         console.log(error);
    //         this.meterReadingsDataArray = [];
    //         this.notifierService.error({
    //           detail: "Error",
    //           summary: "Could not retrieve the data list.",
    //           duration: 4000,
    //         });
    //         this.loadingInProgress = false;
    //       },
    //     });
    // } else {
    //   this.meterReadings = [];
    //   this.meterReadingsDataArray = [];
    //   this.tableData = [];
    //   this.updateTable();
    //   this.loadingInProgress = false;
    // }

    // if (this.selectedMeterCode != "") {
    //   this.tableData = this.meterReadingsDataArray;
    // }
  }

  addReadings(): void {
    // const addReadingsModal = this.modalService.open(AddAReadingModalComponent, {
    //   size: "md",
    //   centered: true,
    //   backdrop: "static",
    //   keyboard: false,
    // });
    // addReadingsModal.componentInstance.modalTitle = "Enter meter reading";
  }

  updateTable() {
    this.meterReadingsDataArray = this.meterReadings.map((item) => ({
      Date: item.ts.slice(0, -9),
      Time: item.ts.slice(11),
      MeterReading: item.value,
    }));
    this.tableData = this.meterReadingsDataArray;
  }

  fetchMeterListByUnitId(unitId: string): any {
    this.service = "";
    // this.shared.getMetersByUnitId(unitId).subscribe({
    //   next: (results) => {
    //     this.meters = results.filter(
    //       (result: any) => result.meterType === this.meterType
    //     );

    //     console.log("Getting Unit Meters: ");
    //     console.log(results);

    //     this.meterDataArray = this.meters.map((result) => ({
    //       value: result.meterName,
    //       id: result.meterId,
    //       // id: result.meterService.masterDataMeters[0].meterTag
    //     }));

    //     this.meterList = this.meterDataArray;
    //     console.log(this.meterList);
    //   },
    //   error: (error) => {
    //     console.log("Getting Unit Meters : error");
    //     console.log(error);
    //   },
    // });
  }

  fetchAssertTree() {
    this.loadingInProgress = true;
    // this.shared.getAssertTree().subscribe({
    //   next: (results) => {
    //     console.log("Getting the Assert Tree: ");

    //     this.asseteTreeData = results;
    //     this.loadingInProgress = false;
    //   },
    //   error: (error) => {
    //     console.log("Getting Assert Tree : error");
    //     console.log(error);
    //   },
    // });
  }

  fetchTheService(unitId: string) {
    this.loadingInProgress = true;
    // this.shared.getMetersByUnitId(unitId).subscribe({
    //   next: (results: any) => {
    //     console.log("Getting service: ");

    //     const matchingResult = results.find(
    //       (result: any) => result.meterId === this.selectedMeterCode
    //     );

    //     if (matchingResult) {
    //       console.log("matchingResult: ", matchingResult);

    //       this.service = matchingResult.meterService.serviceType;

    //       this.serviceUnit = `(${matchingResult.meterUnit})`;

    //       this.selectedMeterTag =
    //         matchingResult.meterService.masterDataMeters.find(
    //           (meter: any) => meter.meterId === this.selectedMeterCode
    //         ).meterTag;

    //       console.log("selectedMeterTag", this.selectedMeterTag);
    //       console.log("service found: ", this.service);
    //     } else {
    //       console.log("service not found.");
    //     }
    //     this.loadData();
    //   },
    //   error: (error) => {
    //     console.log("Getting service : error");
    //     console.log(error);
    //   },
    // });
  }

  getSelectedUnitFromTree(item: any) {
    console.log("Auto meter reading", item);

    this.serviceUnit = "";
    this.selectedUnit = item;
    this.selectedMeterTag = "";
    this.unitId = item.id;
    this.unitName = item.name;

    this.getAutoMeterReadings();

    this.fetchMeterListByUnitId(item.id);
  }

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    console.log("Selected page:");
    console.log(this.selectedPage);
    this.getAutoMeterReadings();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    console.log("Page size changed to:");
    console.log(this.selectedPageSize);
    this.getAutoMeterReadings();
  }

  getDateTime() {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    var time =
      today.getHours().toString().padStart(2, "0") +
      ":" +
      today.getMinutes().toString().padStart(2, "0") +
      ":" +
      today.getSeconds().toString().padStart(2, "0");
    this.exportDateTime = date + " " + time;
  }

  //Handle the download button clicking
  downloadExcel() {
    this.reportMonth = this.monthList.find(
      (month) => month.id === parseInt(this.selectedMonth)
    );
    var month = this.reportMonth.value;

    var reportName = `${
      this.appService.appConfig[0].consumptionReportName[0].meter_readings
    } ${this.selectedYear}-${this.selectedMonth.padStart(2, "0")} (${
      this.selectedMeterCode
    })`;
    var sheetName = `${this.appService.appConfig[0].consumptionSheetName[0].meter_readings}`;

    if (this.selectedMeterTag != "") {
      // this.shared
      //   .getAllMeterReadings(
      //     this.selectedMeterTag,
      //     this.selectedYear,
      //     this.selectedMonth
      //   )
      //   .subscribe({
      //     next: (result: any) => {
      //       console.log("result", result);
      //       const meterReadingsDataArray = result.map((item: any) => ({
      //         Date: item.ts.slice(0, -9),
      //         Time: item.ts.slice(11),
      //         MeterReading: item.value,
      //       }));
      //       var arrayOfArrayData = [
      //         ["Marina One - Tenant Billing System"],
      //         [],
      //         [`Meter Readings`],
      //         [],
      //         [`Unit ID`, `${this.unitId}`],
      //         [`Meter ID`, `${this.selectedMeterCode}`],
      //         [`Meter Mode`, `Auto`],
      //         [`Year and Month`, `${this.selectedYear}-${month}`],
      //         [],
      //         ["Date", "Time", `Meter Reading ${this.serviceUnit}`],
      //       ];
      //       for (var i = 0; i < meterReadingsDataArray.length; i++) {
      //         var rowData: any = [
      //           meterReadingsDataArray[i].Date,
      //           meterReadingsDataArray[i].Time,
      //           meterReadingsDataArray[i].MeterReading,
      //         ];
      //         arrayOfArrayData.push(rowData);
      //       }
      //       this.getDateTime();
      //       arrayOfArrayData.push(
      //         [],
      //         ["Generated On : ", `${this.exportDateTime}`]
      //       );
      //       this.reportService.generateExcelFile(
      //         arrayOfArrayData,
      //         sheetName,
      //         reportName
      //       );
      //     },
      //     error: (error: any) => {
      //       console.log("Getting meter all readings data: error");
      //       console.log(error);
      //       this.notifierService.error({
      //         detail: "Error",
      //         summary: "Could not export the meter readings.",
      //         duration: 4000,
      //       });
      //     },
      //   });
    }
  }
}

import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { PlatformConfigurationService } from "src/app/services/cams-new/configuration services/platform-configuration.service";
import { ConsumptionByService } from "src/app/shared/models/Tbs/consumptionByService";
import { AppService } from "src/app/app.service";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { LocationMapService } from "src/app/services/location-map.service";
import { isEmpty, isNull } from "lodash";
import { ReportService } from "src/app/services/ReportServices/report.service";

@Component({
  selector: "app-platform-configuration",
  templateUrl: "./platform-configuration.component.html",
  styleUrls: ["./platform-configuration.component.scss"],
})
export class PlatformConfigurationComponent {
  asseteTreeData: any = {};
  userId: number = 0;
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedServiceMeterId: string = "";
  selectedServiceType: string = "";
  selectedServiceUnit: string = "";
  meterList: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  serviceList: any[] = [];
  filterdResult: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  consumptionData: any[] = [];
  loadingInProgress: boolean = false;
  pageSize: any[] = [50];
  selectedPageSize: number = 50;
  serviceSet: any[] = [];
  meterPrintList: string[] = [];
  nameOfOrganization: string = "";
  moduleName: string = "";
  reportMonth: string = "";
  dateTime: string = "";

  selectedUnit!: Unit;
  unitId!: string;

  consumptionByServiceModel!: ConsumptionByService;
  consumptionByServiceData!: ConsumptionByService[];

  loading: boolean = false;

  consumptionTableOptions: tableOptions = new tableOptions();

  headArray = [
    //{ 'Head': '', 'FieldName': '', 'ColumnType': 'CheckBox' },
    { Head: "Date", FieldName: "date", ColumnType: "Data" },
    {
      Head: "Normal Consumption",
      FieldName: "normalConsumption",
      ColumnType: "Data",
      AllowSort: false,
    },
    {
      Head: "Extended Consumption",
      FieldName: "extendedConsumption",
      ColumnType: "Data",
      AllowSort: false,
    },
    { Head: "Total", FieldName: "total", ColumnType: "Data", AllowSort: false },
  ];

  dataArray: any = [];

  dataTable = [
    { date: "", normalConsumption: 0, extendedConsumption: 0, total: 0 },
  ];

  // dataTable = [
  //   { date: '2023-10-25', normalConsumption: 524, extendedConsumption: 264, total: 788, isRejecteableOrApprovableRecord: true },
  //   { 'date': '2023-10-26', 'normalConsumption': 658, 'extendedConsumption': 221, 'total': 654, 'isRejecteableOrApprovableRecord': true },
  // ]

  //================================================

  // dataTable = [
  //   // do this
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  // headArray1 = [
  //   { 'Head': '', 'FieldName': '', 'ColumnType': 'CheckBox' },
  //   { 'Head': 'Tenant', 'FieldName': 'Tenant', 'ColumnType': 'Data' },
  //   { 'Head': 'Date', 'FieldName': 'Date', 'ColumnType': 'Data' },
  //   { 'Head': 'Normal Consumption', 'FieldName': 'NormalConsumption', 'ColumnType': 'Data' },
  //   { 'Head': 'Extended Consumption', 'FieldName': 'ExtendedConsumption', 'ColumnType': 'Data' },
  //   { 'Head': 'Normal Compensate', 'FieldName': 'NormalCompensate', 'ColumnType': 'Data' },
  //   { 'Head': 'Extended Compensate', 'FieldName': 'ExtendedCompensate', 'ColumnType': 'Data' },

  // ];

  // //this is fake data, just for demo purpose
  // dataTable1 = [
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'NormalCompensate': Math.floor(Math.random() * 1000), 'ExtendedCompensate': Math.floor(Math.random() * 1000) },
  // ];

  // ====================================================

  constructor(
    private breadcrumbService: BreadcrumbService,
    private consumptionService: PlatformConfigurationService,
    private notifierService: NgToastService,
    private appService: AppService,
    private locationMap: LocationMapService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    //this.consumptionTableOptions.allowCheckbox = true;
    this.consumptionTableOptions.allowGenerateButton = true;

    this.nameOfOrganization = this.appService.appConfig[0].nameOfOrganization;
    this.moduleName = this.appService.appConfig[0].moduleName;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Platform Configuration", active: true },
    ]);

    //this.selectedService = "";

    //this.consumptionData = this.dataTable;

    // this.serviceList = [
    //   { value: "Water/Leters", id: 1 },
    //   { value: "Electricity", id: 2 },
    //   { value: "Air Condition", id: 3 },
    //   { value: "Gas", id: 4 },
    // ];

    // this.yearList = [
    //   { value: "2023", id: 1 },
    //   { value: "2022", id: 2 },
    //   { value: "2021", id: 3 },
    // ];

    let currentYear = new Date().getFullYear();
    const maxYear = this.appService.appConfig[0].maximumYearRangeForInvoice;
    for (let i = 0; i < maxYear; i++) {
      this.yearList.push({ value: currentYear - i, id: i + 1 });
    }

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

    this.tenantList = [
      { value: "Tenant-1", id: 1 },
      { value: "Tenant-2", id: 2 },
      { value: "Tenant-3", id: 3 },
      { value: "Tenant-4", id: 4 },
      { value: "Tenant-5", id: 5 },
      { value: "Tenant-6", id: 6 },
      { value: "Tenant-7", id: 7 },
      { value: "Tenant-8", id: 8 },
      { value: "Tenant-9", id: 9 },
      { value: "Tenant-10", id: 10 },
    ];

    //this.fetchAssertTree();

    this.loadData();
  }

  onAsseteTreeChanged(selectedItems: any[]): void {
    window.alert(selectedItems.map((x) => x.unitName).join(", ") + " selected");
  }

  loadData() {
    if (this.selectedYear != "" && this.selectedMonth != "") {
      //window.alert("Year and Month selected");
      this.fetchConsumptionByService();
      this.findSelectedService(this.unitId);
      this.meterList = this.selectedServiceMeterId;

      this.meterPrintList = this.meterList.split(",");
      console.log("&&&&", this.selectedServiceMeterId);
      console.log("%%%%%", this.meterPrintList[0]);
    }
  }

  fetchConsumptionByService() {
    this.loadingInProgress = true;

    if (
      this.selectedServiceMeterId != "" &&
      this.selectedServiceMeterId != undefined
    ) {
      // this.loadingInProgress = true
      // this.consumptionService
      //   .getConsumptionByService(
      //     this.selectedYear,
      //     this.selectedMonth,
      //     this.selectedServiceMeterId
      //   )
      //   .subscribe({
      //     next: (result: any) => {
      //       this.consumptionByServiceData = result;
      //       console.log("Getting consumption by service data: ");
      //       // console.log(this.consumptionByServiceData);
      //       console.log("Service", this.selectedServiceMeterId);
      //       console.log(result);
      //       for (let i = 0; i < this.monthList.length; i++) {
      //         if (this.selectedMonth == this.monthList[i].id) {
      //           this.reportMonth = this.monthList[i].value;
      //           console.log("+++", this.reportMonth);
      //         }
      //       }
      //       if (!isNull(this.consumptionByServiceData)) this.updateTable();
      //       else this.dataTable = [];
      //       this.dataArray = this.dataTable;
      //       this.loadingInProgress = false;
      //     },
      //     error: (error) => {
      //       console.log("Getting consumption by service data: error");
      //       console.log(error);
      //       this.dataTable = [];
      //       this.notifierService.error({
      //         detail: "Error",
      //         summary: "Could not retrieve the data list.",
      //         duration: 4000,
      //       });
      //       this.loadingInProgress = false;
      //     },
      //   });
    } else {
      this.dataArray = [];
      this.loadingInProgress = false;
    }
  }

  updateTable() {
    this.dataTable = this.consumptionByServiceData.map((item) => ({
      //date: item.date,
      date: new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      normalConsumption: item.normalConsumption,
      extendedConsumption: item.extendedConsumption,
      total: item.normalConsumption + item.extendedConsumption,
      isRejecteableOrApprovableRecord: true,
    }));
    // this.consumptionData = this.dataTable;
    // console.log(this.consumptionData);

    return this.dataTable;
  }

  // fetchAssertTree() {
  //   this.userId = this.appService.user.id;
  //   this.loadingInProgress = true
  //   this.locationMap.getLocationMap(this.userId).subscribe({
  //     next: (results) => {
  //       this.asseteTreeData = results;
  //       this.loadingInProgress = false
  //     },
  //     error: (error) => {
  //       console.log('Getting Assert Tree : error');
  //       console.log(error);
  //       this.loadingInProgress = false;
  //     }
  //   })
  // }

  getSelectedUnitFromTree(item: any) {
    this.consumptionByServiceData = [];
    this.selectedUnit = item;
    this.unitId = item.id;
    this.unitName = item.name;
    this.selectedServiceMeterId = "";

    this.loadData();
    this.fetchServices(item.id);
  }

  fetchServices(unitId: string) {
    // this.loadingInProgress = true;
    // this.consumptionService.getServices(unitId).subscribe({
    //   next: (results) => {
    //     console.log("Getting the Assert Tree:", results);
    //     this.serviceList = results;
    //     console.log("this.serviceList", this.serviceList);
    //     this.loadingInProgress = false;
    //   },
    //   error: (error) => {
    //     console.log("Getting Assert Tree : error", error);
    //     this.loadingInProgress = false;
    //   },
    // });
  }

  findSelectedService(unitId: string) {
    // this.consumptionService.getServices(unitId).subscribe({
    //   next: (results) => {
    //     for (let i = 0; i < results.length; i++) {
    //       //for (let j = 0; j < results[i].meterList.length; j++) {
    //       if (this.selectedServiceMeterId == results[i].meterList) {
    //         this.selectedServiceType = results[i].serviceType;
    //         this.selectedServiceUnit = results[i].unit;
    //         console.log("$$$$$ ", this.selectedServiceType);
    //         console.log("$$$$$ ", results[i].unit);
    //       }
    //       //}
    //     }
    //     // for (let i = 0; i < results.length; i++) {
    //     //   if (this.selectedServiceType == results[i].serviceType) {
    //     //     this.meterList = results[i].meterList
    //     //     console.log("lllllllll", this.meterList)
    //     //   }
    //     // }
    //   },
    //   error: (error) => {
    //     console.log("Getting Assert Tree : error", error);
    //   },
    // });
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
    this.dateTime = date + " " + time;
  }

  downloadExcel() {
    //var reportName = `Consumption_By_Service_${this.unitName}_${this.selectedServiceType}`

    var reportName =
      this.appService.appConfig[0].consumptionReportName[0]
        .consumption_by_service +
      ` ${this.selectedYear}-${this.selectedMonth.padStart(2, "0")} (${
        this.unitCode
      })`;
    var sheetName =
      this.appService.appConfig[0].consumptionSheetName[0]
        .consumption_by_service;

    //var arrayOfArrayData: any = [];

    var arrayOfArrayData = [
      [this.nameOfOrganization + ` - ` + this.moduleName],
      [],
      ["Consumption By Service Report"],
      [],
      //[`Daily Consumption - ( ${this.selectedServiceType} ) - ${this.selectedYear}/${this.selectedMonth}`],
      ["Unit", `${this.unitName} (${this.unitCode})`],
      ["Year and Month", `${this.selectedYear} - ${this.reportMonth}`],
      [
        "Service Type",
        `${this.selectedServiceType} (${this.selectedServiceUnit})`,
      ],
      ["Included Meters", `${this.meterPrintList}`],
      [],
      ["Date", "Normal Consumption", "Extended Consumption", "Total"],
    ];

    // for (var i = 0; i < arrayData.length; i++) {
    //   var rowData: any = ["", arrayData[i][1]];

    //   arrayOfArrayData.push(rowData)
    // }

    for (var i = 0; i < this.dataTable.length; i++) {
      var rowData: any = [
        this.dataTable[i].date,
        this.dataTable[i].normalConsumption,
        this.dataTable[i].extendedConsumption,
        this.dataTable[i].total,
      ];
      arrayOfArrayData.push(rowData);
    }
    this.getDateTime();
    arrayOfArrayData.push([], ["Generated At : " + `${this.dateTime}`]);
    console.log("dd", arrayOfArrayData);

    this.reportService.generateExcelFile(
      arrayOfArrayData,
      sheetName,
      reportName
    );
  }

  // getServices(item: any) {
  //   console.log(item)
  //   this.selectedUnit = item;
  //   this.unitId = item.id
  //   this.unitName = item.name
  //   //this.fetchMeterListByUnitId(item.id)
  //   this.fetchConsumptionByService()
  // }
}

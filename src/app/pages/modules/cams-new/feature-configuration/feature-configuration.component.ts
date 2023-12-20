import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgToastService } from "ng-angular-popup";
import { FeatureConfigurationService } from "src/app/services/cams-new/configuration services/feature-configuration.service";
import { ConsumptionByMeter } from "src/app/shared/models/Tbs/consumptionByMeter";
import { AppService } from "src/app/app.service";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { LocationMapService } from "src/app/services/location-map.service";
import { isNull } from "lodash";
import { ReportService } from "src/app/services/ReportServices/report.service";

@Component({
  selector: "app-feature-configuration",
  templateUrl: "./feature-configuration.component.html",
  styleUrls: ["./feature-configuration.component.scss"],
})
export class FeatureConfigurationComponent {
  asseteTreeData: any = {};
  userId: number = 0;
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedMeter: string = "";
  selectedService: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  service: string = "";
  meterCodeList: any[] = [];
  meterName: string = "";
  serviceList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  extensionData: any[] = [];
  loadingInProgress: boolean = false;
  loading: boolean = false;
  pageSize: any[] = [50];
  selectedPageSize: number = 50;
  nameOfOrganization: string = "";
  moduleName: string = "";
  reportMonth: string = "";
  dateTime: string = "";

  selectedUnit!: Unit;
  unitId!: string;

  consumptionByMeterModel!: ConsumptionByMeter;
  consumptionByMeterData!: ConsumptionByMeter[];

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

  dataArray: any[] = [];

  tableData: any = [];

  // yearList = [
  //   { value: '', id: 0 }
  // ]

  //this is fake data, just for demo purpose
  // tableData = [
  //   // do this
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  // tableData1 = [
  //   // do this
  //   { 'Date': '2023-06-01', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-02', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-03', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-04', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-05', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-06', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-07', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-08', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-09', 'NormalCompensation': Math.floor(Math.random() * 1000), 'ExtendedCompensation': Math.floor(Math.random() * 1000), 'Total': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: FeatureConfigurationService,
    private notifierService: NgToastService,
    private locationMap: LocationMapService,
    private appService: AppService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    //this.consumptionTableOptions.allowCheckbox = true;
    this.consumptionTableOptions.allowGenerateButton = true;

    this.nameOfOrganization = this.appService.appConfig[0].nameOfOrganization;
    this.moduleName = this.appService.appConfig[0].moduleName;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Feature Configuration", active: true },
    ]);

    //this.selectedService = "";

    this.serviceList = [
      { value: "Water", id: 1 },
      { value: "Electricity", id: 2 },
      { value: "Air Condition", id: 3 },
    ];

    //this.selectedMeter = "";

    //this.service = "N/A";

    // this.meterCodeList = [
    //   { value: "M01", id: 1 },
    //   { value: "M02", id: 2 },
    //   { value: "M03", id: 3 },
    // ];

    // this.yearList = [
    //   { value: "2023", id: 1 },
    //   { value: "2022", id: 2 },
    //   { value: "2021", id: 3 },
    //   { value: "2020", id: 4 },

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

    // this.tenantList = [
    //   { value: "Tenant-1", id: 1 },
    //   { value: "Tenant-2", id: 2 },
    //   { value: "Tenant-3", id: 3 },
    //   { value: "Tenant-4", id: 4 },
    //   { value: "Tenant-5", id: 5 },
    //   { value: "Tenant-6", id: 6 },
    //   { value: "Tenant-7", id: 7 },
    //   { value: "Tenant-8", id: 8 },
    //   { value: "Tenant-9", id: 9 },
    //   { value: "Tenant-10", id: 10 },
    // ];

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

    this.fetchAssertTree();

    this.loadData();
  }

  // onAsseteTreeChanged(selectedItems: any[]): void {
  //   window.alert(selectedItems.map(x => x.unitName).join(", ") + " selected")
  // }

  loadData() {
    console.log("MmM", this.selectedMeter);

    if (this.selectedYear != "" && this.selectedMonth != "") {
      //this.dataArray = [];
      this.fetchConsumptionByMeter();

      // console.log(this.tableData)
      //this.dataArray = this.tableData;
      //debugger;
      // load the data here

      //this.extensionData = this.tableData;
    }
  }

  fetchConsumptionByMeter() {
    // this.loadingInProgress = true;
    // if (this.selectedMeter != "") {
    //   this.loadServiceType();
    //   this.shared
    //     .getConsumptionByMeter(
    //       this.selectedYear,
    //       this.selectedMonth,
    //       this.selectedMeter
    //     )
    //     .subscribe({
    //       next: (result: any) => {
    //         this.consumptionByMeterData = result;
    //         console.log("gihan", this.selectedMeter);
    //         for (let i = 0; i < this.monthList.length; i++) {
    //           if (this.selectedMonth == this.monthList[i].id) {
    //             this.reportMonth = this.monthList[i].value;
    //             console.log("+++", this.reportMonth);
    //           }
    //         }
    //         //this.updateYearList();
    //         if (!isNull(this.consumptionByMeterData)) this.updateTable();
    //         else this.tableData = [];
    //         this.dataArray = this.tableData;
    //         console.log("dataArray", this.dataArray);
    //         this.loadingInProgress = false;
    //       },
    //       error: (error) => {
    //         console.log("Getting consumption by service data: error");
    //         console.log(error);
    //         this.tableData = [];
    //         this.notifierService.error({
    //           detail: "Error",
    //           summary: "Could not retrieve the data list.",
    //           duration: 4000,
    //         });
    //         this.loadingInProgress = false;
    //       },
    //     });
    // } else {
    //   this.updateTable();
    //   this.dataArray = this.tableData;
    //   console.log("dataArray", this.dataArray);
    //   this.loadingInProgress = false;
    // }
  }

  updateTable() {
    this.tableData = this.consumptionByMeterData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      normalConsumption: item.normal_consumption,
      extendedConsumption: item.extended_consumption,
      total: item.normal_consumption + item.extended_consumption,
      isRejecteableOrApprovableRecord: true,
    }));

    // this.consumptionData = this.tableData;
    // console.log(this.consumptionData);
  }

  getSelectedUnitFromTree(item: any) {
    this.consumptionByMeterData = [];
    console.log(item);
    this.selectedUnit = item;
    this.unitId = item.id;
    this.unitName = item.name;
    this.selectedMeter = "";
    //this.fetchMeterListByUnitId(item.id)
    //this.fetchConsumptionByMeter()
    this.fetchConsumptionByMeter();
    this.fetchMeterList(item.id);
  }

  loadServiceType() {
    // this.service
    for (var i = 0; i < this.meterCodeList.length; i++) {
      if (this.meterCodeList[i].meterId == this.selectedMeter) {
        this.service =
          this.meterCodeList[i].meterService.serviceType +
          " (" +
          this.meterCodeList[i].meterService.unit +
          ")";
        this.meterName = this.meterCodeList[i].meterName;
      }
    }
  }

  // fetchAssertTree() {
  //   this.loadingInProgress = true
  //   this.shared.getAssertTree().subscribe({
  //     next: (results) => {
  //       console.log('Getting the Assert Tree: ');
  //       console.log(results)

  //       this.asseteTreeData = results
  //       console.log(this.asseteTreeData);
  //       this.loadingInProgress = false
  //     },
  //     error: (error) => {
  //       console.log('Getting Assert Tree : error');
  //       console.log(error);
  //       this.loadingInProgress = false;
  //     }
  //   })
  // }

  fetchAssertTree() {
    this.userId = this.appService.user.id;
    this.loadingInProgress = true;
    this.locationMap.getLocationMap(this.userId).subscribe({
      next: (results) => {
        this.asseteTreeData = results;
        this.loadingInProgress = false;
      },
      error: (error) => {
        console.log("Getting Assert Tree : error");
        console.log(error);
        this.loadingInProgress = false;
      },
    });
  }

  fetchMeterList(unitId: string) {
    // this.loadingInProgress = true;
    // this.shared.getMeterList(unitId).subscribe({
    //   next: (results) => {
    //     console.log("Getting Meter List:", results);
    //     this.meterCodeList = results;
    //     console.log("results", results);
    //     this.loadingInProgress = false;
    //   },
    //   error: (error) => {
    //     console.log("Getting Assert Tree : error", error);
    //     this.loadingInProgress = false;
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
    var reportName =
      this.appService.appConfig[0].consumptionReportName[0]
        .consumption_by_meter +
      ` ${this.selectedYear}-${this.selectedMonth.padStart(2, "0")} (${
        this.unitCode
      })`;
    var sheetName =
      this.appService.appConfig[0].consumptionSheetName[0].consumption_by_meter;

    var arrayOfArrayData = [
      [this.nameOfOrganization + ` - ` + this.moduleName],
      [],
      ["Consumption By Meter Report"],
      [],
      ["Unit", `${this.unitName} (${this.unitCode})`],
      ["Year and Month", `${this.selectedYear} - ${this.reportMonth}`],
      ["Meter ID", `${this.selectedMeter}`],
      ["Meter Name", `${this.meterName}`],
      ["Service Type", `${this.service}`],
      [],
      ["Date", "Normal Consumption", "Extended Consumption", "Total"],
    ];

    for (var i = 0; i < this.tableData.length; i++) {
      var rowData: any = [
        this.tableData[i].date,
        this.tableData[i].normalConsumption,
        this.tableData[i].extendedConsumption,
        this.tableData[i].total,
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

  // updateYearList() {
  //   let i = 1;
  //   this.yearList = this.consumptionByMeterData.map(item => ({
  //     value: item.date.getFullYear().toString(),
  //     id: i++
  //   }))
  // }
}

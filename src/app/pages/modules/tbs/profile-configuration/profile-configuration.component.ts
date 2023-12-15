import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";
import { NgToastService } from "ng-angular-popup";
import { ProfileConfigurationService } from "src/app/services/cams-new/configuration services/profile-configuration.service";
import { AppService } from "src/app/app.service";
import { Unit } from "src/app/shared/models/Tbs/unit";
import { LocationMapService } from "src/app/services/location-map.service";
import { ReportService } from "src/app/services/ReportServices/report.service";

@Component({
  selector: "app-profile-configuration",
  templateUrl: "./profile-configuration.component.html",
  styleUrls: ["./profile-configuration.component.scss"],
})
export class ProfileConfigurationComponent {
  asseteTreeData: any = {};
  userId: number = 0;
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  extensionData: any[] = [];
  loadingInProgress: boolean = false;
  loading: boolean = false;
  consumptionHistoryData: any[] = [];
  pageSize: any[] = [50];
  selectedPageSize: number = 50;
  serviceData: any[] = [];
  reportHeadArray: any[] = [];
  serviceOfUnit: string = "";
  unitOfService: string = "";
  nameOfOrganization: string = "";
  moduleName: string = "";
  reportMonth: string = "";
  dateTime: string = "";

  selectedUnit!: Unit;
  unitId!: string;

  consumptionTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "Date", FieldName: "Date", ColumnType: "Data" },
    // { 'Head': 'Water', 'FieldName': 'this.SeviceTypes', 'ColumnType': 'Data' },
    // { 'Head': 'Electricity', 'FieldName': 'Electricity', 'ColumnType': 'Data' },
    // { 'Head': 'Air Condition', 'FieldName': 'AirCondition', 'ColumnType': 'Data' },
  ];

  dataArray: any = [];

  tableData: any[] = [];

  // tableData = [
  //   { Date: '', Water: 0, Electricity: 0, AC: 0 }
  // ]

  //this is fake data, just for demo purpose
  //===================================================
  // tableData = [
  //   // do this
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'this.SeviceTypes': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  //   { 'Date': '2023-06-' + Math.floor(Math.random() * 30), 'Water': Math.floor(Math.random() * 1000), 'Electricity': Math.floor(Math.random() * 1000), 'AirCondition': Math.floor(Math.random() * 1000), 'isRejecteableOrApprovableRecord': true },
  // ]

  //===========================================
  constructor(
    private breadcrumbService: BreadcrumbService,
    private shared: ProfileConfigurationService,
    private notifierService: NgToastService,
    private appService: AppService,
    private locationMap: LocationMapService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    //this.fetchConsumptionHistory();

    this.tableData.push(this.appService.appConfig[0].servicesList);
    console.log("Table Data - ", this.tableData);

    this.nameOfOrganization = this.appService.appConfig[0].nameOfOrganization;
    this.moduleName = this.appService.appConfig[0].moduleName;

    this.fetchAssertTree();

    //this.consumptionTableOptions.allowCheckbox = true;
    this.consumptionTableOptions.allowGenerateButton = true;

    //this.dataArray = this.tableData;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "Configuration", active: false },
      { label: "Profile Configuration", active: true },
    ]);

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

    this.loadData();
  }

  onAsseteTreeChanged(selectedItems: any[]): void {
    window.alert(selectedItems.map((x) => x.unitName).join(", ") + " selected");
  }

  loadData() {
    if (
      this.selectedYear != "" &&
      this.selectedMonth != "" &&
      this.selectedUnit != null
    ) {
      //window.alert("all parameters are selected");
      //debugger
      this.fetchConsumptionHistory();
      // load the data here

      //this.extensionData = this.tableData;
    }
  }

  fetchConsumptionHistory() {
    // console.log("@fetchConsumptionHistory", this.unitId);
    // this.loadingInProgress = true;
    // this.shared
    //   .getConsumptionHistory(this.selectedYear, this.selectedMonth, this.unitId)
    //   .subscribe({
    //     next: (result: any) => {
    //       this.consumptionHistoryData = result;
    //       console.log(
    //         "Getting consumption history data: ",
    //         this.consumptionHistoryData
    //       );
    //       console.log("Tbale Data - ", this.tableData);
    //       for (let i = 0; i < this.monthList.length; i++) {
    //         if (this.selectedMonth == this.monthList[i].id) {
    //           this.reportMonth = this.monthList[i].value;
    //           console.log("+++", this.reportMonth);
    //         }
    //       }
    //       // result.forEach((element: any) => {
    //       //   console.log(element.consumptions)
    //       //   debugger;
    //       //   // let tempData: any[] = [];
    //       //   // tempData.push({ 'Date':  })
    //       // });
    //       if (this.unitId != "") {
    //         this.updateTable();
    //       }
    //       this.dataArray = this.tableData;
    //       console.log("Data Array - ", this.dataArray);
    //       this.loadingInProgress = false;
    //     },
    //     error: (error) => {
    //       console.log("Getting consumption history data: error");
    //       console.log(error);
    //       this.tableData = [];
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
    // let water_consumption: any[];
    // let electricity_consumption: any[];
    // let ac_consumption: any[];
    // let gas_consumption: any[];

    // for (let i = 0; i < this.consumptionHistoryData.length; i++) {

    //   if (this.consumptionHistoryData[i].serviceType == "Water") {

    //     water_consumption = this.consumptionHistoryData[i].consumptions;
    //     console.log("wtre - ", water_consumption)
    //     debugger;
    //     this.tableData = water_consumption.map(item => ({
    //       Date: new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),
    //       Water: item.serviceValue
    //     }))

    //   }

    //   if (this.consumptionHistoryData[i].serviceType == "Electricity") {

    //     electricity_consumption = this.consumptionHistoryData[i].consumptions;
    //     this.tableData= electricity_consumption.map(item => ({
    //       Date: new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),
    //       Electricity: item.serviceValue,
    //     }))

    //   }

    //   if (this.consumptionHistoryData[i].serviceType == "AC") {
    //     ac_consumption = this.consumptionHistoryData[i].consumptions;
    //   }

    //   if (this.consumptionHistoryData[i].serviceType == "Gas") {
    //     gas_consumption = this.consumptionHistoryData[i].consumptions;
    //   }
    //   console.log("##@##", this.tableData)

    // }

    //this.consumptionHistoryData = electricity_consumption;

    this.tableData = this.consumptionHistoryData.map((item) => ({
      Date: new Date(item.Date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      Water: item.Water,
      Electricity: item.Electricity,
      AC: item.AC,
      Gas: item.Gas,
      isRejecteableOrApprovableRecord: true,
    }));
    // this.tableData = this.consumptionHistoryData.map(item => {
    //   const mappedItem = {
    //     Date: new Date(item.Date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),
    //     Water: item.Water,
    //     Electricity: item.Electricity,
    //     isRejecteableOrApprovableRecord: true
    //   };

    //   // Check if AC exists before adding to the mappedItem
    //   if (item.AC !== undefined) {
    //     mappedItem.AC = item.AC;
    //   }

    //   // Check if Gas exists before adding to the mappedItem
    //   if (item.Gas !== undefined) {
    //     mappedItem.Gas = item.Gas;
    //   }

    //   return mappedItem;
    // });

    // this.tableData = [water_consumption, electricity_consumption, ac_consumption, gas_consumption, A_consumption]

    // Electricity: item.electricity_consumption,
    // AC: item.ac_consumption,
    // Gas: item.gas_consumption,

    // this.tableData = this.consumptionHistoryData.map(item => ({
    //   //date: item.date,

    //   Date: new Date(item[0].consumptions.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }),

    //   Water: item[0].consumptions[0 - 30].serviceValue,
    //   Electricity: item.electricity_consumption,
    //   AC: item.ac_consumption,
    //   Gas: item.gas_consumption,

    //   isRejecteableOrApprovableRecord: true
    // }));
  }

  // getSelectedUnitFromTree(item: any) {
  //   this.selectedUnit = item;
  //   this.unitId = item.id
  //   this.unitName = item.name
  //   //this.fetchMeterListByUnitId(item.id)
  //   this.fetchConsumptionHistory();
  //   this.createHeadArray();
  // }

  getSelectedUnitFromTree(item: any) {
    this.selectedUnit = item;
    this.unitId = item.id;
    this.unitName = item.name;

    this.loadData();
    this.createHeadArray();
  }

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

  createHeadArray() {
    this.headArray = [{ Head: "Date", FieldName: "Date", ColumnType: "Data" }];

    // this.shared.getServices(this.unitId).subscribe({
    //   next: (result: any) => {
    //     this.serviceData = result;
    //     console.log("Service data: ", this.serviceData);

    //     for (let i = 0; i < this.serviceData.length; i++) {
    //       this.serviceOfUnit = this.serviceData[i].serviceType;
    //       this.unitOfService = this.serviceData[i].unit;
    //       this.headArray.push({
    //         Head: this.serviceOfUnit + " (" + this.unitOfService + ")",
    //         FieldName: this.serviceOfUnit,
    //         ColumnType: "Data",
    //       });
    //     }
    //     console.log("Head Array - ", this.headArray);

    //     this.reportHeadArray = [];
    //     for (var i = 0; i < this.headArray.length; i++) {
    //       var rowData: any = this.headArray[i].Head;
    //       this.reportHeadArray.push(rowData);
    //     }

    //     // this.updateTable();
    //     // this.dataArray = this.tableData;
    //   },
    //   error: (error) => {
    //     console.log("Getting consumption history data: error");
    //     console.log(error);
    //     this.tableData = [];
    //     this.notifierService.error({
    //       detail: "Error",
    //       summary: "Could not retrieve the data list.",
    //       duration: 4000,
    //     });
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
        .consumption_history +
      ` ${this.selectedYear}-${this.selectedMonth.padStart(2, "0")} (${
        this.unitCode
      })`;
    //var sheetName = `${this.unitName}`;
    var sheetName =
      this.appService.appConfig[0].consumptionSheetName[0].consumption_history;

    var headArray = this.reportHeadArray;

    var arrayOfArrayData = [
      [this.nameOfOrganization + " - " + this.moduleName],
      [],
      ["Consumption History Report"],
      [],
      ["Unit Id", `${this.unitId}`],
      ["Unit Name", `${this.unitName}`],
      ["Year and Month", `${this.selectedYear} - ${this.reportMonth}`],
      [],
      headArray,
    ];

    for (var i = 0; i < this.tableData.length; i++) {
      var rowData: any = [
        this.tableData[i].Date,
        this.tableData[i].Water,
        this.tableData[i].Electricity,
        this.tableData[i].AC,
        this.tableData[i].Gas,
      ];

      rowData = rowData.filter((value: any) => value !== undefined);

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
}

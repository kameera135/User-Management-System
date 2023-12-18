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
  asseteTreeData: any = {};

  unitName!: string;
  unitId!: string;
  selectedMeterCode: string = "";
  selectedTimeInterval: string = "";
  // selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  service: string = "";
  serviceUnit: string = "";
  meterType: string = "Auto";
  meterList: any[] = [];
  meterCodeList: any[] = [];
  yearList: any[] = [];

  intervalList: any[] = [];
  // tableData: any[] = [];
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

  //**********************************************************************
  searchTerm!: string;
  roleList: any[] = [
    { value: "All", id: 1 },
    { value: "Tenant", id: 2 },
    { value: "TM", id: 3 },
    { value: "FM", id: 4 },
  ];
  selectedPlatform: string = "All";
  UserUpdatedNotificationMessage!: string;

  usersViewTableOptions: tableOptions = new tableOptions();

  headArray = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "User Name", FieldName: "UserName", ColumnType: "Data" },
    { Head: "First Name", FieldName: "FirstName", ColumnType: "Data" },
    { Head: "Last Name", FieldName: "LastName", ColumnType: "Data" },
    { Head: "Role", FieldName: "Role", ColumnType: "Data" },
    { Head: "Email", FieldName: "Email", ColumnType: "Data" },
    { Head: "", FieldName: "", ColumnType: "Action" },
  ];

  tableData = [
    {
      UserName: "Harper.Bennett",
      FirstName: "Harper",
      LastName: "Bennett",
      Role: "Tenant",
      Email: "harperbennett@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
    {
      UserName: "Mia.Rodriguez",
      FirstName: "Mia",
      LastName: "Rodriguez",
      Role: "TM",
      Email: "miarodriguez@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
    {
      UserName: "Nolan.Sullivan",
      FirstName: "Nolan",
      LastName: "Sullivan",
      Role: "Tenant",
      Email: "nolansullivan@yoyo.com",
      isRejecteableOrApprovableRecord: true,
    },
  ];

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
    // if (this.unitId) {
    //   this.fetchMeterListByUnitId(this.unitId);
    // }
    // this.fetchAssertTree();

    // this.tableData = this.meterReadingsDataArray;

    this.usersViewTableOptions.allowCheckbox = true;
    this.usersViewTableOptions.allowBulkDeleteButton = true;
    this.usersViewTableOptions.allowDeleteButton = true;
    this.usersViewTableOptions.allowUpdateButton = true;
    this.usersViewTableOptions.allowViewButton = true;

    this.usersViewTableOptions.rowEditConfirmationMessage =
      this.appService.popUpMessageConfig[0].UpdateUserConfirmationMessage;
    this.usersViewTableOptions.rowDeleteConfirmationMessage =
      this.appService.popUpMessageConfig[0].DeleteUserConfirmationMessage;
    this.usersViewTableOptions.recordDeletedNotificationMessage =
      this.appService.popUpMessageConfig[0].UserDeletedNotificationMessage;
    this.UserUpdatedNotificationMessage =
      this.appService.popUpMessageConfig[0].UserUpdatedNotificationMessage;

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

    // this.platformList = [
    //   { value: "January", id: 1 },
    //   { value: "February", id: 2 },
    //   { value: "March", id: 3 },
    //   { value: "April", id: 4 },
    //   { value: "May", id: 5 },
    //   { value: "June", id: 6 },
    //   { value: "July", id: 7 },
    //   { value: "August", id: 8 },
    //   { value: "September", id: 9 },
    //   { value: "October", id: 10 },
    //   { value: "November", id: 11 },
    //   { value: "December", id: 12 },
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

    // this.getAutoMeterReadings();
  }

  onAsseteTreeChanged(selectedItems: any[]): void {
    window.alert(selectedItems.map((x) => x.unitName).join(", ") + " selected");
  }

  getAutoMeterReadings() {
    if (
      this.selectedPlatform != "" &&
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

  onPaginationChange(page: number): void {
    this.selectedPage = page;
    console.log("Selected page:");
    console.log(this.selectedPage);
    this.getUsers();
  }
  onPagesizeChange(pageSize: number): void {
    this.selectedPageSize = pageSize;
    console.log("Page size changed to:");
    console.log(this.selectedPageSize);
    this.getUsers();
  }

  getUsers() {}

  searchUser(item: any) {}
}

import { Component } from "@angular/core";
import { BreadcrumbService } from "src/app/services/breadcrumb/breadcrumb.service";
import { tableOptions } from "src/app/shared/models/tableOptions";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.scss"],
})
export class UserAccountComponent {
  asseteTreeData: any[] = [];
  tenantName: string = "Name of the Tenant";
  unitCode: string = "STN1-BLD2-UNT-749567";
  unitName: string = "Select..";
  selectedService: string = "";
  selectedYear: string = new Date().getFullYear().toString();
  selectedMonth: string = (new Date().getMonth() + 1).toString();
  selectedTenant: string = "";
  serviceList: any[] = [];
  yearList: any[] = [];
  monthList: any[] = [];
  tenantList: any[] = [];
  extensionData: any[] = [];
  loadingInProgress: boolean = false;

  userName!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  email!: string;
  phoneNumber!: string;
  userProfile!: string;

  extensionTableOptions: tableOptions = new tableOptions();

  headArray = [
    //do this
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Date", FieldName: "Date", ColumnType: "Data" },
    {
      Head: "Normal Consumption",
      FieldName: "NormalCompensation",
      ColumnType: "Data",
    },
    {
      Head: "Extended Consumption",
      FieldName: "ExtendedCompensation",
      ColumnType: "Data",
    },
    { Head: "Total", FieldName: "Total", ColumnType: "Data" },
  ];

  dataArray = [
    // do this
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      Total: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
  ];

  headArray1 = [
    { Head: "", FieldName: "", ColumnType: "CheckBox" },
    { Head: "Tenant", FieldName: "Tenant", ColumnType: "Data" },
    { Head: "Date", FieldName: "Date", ColumnType: "Data" },
    {
      Head: "Normal Consumption",
      FieldName: "NormalConsumption",
      ColumnType: "Data",
    },
    {
      Head: "Extended Consumption",
      FieldName: "ExtendedConsumption",
      ColumnType: "Data",
    },
    {
      Head: "Normal Compensate",
      FieldName: "NormalCompensate",
      ColumnType: "Data",
    },
    {
      Head: "Extended Compensate",
      FieldName: "ExtendedCompensate",
      ColumnType: "Data",
    },
  ];

  //this is fake data, just for demo purpose
  dataArray1 = [
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
      isRejecteableOrApprovableRecord: true,
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
    {
      Date: "2023-06-" + Math.floor(Math.random() * 30),
      NormalCompensation: Math.floor(Math.random() * 1000),
      ExtendedCompensation: Math.floor(Math.random() * 1000),
      NormalCompensate: Math.floor(Math.random() * 1000),
      ExtendedCompensate: Math.floor(Math.random() * 1000),
    },
  ];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.extensionTableOptions.allowCheckbox = true;

    this.extensionData = this.dataArray;

    this.breadcrumbService.loadBreadcrumbValue([
      { label: "User Account", active: false },
      { label: "User Account", active: true },
    ]);

    this.selectedService = "";

    this.serviceList = [
      { value: "Water", id: 1 },
      { value: "Electricity", id: 2 },
      { value: "Air Condition", id: 3 },
    ];

    this.yearList = [
      { value: "2023", id: 1 },
      { value: "2022", id: 2 },
      { value: "2021", id: 3 },
    ];

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
  }

  onAsseteTreeChanged(selectedItems: any[]): void {
    window.alert(selectedItems.map((x) => x.unitName).join(", ") + " selected");
  }

  loadData() {
    if (
      this.selectedYear != "" &&
      this.selectedMonth != "" &&
      this.selectedTenant != ""
    ) {
      window.alert("all parameters are selected");

      // load the data here

      this.extensionData = this.dataArray;
    }
  }

  generate() {
    window.alert("Invoice Generated");
  }

  changePassword() {}

  onEditClicked() {}
}

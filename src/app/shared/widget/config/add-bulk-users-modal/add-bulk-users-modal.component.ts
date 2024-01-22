import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { User } from "src/app/shared/models/Cams-new/User";

import * as XLSX from "xlsx";

@Component({
  selector: "app-add-bulk-users-modal",
  templateUrl: "./add-bulk-users-modal.component.html",
  styleUrls: ["./add-bulk-users-modal.component.scss"],
})
export class AddBulkUsersModalComponent {
  url: string = this.appService.appConfig[0].apiUrl;

  excelFile: File | null = null;
  csvData: any[] = [];

  @ViewChild("fileInput") fileInput: any;
  @Input() file!: any;

  tagName!: string;

  excelData: any;

  mappedDataArrayToPost!: User[];

  singleTagOptions = [
    { name: "singleTag", label: "Add a Single Tag", value: true },
    { name: "multipleTag", label: "Add Multiple Tags", value: false },
  ];

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
    private notifierService: NgToastService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}

  onFormSubmit() {
    this.sendBulkTagsToApi();
  }

  fileSubmit() {}

  closeModal(): void {
    this.activeModal.dismiss();
  }

  //csv file

  onFileChange(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: "binary" });
      var sheetNames = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      console.log(this.excelData);

      this.userMapping();
    };
  }

  userMapping() {
    this.mappedDataArrayToPost = this.excelData.map((item: any) => ({
      userName: item.Username,
      firstName: item.FirstName,
      lastName: item.LastName,
      email: item.Email,
      phone: item.PhoneNumber,
      password: item.Password,
    }));

    console.log(">>>>", this.mappedDataArrayToPost);
  }

  parseCSVFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      this.csvData = this.parseCSVString(data);
    };
    reader.readAsText(this.file!);
  }

  parseCSVString(data: string): any[] {
    // Split the CSV string by lines and extract the data.
    const lines = data.split("\n");
    const header = lines[0].split(","); // Assuming comma (',') is the delimiter.
    const csvData = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(","); // Assuming comma (',') is the delimiter.
      const rowData: any = {};

      for (let j = 0; j < header.length; j++) {
        const columnName = header[j].trim();
        const columnValue = line[j] ? line[j].trim() : ""; // Handle empty values.
        rowData[columnName] = columnValue;
      }

      csvData.push(rowData);
    }

    return csvData;
  }

  //posting

  sendBulkTagsToApi() {
    if (this.csvData.length === 0) {
      console.error("No data to send");
      return;
    }

    // Filter out entries with empty tags or descriptions
    const filteredData = this.csvData.filter(
      (entry) => entry.tag.trim() !== "" && entry.description.trim() !== ""
    );

    if (filteredData.length === 0) {
      console.error("No valid data to send");
      return;
    }

    // Add the "createdBy" key with the value "0" to each object in the array
    const dataWithCreatedBy = filteredData.map((entry) => ({
      ...entry,
      createdBy: "",
    }));

    console.log(dataWithCreatedBy);
    this.activeModal.close(dataWithCreatedBy);
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }

  // downloadCsv() {
  //   const csvFilePath = "assets/csv/users(bulk).csv";

  //   this.httpClient
  //     .get(csvFilePath, { responseType: "text" })
  //     .subscribe((data) => {
  //       // Split the CSV data into lines
  //       const lines = data.split("\n");

  //       // Extract the headers from the first line
  //       const headers = lines[0].split(",");

  //       // Remove the first line (assumes it's the file path)
  //       lines.shift();

  //       // Reassemble the CSV data with the "tag" and "description" headers
  //       const csvData = [headers.join(",")].concat(lines).join("\n");

  //       const blob = new Blob([csvData], { type: "text/csv" });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "tags(bulk).csv";
  //       a.click();

  //       window.URL.revokeObjectURL(url);
  //     });
  // }

  downloadXlsx() {
    const xlsxFilePath = "assets/xl/users(bulk).xlsx";

    this.httpClient
      .get(xlsxFilePath, { responseType: "blob" })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "users(bulk).xlsx";
        a.click();

        window.URL.revokeObjectURL(url);
      });
  }
}

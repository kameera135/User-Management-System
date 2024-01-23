import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { User } from "src/app/shared/models/Cams-new/User";
import { UserBulk } from "src/app/shared/models/Cams-new/UserBulk";
import { UserRoleBulk } from "src/app/shared/models/Cams-new/UserRoleBulk";

import * as XLSX from "xlsx";

@Component({
  selector: "app-add-bulk-users-modal",
  templateUrl: "./add-bulk-users-modal.component.html",
  styleUrls: ["./add-bulk-users-modal.component.scss"],
})
export class AddBulkUsersModalComponent {
  url: string = this.appService.appConfig[0].apiUrl;
  userId = this.appService.user.id;

  excelFile: File | null = null;
  csvData: any[] = [];

  @ViewChild("fileInput") fileInput: any;
  @Input() file!: any;

  tagName!: string;

  userData: any;
  userRoleData: any;

  mappedUserDataArrayToPost!: User[];
  mappedUserRoleDataArrayToPost!: UserRoleBulk[];
  mappedBulkPost!: UserBulk;

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
    this.activeModal.close(this.mappedBulkPost);
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

      this.userData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      console.log(">>userData", this.userData);

      this.userRoleData = XLSX.utils.sheet_to_json(
        workBook.Sheets[sheetNames[1]]
      );
      console.log(">>userRoleData", this.userRoleData);

      this.userMapping();
      this.userRoleMapping();

      this.mappedBulkPost = {
        users: this.mappedUserDataArrayToPost,
        userRoles: this.mappedUserRoleDataArrayToPost,
      };

      console.log(">>>>mappedBulkPost", this.mappedBulkPost);
    };
  }

  userMapping() {
    this.mappedUserDataArrayToPost = this.userData.map((item: any) => ({
      userName: item.Username,
      firstName: item.FirstName,
      lastName: item.LastName,
      email: item.Email,
      phone: item.PhoneNumber,
      password: item.Password,
      createdBy: this.userId,
    }));

    console.log(
      ">>>>mappedUserDataArrayToPost",
      this.mappedUserDataArrayToPost
    );
  }

  userRoleMapping() {
    this.mappedUserRoleDataArrayToPost = this.userRoleData.map((item: any) => ({
      userName: item.Username,
      roleId: item.Role,
    }));

    console.log(
      ">>>>mappedUserRoleDataArrayToPost",
      this.mappedUserRoleDataArrayToPost
    );
  }

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

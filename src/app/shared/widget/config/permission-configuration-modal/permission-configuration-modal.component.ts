import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";
import { ActivityLogsService } from "src/app/services/cams-new/activity-logs.service";
import { PermissionConfigurationService } from "src/app/services/cams-new/configuration services/permission-configuration.service";
import { Permission } from "src/app/shared/models/Cams-new/Permission";
import { RolesAndPlatforms } from "src/app/shared/models/Cams-new/RolesAndPlatforms";

@Component({
  selector: "app-permission-configuration-modal",
  templateUrl: "./permission-configuration-modal.component.html",
  styleUrls: ["./permission-configuration-modal.component.scss"],
}) //
export class PermissionConfigurationModalComponent {
  // roleList: any[] = this.appService.appConfig[0].roleList;
  platformList!: any[];

  selectedPlatformList!: number[];

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() permissionId!: number;
  @Input() platformId!: number;
  @Input() permissionName!: string;
  // @Input() description!: string;
  @Input() createdDate!: string;
  @Input() status!: string;
  @Input() statusBool!: boolean;

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  rolesAndPlatformList!: RolesAndPlatforms[];
  rolesAndPlatformsDataArray: any = [];

  loadingInProgress: boolean = false;

  statusOptions: { label: string; value: string }[] = [
    { label: "Active", value: "Active" },
    { label: "Deactive", value: "Deactive" },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private shared: PermissionConfigurationService,
    private alertService: MessageService,
    private activityLogsService: ActivityLogsService
  ) {}

  platforms = [];
  selectedPlatformIds: number[] = [];

  ngOnInit() {
    // this.getPlatformList();

    this.getData();
    this.selectAllForDropdownItems(this.getData());

    if (this.type == "View") {
      this.getRolesAndPlatforms();
    }

    this.status = this.status.slice(0, -4) + "e";
    console.log("permissionId", this.status);
    if (this.type == "Add") {
      this.buttonName = "Add";
      this.buttonIcon = "bi-person-plus-fill";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
    }

    this.cancelButtonIcon;
    this.cancelButtonName;
  }

  onMaterialGroupChange(event: any) {
    console.log(event);
    this.selectedPlatformIds = [];
    this.selectedPlatformIds = event.map((obj: any) => obj.id);
    console.log(this.selectedPlatformIds);
  }

  getData() {
    this.getPlatformList();
    return this.platforms;
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items: any) => {
      items.forEach((element: any) => {
        element["selectedAllGroup"] = "selectedAllGroup";
      });
    };

    allSelect(items);
  }

  getRolesAndPlatforms() {
    this.loadingInProgress = true;
    this.shared.getRolesAndPlatforms(this.permissionId).subscribe({
      next: (response: any) => {
        this.rolesAndPlatformList = response;
        this.updateTable();
        this.loadingInProgress = false;
      },
      error: (error) => {
        // this.alertService.sideErrorAlert(
        //   "Error",
        //   this.appService.popUpMessageConfig[0]
        //     .GetPermissionListErrorSideAlertMessage
        // );

        this.rolesAndPlatformList = [];
        this.updateTable();
        this.loadingInProgress = false;
      },
    });
  }

  getPlatformList() {
    this.activityLogsService.getPlatformList().subscribe({
      next: (response: any) => {
        // this.platformList = response;
        this.platforms = response;
      },
      error: (error: any) => {
        this.alertService.sideErrorAlert(
          "Error",
          this.appService.popUpMessageConfig[0]
            .GetPlatformComboboxListErrorSideAlertMessage
        );
      },
    });
  }

  updateTable() {
    this.rolesAndPlatformsDataArray = this.rolesAndPlatformList.map((item) => ({
      Role: item.role,
      Platform: item.platform,
    }));
    this.tableData = this.rolesAndPlatformsDataArray;
  }

  onFormSubmit() {
    if (this.permissionName == "") {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const feature = new Permission();
    if (this.type == "Add") {
      feature.permission = this.permissionName;
      feature.platformId = this.platformId;
    } else if (this.type == "Edit") {
      feature.permission = this.permissionName;
      feature.permissionId = this.permissionId;
    }

    //feature.createdDate = this.createdDate;
    // feature.status = this.status;

    this.activeModal.close(feature);
  }

  headArray = [
    { Head: "Platforms", FieldName: "Platform", ColumnType: "Data" },
    { Head: "Role", FieldName: "Role", ColumnType: "Data" },
  ];

  tableData: any = [];
}

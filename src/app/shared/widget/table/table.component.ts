import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { MessageService } from "src/app/services/PopupMessages/message.service";

// Sweet Alert
import Swal from "sweetalert2";

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent {
  @Input() headArray: any[] = []; //Holds the headder values

  @Input() dataArray: any[] = []; //Holds data values

  @Input() tableTitle: any = ""; //Holds data values

  @Input() dataTableOptions: any;

  @Input() totalRowsInSelection: number = 0;

  @Input() selectedPage: number = 0;

  @Input() loadingInProgress: boolean = false;

  //@Input() displayPagination: boolean = false;

  @Input() selectedPageSize: number = 5;

  @Input() pageSizeArray: any[] = ["5", "10", "20", "50", "100"];

  @Output() onEdit = new EventEmitter(); //Handles Edit click

  @Output() onDelete = new EventEmitter(); //Handles Delete Click

  @Output() onSort = new EventEmitter(); //Handles Sort Click

  @Output() onRowDoubleClick = new EventEmitter(); //Handles Row double click

  @Output() onDownloadClick = new EventEmitter(); //Handles Row download button click

  @Output() onApproval = new EventEmitter(); //Handles Row double click

  @Output() onReject = new EventEmitter(); //Handles Row double click

  @Output() onReportGenerateClick = new EventEmitter(); //Handles Row double click

  @Output() onAddTMClick = new EventEmitter(); //Handle Clicking Tenant Manager

  @Output() onAddFMClick = new EventEmitter(); //Handle Clicking Facility Manager

  @Output() onPaginationChanged = new EventEmitter();

  @Output() onPagesizeChanged = new EventEmitter();

  @Output() onAcknowledge = new EventEmitter();

  @Output() onRemove = new EventEmitter();

  @Output() onViewPermission = new EventEmitter();

  @Output() onViewPlaformUsers = new EventEmitter();

  selectedItemArray: any[] = [];

  testArray: any[] = [];

  selectedDataRow: any;

  //To show platform users
  allowToViewPlatformUsers: boolean = false;

  //To show permissions
  allowToViewPermissions: boolean = false;

  //now if displayPlagination want value has been true in page
  displayPagination: boolean = false;

  currentSortedColumn: string = "";

  currentSortedOrder: string = "";

  noDataFound: boolean = false;

  total: number = 18;

  page: number = 1;

  pageSize: number = 100;

  collectionSize: number;

  deleteId: any;

  allowtoUpdate: boolean = false;

  allowtoUpdateMeterReset: boolean = false;

  allowtoAdd: boolean = false;

  allowtoDelete: boolean = false;

  unAssignUser: boolean = false;

  allowExportAsExcel: boolean = false;

  allowtoView: boolean = false;

  allowtoViewActions: boolean = false;

  allowtoApprove: boolean = false;

  allowtoReject: boolean = false;

  allowtoBulkActivate: boolean = false;

  allowtoBulkDeactivate: boolean = false;

  bulkActivationAllowed: boolean = false;

  bulkDeactivationAllowed: boolean = false;

  allowtoDisplayAcknowledged: boolean = false;

  allowtoAcknowledge: boolean = false;

  allowtoGenerate: boolean = false;

  allowtoExport: boolean = false;

  allowCheckBoxes: boolean = false;

  allowNewExtensionButton: boolean = false;

  bulkApprovalAllowed: boolean = true;

  bulkRejectAllowed: boolean = true;

  bulkDeleteAllowed: boolean = true;

  allowtoAddTenantManager: boolean = false;

  allowtoAddFacilityManager: boolean = false;

  allowtoRemoveFacilityManager: boolean = false;

  userAllowBulkActivateButton: boolean = false;

  userAllowBulkDeactivateButton: boolean = false;

  titleOfTable: string = "";

  recordDeleteConfirmationMessage: string = "";

  recordEditConfirmationMessage: string = "";

  recordApproveConfirmationMessage: string = "";

  recordRejectConfirmationMessage: string = "";

  recordDeletedNotificationMessage: string = "";

  recordUpdatedNotificationMessage: string = "";

  recordApprovedNotificationMessage: string = "";

  recordRejectedNotificationMessage: string = "";

  isBulkSelected: boolean = false;

  userAllowBulkApproveButton: boolean = false;

  userAllowBulkRejectButton: boolean = false;

  userAllowBulkDeleteButton: boolean = false;

  view_single_record_permission: string = "";

  approve_single_record_permission: string = "";

  reject_single_record_permission: string = "";

  recordDeactivateConfirmationMessage: string = "";

  recordActivateConfirmationMessage: string = "";

  constructor(
    private modalService: NgbModal,
    private notifierService: NgToastService,
    private appService: AppService,
    private sweetAlert: MessageService,
    private router: Router
  ) {
    this.collectionSize = this.dataArray.length;
  }

  ngOnInit(): void {
    if (
      this.dataArray == undefined ||
      this.dataArray == null ||
      this.dataArray.length == 0
    )
      this.noDataFound = true;

    this.pageSize = 20;

    this.setTableOptions();

    this.bulkApprovalAllowed = false;

    this.bulkDeleteAllowed = false;

    this.bulkRejectAllowed = false;

    this.isBulkSelected = false;

    //If number of rows per table if pagination is disabled
    if (!this.displayPagination) {
      this.selectedPageSize = 10000000;
    }
  }

  pageChangeEvent(pageNumberSelected: number) {
    this.selectedPage = pageNumberSelected;

    this.onPaginationChanged.emit(pageNumberSelected);
  }

  //This method set the properties for the datatable
  setTableOptions() {
    if (this.dataTableOptions != undefined && this.dataTableOptions != null) {
      this.view_single_record_permission =
        this.dataTableOptions.view_single_Record_permission;

      //assign in platform user showing button
      this.allowToViewPlatformUsers =
        this.dataTableOptions.allowToViewPlatformUsers;

      //assign view permission button
      this.allowToViewPermissions =
        this.dataTableOptions.allowToViewPermissions;

      this.approve_single_record_permission =
        this.dataTableOptions.approve_single_record_permission;

      this.reject_single_record_permission =
        this.dataTableOptions.reject_single_record_permission;

      this.allowtoUpdate = this.dataTableOptions.allowUpdateButton;

      this.displayPagination = this.dataTableOptions.displayPagination;

      this.allowtoUpdateMeterReset =
        this.dataTableOptions.allowUpdateMeterResetButton;

      this.allowtoAdd = this.dataTableOptions.allowAddButton;

      this.allowtoView = this.dataTableOptions.allowViewButton;

      this.allowtoViewActions = this.dataTableOptions.allowViewActionsButton;

      this.allowtoDelete = this.dataTableOptions.allowDeleteButton;

      this.unAssignUser = this.dataTableOptions.unAssignUserButton;

      this.allowtoApprove = this.dataTableOptions.allowApproveButton;

      this.allowtoAcknowledge = this.dataTableOptions.allowAcknowledgeButton;

      this.allowtoDisplayAcknowledged =
        this.dataTableOptions.allowDisplayAcknowledgedButton;

      this.allowtoReject = this.dataTableOptions.allowRejectButton;

      this.allowtoBulkActivate = this.dataTableOptions.allowActivateButton;

      this.allowtoBulkDeactivate = this.dataTableOptions.allowDeactivateButton;

      this.allowCheckBoxes = this.dataTableOptions.allowCheckbox;

      this.allowtoGenerate = this.dataTableOptions.allowGenerateButton;

      this.allowtoExport = this.dataTableOptions.allowExportButton;

      this.titleOfTable = this.dataTableOptions.tableTitle;

      this.allowExportAsExcel = this.dataTableOptions.allowExportAsExcel;

      this.allowtoAddTenantManager =
        this.dataTableOptions.allowtoAddTenantManager;

      this.allowtoAddFacilityManager =
        this.dataTableOptions.allowtoAddFacilityManager;

      this.allowtoRemoveFacilityManager =
        this.dataTableOptions.allowtoRemoveFacilityManager;

      this.userAllowBulkApproveButton =
        this.dataTableOptions.allowBulkApproveButton;

      this.userAllowBulkRejectButton =
        this.dataTableOptions.allowBulkRejectButton;

      this.userAllowBulkActivateButton =
        this.dataTableOptions.allowBulkActivateButton;

      this.userAllowBulkDeactivateButton =
        this.dataTableOptions.allowBulkDeactivateButton;

      // this.userAllowBulkDeleteButton =
      //   this.dataTableOptions.allowBulkApproveButton;

      this.userAllowBulkDeleteButton =
        this.dataTableOptions.allowBulkDeleteButton;

      this.recordDeleteConfirmationMessage =
        this.dataTableOptions.rowDeleteConfirmationMessage;

      this.recordEditConfirmationMessage =
        this.dataTableOptions.rowEditConfirmationMessage;

      this.recordApproveConfirmationMessage =
        this.dataTableOptions.recordApproveConfirmationMessage;

      this.recordRejectConfirmationMessage =
        this.dataTableOptions.recordRejectingConfirmationMessage;

      this.recordDeletedNotificationMessage =
        this.dataTableOptions.recordDeletedNotificationMessage;

      this.recordDeactivateConfirmationMessage =
        this.dataTableOptions.recordDeactivateConfirmationMessage;

      this.recordUpdatedNotificationMessage =
        this.dataTableOptions.recordUpdatedNotificationMessage;

      this.recordApprovedNotificationMessage =
        this.dataTableOptions.recordApprovedNotificationMessage;

      this.recordRejectedNotificationMessage =
        this.dataTableOptions.recordRejectedNotificationMessage;

      this.recordActivateConfirmationMessage =
        this.dataTableOptions.recordActivateConfirmationMessage;
    }
  }

  //show users in respective platforms
  showPlatformUserView(item: any) {
    this.onViewPlaformUsers.emit(item);
    this.router.navigate([`/platform-users/${item.PlatformId}/${item.PlatformName}`]);
  }

  loadPermissionData(id: any) {
    this.onViewPermission.emit(id);
  }

  //Method handles update buttton click on the grid
  updateData(id: any) {
    this.modalService.dismissAll("close click"); //Hide update confirmation modal

    this.onEdit.emit(id);
  }

  removeData(id:any){
    this.modalService.dismissAll("close click"); //Hide update confirmation modal

    this.onAcknowledge.emit(id);
  }

  //Method handles acknowledge buttton click on the grid
  acknowledgeConfirm(id: any) {
    this.modalService.dismissAll("close click"); //Hide update confirmation modal

    if (id == -1) {
      //Bulk selection
      this.onRemove.emit(this.selectedItemArray);
    } //Single item selection
    else {
      let tempSelectedItemArray = [];

      tempSelectedItemArray.push(id);

      this.onRemove.emit(tempSelectedItemArray);
    }
  }

  //Method handles remove buttton click on the grid
  removeConfirm(id: any) {
    this.modalService.dismissAll("close click"); //Hide update confirmation modal

    if (id == -1) {
      //Bulk selection
      this.onRemove.emit(this.selectedItemArray);
    } //Single item selection
    else {
      let tempSelectedItemArray = [];

      tempSelectedItemArray.push(id);

      this.onRemove.emit(tempSelectedItemArray);
    }
  }

  //Load and Display delete confirmation modal
  confirm(content: any, record: any, control: string) {
    if (control == "Approve") {
      if (
        this.selectedItemArray == undefined ||
        this.selectedItemArray == null ||
        this.selectedItemArray.length == 0
      ) {
        this.notifierService.warning({
          type: "warning",
          detail: "Warning",
          summary: "Please select records to approve",
          duration: 2000,
        });

        return;
      }
    } else if (control == "Reject") {
      if (
        this.selectedItemArray == undefined ||
        this.selectedItemArray == null ||
        this.selectedItemArray.length == 0
      ) {
        this.notifierService.warning({
          type: "warning",
          detail: "Warning",
          summary: "Please select records to reject",
          duration: 2000,
        });

        return;
      }
    } else if (control == "Delete") {
      if (
        this.selectedItemArray == undefined ||
        this.selectedItemArray == null ||
        this.selectedItemArray.length == 0
      ) {
        this.notifierService.warning({
          type: "warning",
          detail: "Warning",
          summary: "Please select records to delete",
          duration: 2000,
        });

        return;
      }
    }

    this.deleteId = record.id;

    this.selectedDataRow = record;

    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  GenerateReportButtonPress() {
    this.onReportGenerateClick.emit();
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, "");
  }

  //Load and Display delete confirmation modal

  confirmApproval(content: any, id: any) {
    this.deleteId = id;

    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  //This method handles the row double click function. Will emmit the relavant id for the row
  LoadDataOnRowDoubleClick(row: any) {
    this.onRowDoubleClick.emit(row);
  }

  DownloadButtonClick(row: any) {
    this.onDownloadClick.emit(row);
  }

  //Delete Record from the database
  deleteData(id: any) {
    this.modalService.dismissAll("close click"); //Hide Delete confirmation modal

    let timerInterval: any;

    if (id == -1) {
      //Bulk selection
      this.onDelete.emit(this.selectedItemArray);
    } //Single item selection
    else {
      let tempSelectedItemArray = [];

      tempSelectedItemArray.push(id);

      this.onDelete.emit(tempSelectedItemArray);
    }
  }

  //Approve Record
  confirmRecord(id: any) {
    this.modalService.dismissAll("close click"); //Hide Delete confirmation modal

    let tempOutputArray: any[] = [];

    if (id == undefined || id == -1) {
      //Bulk selection
      tempOutputArray.push(this.selectedItemArray);

      tempOutputArray.push(this.selectedDataRow);

      this.onApproval.emit(tempOutputArray);
    } //Single item selection
    else {
      this.selectedItemArray.push(this.selectedDataRow);

      tempOutputArray.push(this.selectedItemArray);

      this.onApproval.emit(tempOutputArray);
    }
  }

  //Rejected Record
  rejectRecord(id: any) {
    this.modalService.dismissAll("close click"); //Hide Delete confirmation modal

    let tempOutputArray: any[] = [];

    if (id == undefined || id == -1) {
      //Bulk selection
      tempOutputArray.push(this.selectedItemArray);

      tempOutputArray.push(this.selectedDataRow);

      this.onReject.emit(tempOutputArray);
    } //Single item selection
    else {
      this.selectedItemArray.push(this.selectedDataRow);

      tempOutputArray.push(this.selectedItemArray);

      this.onReject.emit(tempOutputArray);
    }
  }

  //This method handles the bulk selection for the table
  bulckSelectChange() {
    if (
      this.dataArray != undefined &&
      this.dataArray != null &&
      this.dataArray.length > 0
    ) {
      if (this.isBulkSelected) {
        for (let entry of this.dataArray) {
          if (entry.isRejecteableOrApprovableRecord) {
            entry.selectedRec = true;
          }
        }
      } else {
        for (let entry of this.dataArray) {
          entry.selectedRec = false;
        }
      }

      this.loadSelectedRecords();

      this.ActivateBulkActionButton();
    }
  }

  //This method loads the selected records in to a selected item array
  loadSelectedRecords() {
    this.selectedItemArray = [];

    for (let entry of this.dataArray) {
      if (entry.selectedRec) {
        this.selectedItemArray.push(entry);
      }
    }
  }

  //Emit datamodel on checkbox select
  changeStatus() {
    //Filter selected items only here

    this.loadSelectedRecords();

    this.ActivateBulkActionButton();
  }

  //This method activate deactivate bulk action buttons based on selected records
  ActivateBulkActionButton(): void {
    if (
      this.selectedItemArray != undefined &&
      this.selectedItemArray != null &&
      this.selectedItemArray.length > 0
    ) {
      this.bulkApprovalAllowed = true;

      this.bulkActivationAllowed = true;

      this.bulkDeleteAllowed = true;

      this.bulkRejectAllowed = true;

      this.bulkDeactivationAllowed = true;
    } else {
      this.bulkApprovalAllowed = false;

      this.bulkActivationAllowed = false;

      this.bulkDeleteAllowed = false;

      this.bulkRejectAllowed = false;

      this.bulkDeactivationAllowed = false;
    }
  }

  //Handles the change of datarows DDL
  OnRowNumberChange(selectedID: any) {
    if (selectedID == undefined || selectedID == null || selectedID == -1) {
      this.pageSize = 20;
    }

    this.pageSize = selectedID;
  }

  pagesizeChanged(number: any) {
    this.onPagesizeChanged.emit(this.selectedPageSize);
  }

  sortData(column: string, order: string) {
    this.currentSortedColumn = column;

    this.currentSortedOrder = order;

    this.onSort.emit([column, order]);
  }
}

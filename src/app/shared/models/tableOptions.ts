export class tableOptions {
  displayPagination: boolean = false;

  allowToViewPlatformUsers: boolean = false;

  allowToViewPermissions: boolean = false;

  allowDeleteButton: boolean = false;

  allowUpdateButton: boolean = false;

  allowUpdateMeterResetButton: boolean = false;

  allowAddButton: boolean = false;

  allowViewButton: boolean = false;

  allowViewActionsButton: boolean = false;

  allowApproveButton: boolean = false;

  allowExportAsExcel: boolean = false;

  allowRejectButton: boolean = false;

  allowDeactivateButton: boolean = false;

  allowAcknowledgeButton: boolean = false;

  allowDisplayAcknowledgedButton: boolean = false;

  allowGenerateButton: boolean = false;

  allowExportButton: boolean = false;

  allowNewExtensionButton: boolean = false;

  allowNewStandingOrderButton: boolean = false;

  allowCheckbox: boolean = false;

  allowBulkApproveButton: boolean = false;

  allowBulkActivateButton: boolean = false;

  allowBulkDeactivateButton: boolean = false;

  allowActivateButton: boolean = false;

  allowBulkRejectButton: boolean = false;

  allowBulkDeleteButton: boolean = false;

  unAssignUserButton: boolean = false;

  tableTitle: string = ""; //Display the title of the table above the table

  rowDeleteConfirmationMessage: string = "";

  rowEditConfirmationMessage: string = "";

  recordApproveConfirmationMessage: string = "";

  recordRejectingConfirmationMessage: string = "";

  recordDeletedNotificationMessage: string = "";

  recordUpdatedNotificationMessage: string = "";

  recordApprovedNotificationMessage: string = "";

  recordRejectedNotificationMessage: string = "";

  allowtoAddTenantManager: boolean = false;

  allowtoAddFacilityManager: boolean = false;

  allowtoRemoveTenantManager: boolean = false;

  allowtoRemoveFacilityManager: boolean = false;

  allowtoRemoveOPCTag: boolean = false; //This Displays/Hide OPC tag removing button
}

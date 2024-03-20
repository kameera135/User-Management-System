import { dateFormat } from "./dateFormat";

export interface appSettingModel {
  PlatformList: any;
  version: string;

  apiUrl: string;

  signOn: boolean;

  clientURI: string; // Client URI for OAuth2.0

  configModule: string;

  camsBackEnd: string;

  nameOfOrganization: string;

  footerMessage: string;

  moduleName: string;

  moduleNameColor: string;

  datePickerDateFormat: dateFormat;

  pageSizeArray: number[];

  maximumYearRangeForInvoice: number;

  maximumYearRangeForReport: number;

  maximumYearRange: number;

  billingDate: number;

  servicesList: JSON;

  reportFillColor: string;

  consumptionReportName: any[];

  consumptionSheetName: any[];

  roleList: any[];

  platformList: any[];

  months: any[];

  passwordPolicyTimeUnitList: any[];
}

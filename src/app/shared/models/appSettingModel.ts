import { dateFormat } from "./dateFormat";

export interface appSettingModel {
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

  signInButtonColor: string;

  datePickerDateFormat: dateFormat;

  pageSizeArray: number[];

  maximumYearRange: number;

  servicesList: JSON;

  reportFillColor: string;

  roleList: any[];

  platformList: any[];

  months: any[];

  passwordPolicyTimeUnitList: any[];
}

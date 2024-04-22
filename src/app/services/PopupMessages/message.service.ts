import { Injectable } from "@angular/core";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor(
    private appConfigService: AppService,
    private notifierService: NgToastService
  ) {}

  successSweetAlertMessage(
    messageText: any,
    messgaeHeader: any,
    messageDuration: number
  ) {
    Swal.fire({
      background: "DarkSeaGreen",

      customClass: {
        title: "text-black",
      },

      title: messgaeHeader,

      text: messageText,

      icon: "success",

      showConfirmButton: false,

      confirmButtonColor: "#299cdb",

      timer:
        this.appConfigService.popUpMessageConfig[0]
          .messageDurationInMiliSeconds,

      timerProgressBar: true,

      willClose: () => {
        clearInterval(messageDuration);
      },
    });
  }

  warningSweetAlertMessage(
    messageText: any,
    messgaeHeader: any,
    messageDuration: number
  ) {
    Swal.fire({
      background: "LightPink",

      customClass: {
        title: "text-black",
      },

      title: messgaeHeader,

      text: messageText,

      icon: "error",

      showConfirmButton: false,

      confirmButtonColor: "#299cdb",

      timer:
        this.appConfigService.popUpMessageConfig[0]
          .errorMessageDurationInMiliSeconds,

      timerProgressBar: true,

      willClose: () => {
        clearInterval(messageDuration);
      },
    });
  }

  sideSuccessAlert(detail: string, summary: string) {
    this.notifierService.success({
      detail: detail,
      summary: summary,
      duration:
        this.appConfigService.popUpMessageConfig[0]
          .messageDurationInMiliSeconds,
    });
  }

  sideErrorAlert(detail: string, summary: string) {
    this.notifierService.error({
      detail: detail,
      summary: summary,
      duration:
        this.appConfigService.popUpMessageConfig[0]
          .messageDurationInMiliSeconds,
    });
  }

  sideWarningAlert(detail: string, summary: string) {
    this.notifierService.warning({
      detail: detail,
      summary: summary,
      duration:
        this.appConfigService.popUpMessageConfig[0]
          .messageDurationInMiliSeconds,
    });
  }

  sideInfoAlert(detail: string, summary: string) {
    this.notifierService.info({
      detail: detail,
      summary: summary,
      duration:
        this.appConfigService.popUpMessageConfig[0]
          .messageDurationInMiliSeconds,
    });
  }
}

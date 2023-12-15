import { Injectable } from "@angular/core";
import { AppService } from "src/app/app.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor(private appConfigService: AppService) {}

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
}

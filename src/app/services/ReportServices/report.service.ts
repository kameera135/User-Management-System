import { Injectable } from "@angular/core";
import * as Excel from "exceljs";
import { AppService } from "src/app/app.service";
import { PlatformConfigurationComponent } from "src/app/pages/modules/cams-new/platform-configuration/platform-configuration.component";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(private appService: AppService) {}

  //This method generates an excel file
  async generateExcelFile(
    arrayOfArrayData: any[],
    sheetName: string,
    reportName: string
  ) {
    const createOuterBorder = (
      worksheet: any,
      start: any = { row: 1, col: 1 },
      end: any = { row: 1, col: 1 },
      borderWidth = "thin"
    ) => {
      const borderStyle = {
        style: borderWidth,
      };

      for (let i = start.row; i <= end.row; i++) {
        for (let j = start.col; j <= end.col; j++) {
          const cell = worksheet.getCell(i, j);
          cell.border = {
            top: borderStyle,
            left: borderStyle,
            right: borderStyle,
            bottom: borderStyle,
          };
        }
      }
    };

    const excel_type =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet(sheetName, {
      views: [{ showGridLines: false }],
    });
    const fillColor: any = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: this.appService.appConfig[0].reportFillColor },
    };
    //add data to the sheet
    ws.addRows(arrayOfArrayData);
    ws.properties.defaultColWidth = 25;

    //add style to the report

    //Activity Logs
    if (arrayOfArrayData[0] == "Activity Logs") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").font = { size: 16, bold: true };
      ws.getRow(9).font = { bold: true };

      for (let i = 1; i < 8; i++) {
        ws.getCell(1, i).fill = fillColor;
        ws.getCell(9, i).fill = fillColor;
      }

      for (let i = 9; i < arrayOfArrayData.length; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      createOuterBorder(
        ws,
        { row: 9, col: 1 },
        { row: arrayOfArrayData.length - 2, col: 7 }
      );
    }

    // download excel file
    wb.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: excel_type });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none");
      a.href = url;
      a.download = reportName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
}

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
    //Meter Daily Summary Data
    if (arrayOfArrayData[2] == "Meter Daily Summary") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").font = { size: 16, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(9).font = { bold: true };
      ws.getCell("A1").fill = fillColor;
      ws.getCell("B1").fill = fillColor;
      ws.getCell("C1").fill = fillColor;
      ws.getCell("D1").fill = fillColor;
      ws.getCell("F1").fill = fillColor;
      ws.getCell("E1").fill = fillColor;
      ws.getCell("F1").fill = fillColor;
      ws.getCell("G1").fill = fillColor;
      ws.getCell("H1").fill = fillColor;
      ws.getCell("I1").fill = fillColor;
      ws.getCell("A3").fill = fillColor;
      ws.getCell("B3").fill = fillColor;
      ws.getCell("C3").fill = fillColor;
      ws.getCell("D3").fill = fillColor;
      ws.getCell("F3").fill = fillColor;
      ws.getCell("E3").fill = fillColor;
      ws.getCell("F3").fill = fillColor;
      ws.getCell("G3").fill = fillColor;
      ws.getCell("H3").fill = fillColor;
      ws.getCell("I3").fill = fillColor;
      ws.getCell("A9").fill = fillColor;
      ws.getCell("B9").fill = fillColor;
      ws.getCell("C9").fill = fillColor;
      ws.getCell("D9").fill = fillColor;
      ws.getCell("F9").fill = fillColor;
      ws.getCell("E9").fill = fillColor;
      ws.getCell("F9").fill = fillColor;
      ws.getCell("G9").fill = fillColor;
      ws.getCell("H9").fill = fillColor;
      ws.getCell("I9").fill = fillColor;

      for (let i = 9; i < 42; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      createOuterBorder(
        ws,
        { row: 9, col: 1 },
        { row: arrayOfArrayData.length - 2, col: 9 }
      );
    }

    //Meter Compensates Data
    if (arrayOfArrayData[2] == "Meter Compensates Data") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").font = { size: 16, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(9).font = { bold: true };
      ws.getCell("A1").fill = fillColor;
      ws.getCell("B1").fill = fillColor;
      ws.getCell("C1").fill = fillColor;
      ws.getCell("A3").fill = fillColor;
      ws.getCell("B3").fill = fillColor;
      ws.getCell("C3").fill = fillColor;
      ws.getCell("A9").fill = fillColor;
      ws.getCell("B9").fill = fillColor;
      ws.getCell("C9").fill = fillColor;

      for (let i = 9; i < 42; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      createOuterBorder(
        ws,
        { row: 9, col: 1 },
        { row: arrayOfArrayData.length - 2, col: 3 }
      );
    }

    //Meter Auto and Manual Meter Readings
    if (arrayOfArrayData[2] == "Meter Readings") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").font = { size: 16, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(10).font = { bold: true };
      ws.getCell("A1").fill = fillColor;
      ws.getCell("B1").fill = fillColor;
      ws.getCell("C1").fill = fillColor;
      ws.getCell("A3").fill = fillColor;
      ws.getCell("B3").fill = fillColor;
      ws.getCell("C3").fill = fillColor;
      ws.getCell("A10").fill = fillColor;
      ws.getCell("B10").fill = fillColor;
      ws.getCell("C10").fill = fillColor;

      for (let i = 10; i < 10000; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      createOuterBorder(
        ws,
        { row: 10, col: 1 },
        { row: arrayOfArrayData.length - 2, col: 3 }
      );
    }

    //Consumption By Service
    if (arrayOfArrayData[2] == "Consumption By Service Report") {
      // ws.getColumn('A').width = 2;
      ws.getRow(1).height = 25;
      ws.getCell("A1").alignment = { vertical: "middle" };
      ws.getCell("A1").font = { size: 20, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(10).font = { bold: true };

      const lastRow = arrayOfArrayData.length - 2;

      createOuterBorder(ws, { row: 10, col: 1 }, { row: lastRow, col: 4 });

      for (let i = 10; i <= lastRow; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      ws.getCell("B10").fill = fillColor;
      ws.getCell("C10").fill = fillColor;
      ws.getCell("D10").fill = fillColor;
      ws.getCell("A10").fill = fillColor;

      ws.getCell("B1").fill = fillColor;
      ws.getCell("C1").fill = fillColor;
      ws.getCell("D1").fill = fillColor;
      ws.getCell("A1").fill = fillColor;

      ws.getCell("B3").fill = fillColor;
      ws.getCell("C3").fill = fillColor;
      ws.getCell("D3").fill = fillColor;
      ws.getCell("A3").fill = fillColor;
    }

    //Consumption By Meter
    //if (reportName.slice(0, 21) == 'Consumption_By_Meter_')
    if (arrayOfArrayData[2] == "Consumption By Meter Report") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").alignment = { vertical: "middle" };
      ws.getCell("A1").font = { size: 20, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(11).font = { bold: true };

      const lastRow = arrayOfArrayData.length - 2;

      createOuterBorder(ws, { row: 11, col: 1 }, { row: lastRow, col: 4 });

      for (let i = 11; i <= lastRow; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      ws.getCell("B11").fill = fillColor;
      ws.getCell("C11").fill = fillColor;
      ws.getCell("D11").fill = fillColor;
      ws.getCell("A11").fill = fillColor;

      ws.getCell("A1").fill = fillColor;
      ws.getCell("B1").fill = fillColor;
      ws.getCell("C1").fill = fillColor;
      ws.getCell("D1").fill = fillColor;

      ws.getCell("A3").fill = fillColor;
      ws.getCell("B3").fill = fillColor;
      ws.getCell("C3").fill = fillColor;
      ws.getCell("D3").fill = fillColor;
    }

    //Consumption History
    if (arrayOfArrayData[2] == "Consumption History Report") {
      ws.getRow(1).height = 25;
      ws.getCell("A1").alignment = { vertical: "middle" };
      ws.getCell("A1").font = { size: 20, bold: true };
      ws.getCell("A3").font = { size: 14, bold: true };
      ws.getRow(9).font = { bold: true };

      const lastRow = arrayOfArrayData.length - 2;
      const lastColIndex = arrayOfArrayData[15][4];
      let lastCol = arrayOfArrayData[15].length;

      if (lastColIndex == undefined) {
        lastCol = lastCol - 1;
      }

      createOuterBorder(
        ws,
        { row: 9, col: 1 },
        { row: arrayOfArrayData.length - 2, col: arrayOfArrayData[8].length }
      );

      for (let i = 9; i <= lastRow; i++) {
        ws.getRow(i).alignment = { horizontal: "center" };
      }

      if (lastColIndex != undefined) {
        ws.getCell("E1").fill = fillColor;
        ws.getCell("E3").fill = fillColor;
        ws.getCell("E9").fill = fillColor;
      }

      // ws.getCell('B9').fill = fillColor;
      // ws.getCell('C9').fill = fillColor;
      // ws.getCell('D9').fill = fillColor;
      // ws.getCell('A9').fill = fillColor;

      // ws.getCell('A1').fill = fillColor;
      // ws.getCell('B1').fill = fillColor;
      // ws.getCell('C1').fill = fillColor;
      // ws.getCell('D1').fill = fillColor;

      // ws.getCell('A3').fill = fillColor;
      // ws.getCell('B3').fill = fillColor;
      // ws.getCell('C3').fill = fillColor;
      // ws.getCell('D3').fill = fillColor;

      var fillManually = false;

      for (let i = 1; i < arrayOfArrayData[8].length + 1; i++) {
        console.log("arrayOfArrayData[8]", arrayOfArrayData[8]);

        if (arrayOfArrayData[8].length < 3) {
          fillManually = true;
        } else {
          ws.getCell(1, i).fill = fillColor;
        }

        ws.getCell(3, i).fill = fillColor;
        ws.getCell(9, i).fill = fillColor;
      }

      //Manually fill the first line without iteration
      if (fillManually) {
        ws.getCell(1, 1).fill = fillColor;
        ws.getCell(1, 2).fill = fillColor;
        ws.getCell(1, 3).fill = fillColor;
      }
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

  //HEX to HSL
  // hexToHSL(hex: string): { h: number; s: number; l: number } {
  //   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  //   if (!result) {
  //     throw new Error('Invalid hex color');
  //   }

  //   let r = parseInt(result[1], 16);
  //   let g = parseInt(result[2], 16);
  //   let b = parseInt(result[3], 16);
  //   r /= 255, g /= 255, b /= 255;

  //   const max = Math.max(r, g, b);
  //   const min = Math.min(r, g, b);
  //   let h, s, l = (max + min) / 2;

  //   if (max === min) {
  //     h = s = 0; // achromatic
  //   } else {
  //     const d = max - min;
  //     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  //     switch (max) {
  //       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  //       case g: h = (b - r) / d + 2; break;
  //       case b: h = (r - g) / d + 4; break;
  //     }
  //     h /= 6;
  //   }

  //   const HSL = {
  //     h,
  //     s,
  //     l
  //   };

  //   return HSL;
  // }

  // Example usage:
  // const hexColor = "#3498db";
  // const hslColor = hexToHSL(hexColor);
  // console.log(hslColor);

  // async hexToHSL(hex: string) {
  //   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  //   let r = parseInt(result![1], 16);
  //   let g = parseInt(result![2], 16);
  //   let b = parseInt(result![3], 16);
  //   r /= 255, g /= 255, b /= 255;
  //   var max = Math.max(r, g, b), min = Math.min(r, g, b);
  //   var h, s, l = (max + min) / 2;
  //   if (max == min) {
  //     h = s = 0; // achromatic
  //   } else {
  //     var d = max - min;
  //     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  //     switch (max) {
  //       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  //       case g: h = (b - r) / d + 2; break;
  //       case b: h = (r - g) / d + 4; break;
  //     }

  //     var h /= 6;
  //   }
  //   var HSL = new Object();
  //   HSL['h'] = h;
  //   HSL['s'] = s;
  //   HSL['l'] = l;
  //   return HSL;
  // }

  // //HSL to HEX

  // async hslToHex(h, s, l) {
  //   h /= 360;
  //   s /= 100;
  //   l /= 100;
  //   let r, g, b;
  //   if (s === 0) {
  //     r = g = b = l; // achromatic
  //   } else {
  //     const hue2rgb = (p, q, t) => {
  //       if (t < 0) t += 1;
  //       if (t > 1) t -= 1;
  //       if (t < 1 / 6) return p + (q - p) * 6 * t;
  //       if (t < 1 / 2) return q;
  //       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  //       return p;
  //     };
  //     const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  //     const p = 2 * l - q;
  //     r = hue2rgb(p, q, h + 1 / 3);
  //     g = hue2rgb(p, q, h);
  //     b = hue2rgb(p, q, h - 1 / 3);
  //   }
  //   const toHex = x => {
  //     const hex = Math.round(x * 255).toString(16);
  //     return hex.length === 1 ? '0' + hex : hex;
  //   };
  //   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  // }
}

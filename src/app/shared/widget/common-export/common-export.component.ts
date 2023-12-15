import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-common-export',
  templateUrl: './common-export.component.html',
  styleUrls: ['./common-export.component.scss']
})
export class CommonExportComponent {

  @Output() onExcelExport = new EventEmitter();//Handles Export as excel button click

  //This method hadles Export as an excel button click
  onExportAsExcelClick()
  {

      this.onExcelExport.emit();

  }

}

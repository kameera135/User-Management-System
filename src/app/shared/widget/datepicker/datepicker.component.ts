import { Component, EventEmitter, Input, Output } from '@angular/core';
import { daterange } from '../../models/daterange';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerNewComponent {

  date!: any;

  @Input() calendarIcon: boolean = true;

  dateFormat: any = "Y-m-d";

  @Input() defaultDate: daterange = new daterange();

  daterange!: daterange;

  @Output() onDateSelected = new EventEmitter();


  constructor(private appConfigService: AppService) {


  }

  ngOnInit(): void {





    if (this.appConfigService.appConfig[0].datePickerDateFormat != undefined || this.appConfigService.appConfig[0].datePickerDateFormat != null) {

      //this.dateFormat = this.appConfigService.appConfig[0].datePickerDateFormat;

    }

    this.date = this.defaultDate.startDate;

  }

  onDateChange() {

    this.singleDateMode();

  }

  singleDateMode() {

    this.daterange = new daterange();

    this.daterange.startDate = this.date;

    this.onDateSelected.emit(this.daterange);

  }

}

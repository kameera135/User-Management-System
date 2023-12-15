import { Observable, catchError, throwError } from 'rxjs';
import { daterange } from '../daterange';

import { rangeValue } from '../rangeValueModel';

export interface IExtensionModal {

    loadingInProgress: boolean;

    selectedRequestType: any;



    loadStandingOrder:()=>void;

    loadExtensionDataByID:()=>void;

    handleLoadingExtensionData:()=>void;

    confirm:(content: any)=>void;

    closeSpecificmodal:(btnID:any,action:any)=>void;

    onTimeRangeChanged:(selectedRange: rangeValue)=>void;

    onDateChanged:(dateFromPicker: daterange)=>void;

    onStandingOrderStartDateChanged:(dateFromPicker: daterange)=>void;

    onStandingOrderEndDateChanged:(dateFromPicker: daterange)=>void;

    updateExtension:()=>void;

    saveExtension:()=>void;

    closeModal:()=>void;

    onAsseteTreeChanged:(selectedItems: any[])=>void;

    approveExtension:()=>void;

    handleBulkSelection:(selectedRecordsFromTable: any[])=>any[];

    rejectExtension:()=>void;

    editCurrentExtension:(state:boolean)=>void;

    deleteExtension:()=>void;

    onDateSelected:(dateFromPicker: daterange)=>void;

}
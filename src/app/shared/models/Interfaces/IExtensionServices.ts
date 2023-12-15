import { Observable, catchError, throwError } from 'rxjs';
import { daterange } from '../daterange';

export interface IExtensionServices {
    
    getExtensionInformation:(selectedDateRange:daterange, selectedStateArray: any[],selectedRequestTypeArray: any[],selectedPage:number, selectedUnitsArray: any[],pageSize:number)=> Observable<any>

    createNewExtension:(extensionDate:daterange,from:any,to:any,description:string,mode:string,selectedNodes:any[])=>void

    updateExtension:(id:number,extensionID:string,extensionDate:daterange,from:any,to:any)=>void

    deleteExtensions:(id:number,extensionID:string)=>void

    LoadExtensionInformationByID:(id:number,requestType:string)=>void

    approveExtensions:( lstExtensionId:any[]) =>void

    rejectExtension:(lstExtensionId:any[])=>void

}
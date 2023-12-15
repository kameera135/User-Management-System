import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitService {

  constructor() { }

  dataEvent = new EventEmitter<any>();

  emitData(data: any) {
    this.dataEvent.emit(data);
  }
}

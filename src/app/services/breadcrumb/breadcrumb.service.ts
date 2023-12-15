import { Injectable } from '@angular/core';
import { EventService } from 'src/app/core/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  constructor(private eventService: EventService) { }

  loadBreadcrumbValue(obj: any[]) {
    this.eventService.broadcast('changedBreadcrumbValue', obj);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { EventEmitService } from 'src/app/core/services/event-emit.service';


@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {

  constructor(private router: Router, private eventEmitService: EventEmitService,
    private app: AppService
  ) { }

  @Input() subMenus: any = [];

  sub1: any = typeof this.subMenus;

  defaultIcons = this.app.appConfig[0].defaultPlatformIcons;

  goToPage(path: string) {
    window.open(path, '_blank');
  }

  handleError(event: Event, label: string): void {
    const element = event.target as HTMLImageElement;
    // Check if the icon label exists in the defaultIcons array
    if (this.defaultIcons.includes(label)) {
      // If the label is in the array, try to load the corresponding icon
      element.src = `/assets/icons/${label}.png`;
    } else {
      // If not, fallback to the default platform.png
      element.src = '/assets/icons/platform.png';
    }
  }
}



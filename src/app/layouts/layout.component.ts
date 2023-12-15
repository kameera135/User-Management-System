import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../core/services/event.service';
import { LAYOUT_HORIZONTAL } from './layout.model';
import { HorizontalComponent } from './theme/theme.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {

  @ViewChild(HorizontalComponent) childHorizontal!: HorizontalComponent;


  constructor() {

  }

  ngOnInit(): void {

  }
}

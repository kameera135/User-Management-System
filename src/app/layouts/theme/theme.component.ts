import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})

/**
 * Horizontal Component
 */
export class HorizontalComponent implements OnInit {

  // colorTheme:string="light";
  showTopbar: boolean = true;

  constructor(private appService: AppService) { }

  @ViewChild(NavbarComponent) childHorizontalTopBar!: NavbarComponent;

  ngOnInit(): void {

    document.documentElement.setAttribute('data-layout', 'horizontal');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-layout-style', 'default');

    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');
  }

  changeMenu(module: any) {
    this.childHorizontalTopBar.changeMenu(module);
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
    }
  }

}

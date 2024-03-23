import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { EventService } from "../../core/services/event.service";
import { MenuItem } from "./menu.model";
import { MenuService } from "../../services/menu.service";
import { EventEmitService } from "src/app/core/services/event-emit.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  menu: any;

  mode: string | undefined;

  showNavbar: boolean = false;

  menuItems: MenuItem[] = [];

  @ViewChild("sideMenu") sideMenu!: ElementRef;

  @Output() mobileMenuButtonClicked = new EventEmitter();

  moduleNumber: any = 1;

  moduleName: any = "";

  breadCrumbItems: any[] = [];

  breadCrumbTitle: string = "";

  receivedPathFromDashboard: any;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private eventService: EventService,
    private sideMenuService: MenuService,
    private eventEmitService: EventEmitService,
    private auth: AuthService
  ) {
    translate.setDefaultLang("en");

    this.eventEmitService.dataEvent.subscribe((data) => {
      this.receivedPathFromDashboard = data;
      console.log(
        "Received Path From Dashboard",
        this.receivedPathFromDashboard
      );

      console.log("receivedPathFromDashboard", this.receivedPathFromDashboard);
      //this.updateDashboardSelection(this.receivedPathFromDashboard)
    });
  }

  user = this.auth.getUser();

  ngOnInit(): void {

    // if (this.user && this.user.UserDetails) {
    //   // Iterate through UserDetails array to find the role
    //   for (const detail of this.user.UserDetails) {
    //     // Parse the stringified JSON object
    //     const UserDetails = JSON.parse(detail);
    //     console.log("userDetails",UserDetails);
        
    //     // Check if the role is 'admin'
    //     if (UserDetails.Role === 'admin') {
    //       // If 'admin', set showNavbar to true and break the loop
    //       this.showNavbar = true;
    //       break;
    //     }
    //   }
    // }
    //Load all the appropriate menu items from the database according to the user rights
    this.menuItems = this.sideMenuService.getMenu();

    this.eventService.subscribe("changedBreadcrumbValue", (layout) => {
      this.breadCrumbItems = layout;
    });

    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
    
  }

  //This method set the selected module number and then referesh the page to populate the changes
  changeMenu(module: any) {
    this.moduleNumber = module;

    this.ngOnInit();
  }

  //This method Filter out the appropriate links for the selected module
  findModuleLinks(menuItem: any[]): any[] {
    return menuItem.filter((p) => p.module == this.moduleNumber);
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.initActiveMenu();
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling
          ? item.nextElementSibling.classList.remove("show")
          : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) {
    // navbar-nav menu add active
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .previousElementSibling.setAttribute("aria-expanded", "true");
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    console.log("event", event);
    const ul = document.getElementById("navbar-nav");

    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
    console.log("event.target", event.target);
    //event.target = <a _ngcontent-vhf-c2="" class="nav-link active" ng-reflect-router-link="/meter-daily-summary" data-parent="800" href="/meter-daily-summary" aria-expanded="false"><!--bindings={}-->Meter Daily Summary </a>
  }

  updateDashboardSelection(path: string) {
    const ul = document.getElementById("navbar-nav");

    const simulatedEvent = {
      target: `<a _ngcontent-vhf-c2="" class="nav-link active" ng-reflect-router-link="${path}" data-parent="800" href="${path}" aria-expanded="false"><!--bindings={}-->Meter Daily Summary </a>`,
    };

    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(simulatedEvent);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");

    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) =>
        x.classList.contains("active")
      );
      this.removeActivation(activeItems);
      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  toggleSubItem(event: any) {
    if (event.target && event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle("show");
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");

    let isMenu = isCurrentMenuId.nextElementSibling as any;
    let dropDowns = Array.from(document.querySelectorAll("#navbar-nav .show"));
    dropDowns.forEach((node: any) => {
      node.classList.remove("show");
    });

    isMenu ? isMenu.classList.add("show") : null;

    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) =>
        x.classList.contains("active")
      );
      activeIconItems.forEach((item: any) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      });
    }
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { AuthService } from "src/app/auth/auth.service";
import { UserInformationService } from "src/app/auth/user-information.service";
import { EventService } from "src/app/core/services/event.service";
import {
  DATA_PRELOADER,
  LAYOUT_MODE,
  LAYOUT_POSITION,
  LAYOUT_VERTICAL,
  LAYOUT_WIDTH,
  SIDEBAR_COLOR,
  SIDEBAR_IMAGE,
  SIDEBAR_SIZE,
  SIDEBAR_VIEW,
  SIDEBAR_VISIBILITY,
  TOPBAR,
} from "src/app/layouts/layout.model";
import { AssertTreeService } from "src/app/services/AssertTreeService/assert-tree.service";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { LocationMapService } from "src/app/services/location-map.service";
import { Unit } from "src/app/shared/models/Tbs/unit";

@Component({
  selector: "app-right-tree-node",
  templateUrl: "./right-tree-node.component.html",
  styleUrls: ["./right-tree-node.component.scss"],
})
export class RightTreeNodeComponent {
  /* layout: string | undefined;
   mode: string | undefined;
   width: string | undefined;
   position: string | undefined;
   topbar: string | undefined;
   size: string | undefined;
   sidebarView: string | undefined;
   sidebar: string | undefined;
   attribute: any;
   sidebarImage: any;
   sidebarVisibility: any;
   preLoader: any;
   grd: any;*/

  @Output() settingsButtonClicked = new EventEmitter();

  @Output() UnitSelectionChanged = new EventEmitter();

  @Input() selectedUnitId: any;

  selectedNodes: any[] = [];

  assertTreeData: AssertTreeNode[] = [];
  asseteTreeDataFetch: any = {};

  userId: number = 0;
  loadingInProgress: boolean = false;

  constructor(
    private eventService: EventService,
    private offcanvasService: NgbOffcanvas,
    private userInformationService: UserInformationService,
    private authService: AuthService,
    private notifierService: NgToastService,
    private appConfigService: AppService,
    private router: Router,
    private assertTreeService: AssertTreeService
  ) {}

  ngOnInit(): void {
    this.fetchAssertTree();

    let currentUser = this.authService.getUser();

    // this.userInformationService.getFreshAsseteTreeObject(currentUser.id)
    //   .subscribe({
    //     next: (response: any) => {
    //       if (response != null) {

    //         const configurations = JSON.parse(JSON.stringify(response));

    //         this.assertTreeData = configurations;

    //       }

    //     },
    //     error: (error: any) => {
    //       if (
    //         error != undefined &&
    //         error.status != undefined &&
    //         error.status == 403
    //       ) {

    //         this.router.navigate(['/no-permission']);

    //         this.notifierService.error({
    //           type: this.appConfigService.popUpMessageConfig[0]
    //             .FailedMessageHeadder,
    //           detail:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .FailedMessageHeadder,
    //           summary:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .SomethisngWentWrongMessage,
    //           duration:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .messageDurationInMiliSeconds,
    //         });

    //       } else {

    //         this.notifierService.error({
    //           type: this.appConfigService.popUpMessageConfig[0]
    //             .FailedMessageHeadder,
    //           detail:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .FailedMessageHeadder,
    //           summary:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .SomethisngWentWrongMessage,
    //           duration:
    //             this.appConfigService.popUpMessageConfig[0]
    //               .messageDurationInMiliSeconds,
    //         });

    //       }
    //     },
    //     complete() { },
    //   });
  }

  fetchAssertTree() {
    //this.loadingInProgress = true
    this.assertTreeService.getAssertTree().subscribe({
      next: (results: any) => {
        //debugger
        console.log("Getting the Assert Tree: ");

        this.assertTreeData = results;
        //this.loadingInProgress = false
      },
      error: (error: any) => {
        console.log("Getting Assert Tree : error");
        console.log(error);
      },
    });
  }

  //This function emits the selected list of units on selection change
  onAssertTreeChanged(selectedItems: any[]): void {
    console.log("right-tree-node", selectedItems);

    this.selectedNodes = selectedItems;

    this.UnitSelectionChanged.emit(selectedItems);
  }

  ngAfterViewInit() {}

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  //  Filter Offcanvas Set
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: "start" });
  }
}

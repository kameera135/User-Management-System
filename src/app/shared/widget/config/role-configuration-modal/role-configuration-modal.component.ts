import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgToastService } from "ng-angular-popup";
import { AppService } from "src/app/app.service";
import { Role as Role } from "src/app/shared/models/Cams-new/Role";

interface ListItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: "app-role-configuration-modal",
  templateUrl: "./role-configuration-modal.component.html",
  styleUrls: ["./role-configuration-modal.component.scss"],
})


export class RoleConfigurationModalComponent {
  roleList: any[] = this.appService.appConfig[0].roleList;
  platformList : any[] = this.appService.appConfig[0].platformList;


  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() roleCode!: string;
  @Input() roleName!: string;
  @Input() createdDate!: string;
  @Input() description!: string;
  @Input() status!: string;
  @Input() permission!: string;
  @Input() platform!: string

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  selectedRole: string = "User Managemant System";

  disablePlatforms: boolean = false; 

  isEditable: boolean = true;

  // Array to hold the dropdown options
  statusOptions: { label: string, value: string }[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Deactive', value: 'Deactive' }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notifierService: NgToastService,
    private appService: AppService
  ) {}

  ngOnInit() {
    if (this.type == "Add") {
      this.buttonName = "Add";
      this.buttonIcon = "bi-person-plus-fill";
    } else if (this.type == "Edit") {
      this.buttonName = "Save";
      this.buttonIcon = "bi-floppy2-fill";
    } else {
      this.buttonName = "Edit";
      this.buttonIcon = "bi-pencil-fill";
    }

    //cancel button
    this.cancelButtonIcon;
    this.cancelButtonName;

    //disable the input feild
    if (this.type === 'View') {
      this.disablePlatforms = true;
    } else {
      this.disablePlatforms = false;
    }
  }

  onFormSubmit() {
    if (
      this.roleCode == "" ||
      this.roleName == "" ||
      this.createdDate == "" ||
      this.description == "" ||
      this.status == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const role = new Role();
    role.roleId = this.roleCode;
    role.role = this.roleName;
    // role.createdDate = this.createdDate;
    // role.description = this.description;
    role.status = this.status;

    this.activeModal.close(role);
    
  }

  showListItems: boolean = false;
  
  listItems: ListItem[] = [
      { name: 'Item 1', selected: false },
      { name: 'Item 2', selected: false },
      { name: 'Item 3', selected: false }
  ]; // Replace with your list items

  toggleListItems() {
      // Toggle the visibility of list items view
      if (this.type !== 'View') {
          this.showListItems = !this.showListItems;
      }
  }

  addSelectedItems() {
      // Get selected items and add them to the textarea
      const selectedItems = this.listItems.filter(item => item.selected);
      this.permission = selectedItems.map(item => item.name).join('\n');

      // Hide the list items view after adding items to textarea
      this.showListItems = false;
  }
}

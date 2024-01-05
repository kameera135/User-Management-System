import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgToastService } from 'ng-angular-popup';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/shared/models/Cams-new/User';
import { tableOptions } from 'src/app/shared/models/tableOptions';

interface ListItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-platform-user-modal',
  templateUrl: './platform-user-modal.component.html',
  styleUrls: ['./platform-user-modal.component.scss']
})

export class PlatformUserModalComponent {

  roleList: any[] = this.appService.appConfig[0].roleList;

  @Input() type!: string;
  @Input() modalTitle!: string;
  @Input() userName!: string;
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() platform!: any;
  @Input() email!: string;
  @Input() phoneNumber!: string;
  @Input() password!: string;
  @Input() confirmPassword!: string;
  @Input() userProfileCode!: string;

  buttonName!: string;
  buttonIcon!: string;
  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";

  loadingInProgress: boolean = false;

  rolesViewTableOptions: tableOptions = new tableOptions();
  isEditable: boolean = true;

 

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

    this.rolesViewTableOptions
  }

  onFormSubmit() {
    if (
      this.userName == "" ||
      this.firstName == "" ||
      this.lastName == "" ||
      this.platform == "" ||
      this.userProfileCode == "" ||
      this.email == ""
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const user = new User();
    user.userName = this.userName;
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.platform = this.platform;
    user.email = this.email;
    user.phoneNumber = this.phoneNumber;
    user.userProfileCode = this.userProfileCode;

    this.activeModal.close(user);
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
      this.platform = selectedItems.map(item => item.name).join('\n');

      // Hide the list items view after adding items to textarea
      this.showListItems = false;
  }
  headArray = [
  
    { Head: "Platforms", FieldName: "Platforms", ColumnType: "Data" },
    { Head: "Role", FieldName: "Role", ColumnType: "Data" },
  ];

  tableData = [
      {
        Platforms: "Airecone Extention System",
        Role: "Facility Manager",
      },
      {
        Platforms: "Airecone Extention System",
        Role: "Tenant",
      },
      {
        Platforms: "Tenant Billing System",
        Role: "Tenant Manager",
      },
      {
        Platforms: "User Managemant System",
        Role: "Admin",
      },
      {
        Platforms: "Airecone Extention System",
        Role: "Tenant Manager",
      }
    ];

}

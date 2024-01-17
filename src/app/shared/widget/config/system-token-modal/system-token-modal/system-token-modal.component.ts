import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { AppService } from 'src/app/app.service';
import { HashService } from 'src/app/services/cams-new/hash.service';
import { SystemToken } from 'src/app/shared/models/Cams-new/SystemToken';

@Component({
  selector: 'app-system-token-modal',
  templateUrl: './system-token-modal.component.html',
  styleUrls: ['./system-token-modal.component.scss']
})
export class SystemTokenModalComponent {

  @Input() type!: string;
  @Input() modalTitle!: string;

  @Input() id!: string;
  @Input() token!: string;
  @Input() createdDate!: string;
  @Input() expireDate!: string;

  buttonName!: string;
  buttonIcon!: string;

  cancelButtonIcon: string = "bi-x-circle-fill";
  cancelButtonName: string = "Cancel";



  constructor(
    public activeModal: NgbActiveModal,
    public notifierService: NgToastService,
    public appService: AppService,
    
    //Import hashService
    private hashService: HashService

  ){}

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
    // if (this.type === 'View') {
    //   this.disablePlatforms = true;
    // } else {
    //   this.disablePlatforms = false;
    // }
  }

  onFormSubmit() {
    if (
      this.id == "" ||
      this.token == "" ||
      this.createdDate == "" ||
      this.expireDate == "" 
    ) {
      this.notifierService.warning({
        detail: "Warning",
        summary: "Please fill required fields",
        duration: 2000,
      });
      return;
    }

    const token = new SystemToken();

    token.tokenId = this.id;
    token.token = this.token;
    token.createdAt = this.createdDate;
    token.expireDate = this.expireDate


    this.activeModal.close(token);

    
  }

  //to generate a token
  generateToken(): void{

    this.hashService.generateHash(this.token).then((hashValue) => {
      this.token = hashValue;
    });

  }

}

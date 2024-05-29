import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-change-profile-pic-modal',
  templateUrl: './change-profile-pic-modal.component.html',
  styleUrls: ['./change-profile-pic-modal.component.scss']
})
export class ChangeProfilePicModalComponent {




  constructor(
    public activeModal: NgbActiveModal,
    private app: AppService
  ){}

  get profileImage(){

    const fullName = this.app.user?.fullName || 'John Doe'

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;
  }

}

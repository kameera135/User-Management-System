import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  message: string = "All rights reserved"

  constructor(
    private appConfigService: AppService
  ) { }

  ngOnInit(): void {
    this.scrollFunction();
    this.message = this.appConfigService.appConfig[0].footerMessage;
  }

  hideFooter() {
    if (!document.getElementById('footer')!.classList.contains('hidden')) {
      document.getElementById('footer')!.classList.add('hidden');
    }
  }

  showFooter() {
    if (document.getElementById('footer')!.classList.contains('hidden')) {
      document.getElementById('footer')!.classList.remove('hidden');
    }
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.hideFooter();
    } else {
      this.showFooter();
    }
  }

}

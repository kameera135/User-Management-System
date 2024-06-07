import { Component } from '@angular/core';

@Component({
  selector: 'app-trial-mode-bar',
  templateUrl: './trial-mode-bar.component.html',
  styleUrls: ['./trial-mode-bar.component.scss']
})
export class TrialModeBarComponent {

  constructor() { }

  closeBanner() {
    const banner = document.getElementById('trial-banner');
    if (banner) {
      banner.classList.add("hide-banner");
    }
  }
}

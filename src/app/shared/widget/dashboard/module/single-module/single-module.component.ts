import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-module',
  templateUrl: './single-module.component.html',
  styleUrls: ['./single-module.component.scss']
})
export class SingleModuleComponent {


  @Input() title: string | undefined;

  @Input() icon: string | undefined;

  @Input() moduleLinkURL:string ="";

  @Input() moduleImage:string ="";

  @Input() moduleKey:string ="";


  
  constructor(private router: Router) { }

  ngOnInit(): void {

    
  }

  //This method Load the appropriate module as per the provided link
  loadModule():void
  {


    let x=this.moduleKey ;
    this.router.navigateByUrl(this.moduleLinkURL);

    //this.router.navigate([this.moduleLinkURL], {queryParams: {moduleID:'1' }});

  }

}

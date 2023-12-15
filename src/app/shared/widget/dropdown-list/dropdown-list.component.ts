import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent {

  @Input() items:any[] = [];

  @Output() onChange = new EventEmitter();

  @Input() defaultText:string="Please Select";
  
  @Input() selectedItem:any;

  dataSource:any[] = [];


ngOnInit(): void {

  this.dataSource= this.items;

  this.onItemChange();

}

//Execute when the datamodel is changed and return the selected item(s)
onItemChange():void{

  let selectedItemArray:any[]=[];

  selectedItemArray= this.selectedItem;

  this.onChange.emit(selectedItemArray);

}


}

import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { AssertTreeNode } from "src/app/shared/models/assertTreeModel";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "app-treeview",
  templateUrl: "./treeview.component.html",
  styleUrls: ["./treeview.component.scss"],
})
export class TreeviewCheckboxComponent {
  @Input() treeDataSource: any; //Data for tree view

  @Input() displayCheckbox: boolean = true; //decide if display icons

  @Input() displayIcons: boolean = true; //decide if display icons

  @Output() onAssertTreeItemSelected = new EventEmitter();

  @Input() checkboxesOnLeafNodes: boolean = false;

  @Input() selectParentNodes: boolean = true; // This is to avoid selecting root nodes on selecting child nodes. Used in extension creating page

  @Input() selectedUnitId: any;

  treeControl = new NestedTreeControl<AssertTreeNode>((node) => node.children);

  dataSource = new MatTreeNestedDataSource<AssertTreeNode>();

  rootID: number = 0;

  constructor() { }

  ngOnInit(): void {

    //console.log('selectedUnitId @ treeview', this.selectedUnitId)

    this.dataSource.data = this.treeDataSource;

    Object.keys(this.dataSource.data).forEach((x: any) => {
      this.setParent(this.dataSource.data[x], null);
    });
  }

  hasChild = (_: number, node: AssertTreeNode) =>
    !!node.children && node.children.length > 0;

  setParent(data: any, parent: any) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach((x: any) => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node: any) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);

      node.parent.selected = descendants.every((child) => child.selected);

      node.parent.indeterminate = descendants.some((child) => child.selected);

      this.checkAllParents(node.parent);
    }
  }

  todoItemSelectionToggle(checked: any, node: any, rootID: number) {
    node.selected = checked;

    if (node.children) {
      node.children.forEach((x: any) => {
        this.todoItemSelectionToggle(checked, x, 1);
      });
    }

    //This will avoid selecting all of the parent nodes in recurssion
    if (this.selectParentNodes) {
      this.checkAllParents(node);
    }

    this.findSelectedOptions(rootID);
  }

  //This function retur an array of selected node ids (Emmits the selected items)
  findSelectedOptions(rootID: number) {
    if (rootID == this.rootID) {
      //Emit the array root id =0. ie all the sub trees are selected and selection process is finalized
      let tempResult: any = [];

      let finalResult: any = [];

      this.dataSource.data.forEach((node) => {
        tempResult = tempResult.concat(
          this.treeControl
            .getDescendants(node)
            .filter((x) => x.selected && x.id && x.isUnit)
          //.map(x => x.id , x.name)
        );
      });

      if (
        tempResult != undefined &&
        tempResult != null &&
        tempResult.length > 0
      ) {
        tempResult.forEach(function (element: any) {
          const obj = {

            id: element.id,

            unitDisplayName: element.displayName,

            unitName: element.name,

          };

          finalResult.push(obj);
        });
      }

      console.log(finalResult);

      this.onAssertTreeItemSelected.emit(finalResult); //Returns selected usnit id with the unit name
    }
  }

  //Radio Button Toggle
  singleItemSelectionToggle(item: any, node: any) {
    node.selected = node.id;
    this.onAssertTreeItemSelected.emit(node)
  }
}

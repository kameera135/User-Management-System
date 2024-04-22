import { Injectable } from '@angular/core';
import { MenuService } from '../menu.service';
import { AssertTreeNode } from 'src/app/shared/models/assertTreeModel';
import { MenuItem } from 'src/app/layouts/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenutreeService {

  constructor(private menuService: MenuService) { }

  getAssertTreeFromMenu(): AssertTreeNode[] {
    const menuItems: MenuItem[] = this.menuService.getMenu();
    const treeNodes: AssertTreeNode[] = [];

    menuItems.forEach(menuItem => {
      const treeNode: AssertTreeNode = {
        id: menuItem.id,
        name: menuItem.label,
        children: this.createChildrenFromSubItems(menuItem.subItems)
      };
      treeNodes.push(treeNode);
    });

    return treeNodes;
  }

  private createChildrenFromSubItems(subItems: MenuItem[]): AssertTreeNode[] {
    const children: AssertTreeNode[] = [];

    subItems.forEach(subItem => {
      const childNode: AssertTreeNode = {
        id: subItem.id,
        name: subItem.label,
        children: [] // If subItems have further children, process them similarly
      };
      children.push(childNode);
    });

    return children;
  }
}

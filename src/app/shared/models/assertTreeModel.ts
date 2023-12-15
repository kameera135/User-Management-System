export interface AssertTreeNode {

  name: string;

  id?: number;

  selected?: boolean;

  indeterminate?: boolean;

  children?: AssertTreeNode[];

  icon?:string;

  isUnit?: boolean;
 
}


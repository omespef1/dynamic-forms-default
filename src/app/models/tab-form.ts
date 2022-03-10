export class TabForm {
  itemType: string;
  tabs: TabItem[];
//   colSpan:number;
  colCount:number;
}

export class TabItem {
  title: string;
  id:number;
  icon:string;
  alignItemLabels: boolean;
  items: any[];
 
  colCount:number;
}

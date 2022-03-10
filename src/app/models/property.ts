export class Property {
  dataField: string;
  dataType: string;
  itemType: string;
  colSpan: number;
  label: {
    text: any;
  };
  validationRules: any[];
  editorOptions: {
    readOnly: boolean;
    type?: string;
    width?: any;
    displayFormat?: any;
    maxLength?: number;
    hint?: string;
    inputAttr?: any;
    dataSource?: any;
    valueExpr?: string;
    displayExpr?: string;
    layout?: string;
    height?: any;
    mode?: string;
    mask?: string;
    onFocusIn?: any;
    onFocusOut?: any;
    onEnterKey?: any;
    onKeyDown?: any;
    onValueChanged?: any;
    format?: string;
    min?: any;
    max?: any;
    minDate?: Date;
    maxDate?: Date;
    minDateToday?: boolean;
    maxDateToday?: boolean;
    minNumber?: number;
    maxNumber?: number;
    value?: any;
    defaultValueFunc?: any;
    defaultValueModes?: any;
    showClearButton?: boolean;
    placeholder?: string;
    noDataText?: string;
    buttons: any[];
    pattern?: string;
    patternMessage?: string;
  };
  cssClass: string;
  editorType: string;
  visible: boolean;
  widthInGrid: number;
  visibleInGrid: boolean;
  patternId: number;
  pattern: string;
  sequenceId: number;
  isForeignKey: boolean;
  tableNameForeignKey: string;
  tableNameAliasForeignKey: string;
  whereForeignKey: string;
  whereForeignKeyOnlyRecord: string;
  joinsForeignKey: string;
  orderBy: string;
  visibleColumnsForeignKey: string;
  displayMemberForeignKey: string;
  valueMemberForeignKey: string;
  valueMemberParentKey: string;
  nameForeignKey: string;
  isFileUpload: boolean;
  library: any;
  libraryId: any;
  configuredOnFocusIn: string;
  configuredOnFocusOut: string;
  configuredOnEnterKey: string;
  configuredOnValueChanged: string;
  tab: number;
  isTotalField: string;
  propsConfigSearch: string;
  subQuery: string;

  constructor() {
    this.itemType = 'simple';
    this.colSpan = 1;
    this.validationRules = [];
    this.label = {
      text: ''
    };
    this.editorOptions = {
      readOnly: false,
      width: '',
      displayFormat: '',
      layout: 'horizontal',
      dataSource: [],
      showClearButton: false,
      buttons: []
    };
    this.visibleInGrid = true;
    this.widthInGrid = 200;
    this.isFileUpload = false;
    this.tab=0;
    this.isTotalField='N';
  }
}

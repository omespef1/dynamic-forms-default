import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DxListComponent } from 'devextreme-angular';
import { SharedService } from '../../services/shared.service';
import { MainFormService } from '../../services/main-form.service';
import { PropertyGrid, Connection, ActionResult, ColumnGrid, Property } from '../../models';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SessionService } from 'src/app/services';

@Component({
  selector: 'app-grid-properties',
  templateUrl: './grid-properties.component.html',
  styleUrls: ['./grid-properties.component.scss']
})
export class GridPropertiesComponent implements OnInit {
  formId = uuid();
  gridId = uuid();
  popUpId = uuid();
  //#region Fields
  @ViewChild('listUpgroup') listUngroup: DxListComponent;
  @ViewChild('listGroup') listGroup: DxListComponent;
  @ViewChild(DxListComponent) list: DxListComponent;
  @Output() columns = new EventEmitter<any>();
  @Input() tableName: string;
  @Input() connection: Connection;
  @Input() editMode = false;
  @Input() set metadataGridForEdit(data) {
    if (this.editMode && data) {
      this.listItemsGrid = [];
      this.listItemsGrid = [...data.columns];
      this.queryList = data.query;
      this.queryCount = data.queryCount;
    }
  }
  refreshItems = true;
  propertyGrid = new PropertyGrid();
  listItems: any[] = [{ value: 1, text: 'Campos' }, { value: 2, text: 'Propiedades' }];
  listOptions: any[] = [{ value: true, text: 'Si' }, { value: false, text: 'No' }];
  listOptionsAligment: any[] = [{ value: 'undefined', text: 'Por Defecto' }, { value: 'left', text: 'Izquierda' }, { value: 'center', text: 'Centro' }, { value: 'right', text: 'Derecha' }];
  listFormats: any[] = [{ value: 'shortDate', text: 'Fecha' }, { value: 'shortTime', text: 'Hora' }, { value: 'shortDateShortTime', text: 'Fecha - Hora' }, { value: 'currency', text: 'Moneda' }, { value: 'percent', text: 'Porcentaje' }];
  listColumns: ColumnGrid[] = [];
  listForeingKeys: any[] = [];
  selectedIndex = 0;
  itemsToolbar = [{ location: 'after', widget: 'dxButton', options: { hint: 'Aplicar', icon: 'fas fa-check', onClick: () => { this.applyChange(); } } }];
  listItemsGrid: PropertyGrid[] = [];
  listItemsForm: Property[];
  showLoadPanel = false;
  loadControls = false;
  dataSource: any[] = [];
  totalItemsDataSource = '0 items';
  totalColumnsGroup = '0 Columnas';
  indexItemWork = null;
  queryList: string;
  queryCount: string;
  showPopup = false;
  showPopupGroupColumns = false;
  listColumnsGroup: ColumnGrid[] = [];
  listColumnsUngroup: ColumnGrid[] = [];
  columnGroupSelected: ColumnGrid;
  columnUngroupSelected: ColumnGrid;
  allowItemReordering = true;
  toolbarPopupsCofig = {
    toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
  };
  toolbarItemsDataSource = [
    {
      ...this.toolbarPopupsCofig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.applyDatasource();
        }
      }
    }
  ];
  toolbarItemsColumnsGroup = [
    {
      ...this.toolbarPopupsCofig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.applyGroup();
        }
      }
    }
  ];
  //#endregion

  //#region Builder
  constructor(
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private sessionService: SessionService,
    private stylingService: StylingService
  ) {
    this.propertyGrid = new PropertyGrid();
  }

  //#endregion

  //#region Events
  ngOnInit() {
    this.mainFormService.listAllColumnsSelectedTable(this.connection.Id, this.tableName).subscribe((response: ActionResult) => {
      this.listColumns = response.Result.Columns;
      this.listColumns = this.listColumns.map((item, index) => {
        return {
          ...item,
          Id: index
        };
      });
      this.listForeingKeys = response.Result.ForeignKeys;
      if (!this.editMode) {
        this.listColumnsUngroup = response.Result.Columns.filter((x) => x.IsKey === false);
        this.setDefatultValuesItems();
        this.generateQuery();
        this.columns.emit({ query: this.queryList, queryCount: this.queryCount, columns: this.listItemsGrid });
      } else {
        this.checkIfMetadataChanged();
        const listColumnsTmp = [];
        for (const item of this.listItemsGrid) {
          if (this.listColumns.filter((x) => x.Name === item.name).length > 0) {
            const column = this.listColumns.filter((x) => x.Name === item.name)[0];
            listColumnsTmp.push({ ...column });
            if (!column.IsKey) {
              this.listColumnsUngroup.push({ ...column });
            }
          } else {
            const groupColumn = new ColumnGrid();
            groupColumn.DataField = item.dataField;
            groupColumn.Name = item.name;
            groupColumn.IsKey = item.visible;
            listColumnsTmp.push(groupColumn);
          }
        }
        this.listColumns = listColumnsTmp;
      }
    });
    this.sharedService.getListItemsForm.subscribe(list => {
      this.listItemsForm = list;
    });
  }

  onItemReordered(e) {
    this.listColumns.splice(e.fromIndex, 1);
    this.listColumns.splice(e.toIndex, 0, { ...e.itemData });
    const itemTmp = { ... this.listItemsGrid[e.fromIndex] };
    this.listItemsGrid.splice(e.fromIndex, 1);
    this.listItemsGrid.splice(e.toIndex, 0, itemTmp);
    this.list.instance.repaint();
    this.generateQuery();
    this.loadItem(e.toIndex);
    this.columns.emit({ query: this.queryList, queryCount: this.queryCount, columns: this.listItemsGrid });

  }

  onItemClick(e) {
    const index = this.listItemsGrid.indexOf(this.listItemsGrid.filter((x) => x.name === e.itemData.Name)[0]);
    this.loadItem(index);
  }

  onShowPopupDataSource() {
    if (this.indexItemWork === null) {
      return;
    }
    this.showPopup = true;
  }

  onShowPopupGroupColumns() {
    if (this.indexItemWork === null) {
      return;
    }
    this.showPopupGroupColumns = true;
  }

  onClickGroupAll() {
    if (this.listColumnsUngroup.length === 0) {
      return;
    }
    for (const item of this.listColumnsUngroup) {
      this.listColumnsGroup.push({ ...item });
    }
    this.listColumnsUngroup = [];
    this.listGroup.instance.repaint();
    this.listUngroup.instance.repaint();
  }

  onClickGroup() {
    if (!this.columnGroupSelected) {
      return;
    }
    this.listColumnsGroup.push({ ...this.columnGroupSelected });
    this.listColumnsUngroup.splice(this.listColumnsUngroup.indexOf(this.columnGroupSelected), 1);
    this.columnGroupSelected = null;
    this.listGroup.instance.repaint();
    this.listUngroup.instance.repaint();
  }

  onClickUngroupAll() {
    if (this.listColumnsGroup.length === 0) {
      return;
    }
    for (const item of this.listColumnsGroup) {
      this.listColumnsUngroup.push({ ...item });
    }
    this.listColumnsGroup = [];
    this.listGroup.instance.repaint();
    this.listUngroup.instance.repaint();
  }

  onClickUngroup() {
    if (!this.columnUngroupSelected) {
      return;
    }
    this.listColumnsUngroup.push({ ...this.columnUngroupSelected });
    this.listColumnsGroup.splice(this.listColumnsGroup.indexOf(this.columnUngroupSelected), 1);
    this.columnUngroupSelected = null;
    this.listGroup.instance.repaint();
    this.listUngroup.instance.repaint();
  }

  onItemClickUngroup(e) {
    this.columnUngroupSelected = e.itemData;
  }

  onItemClickGroup(e) {
    this.columnGroupSelected = e.itemData;
  }

  onContentReadyPropertiesGrid(e) {
    // setTimeout(() => {
    if (e.component.option('searchValue').length > 0) {
      this.allowItemReordering = false;
    } else {
      this.allowItemReordering = true;
    }
    // }, 800);
  }

  onValueChangedFormat(e) {
    if (!this.propertyGrid.editorOptions) {
      this.propertyGrid.editorOptions = {
        type: '',
        format: ''
      };
    }
    if (e.value) {      
      switch (e.value) {
        case 'shortDate':
          this.propertyGrid.dataType = 'date';
          this.propertyGrid.editorOptions.type = 'date';
          break;
        case 'shortTime':
          this.propertyGrid.dataType = 'date';
          this.propertyGrid.editorOptions.type = 'time';
          break;
        case 'shortDateShortTime':
          this.propertyGrid.dataType = 'date';
          this.propertyGrid.editorOptions.type = 'datetime';
          break;
        case 'currency':
          this.propertyGrid.dataType = 'number';
          break;          
        case 'percent':
          this.propertyGrid.dataType = 'number';
          this.propertyGrid.editorOptions.format = 'percent';
          this.propertyGrid.editorOptions.type = '';
          break;
        default:
          break;
      }
    } else {
      this.propertyGrid.dataType = '';
      this.propertyGrid.editorOptions.type = '';
    }
  }
  //#endregion

  //#region Methods
  checkIfMetadataChanged() {
    for (const item of this.listColumns) {
      const column = this.listItemsGrid.find((x) => x.name === item.Name);
      if (!column) {
        const propertyGridTmp = new PropertyGrid();
        propertyGridTmp.dataField = item.DataField;
        propertyGridTmp.caption = item.DataField;
        propertyGridTmp.name = item.Name;
        propertyGridTmp.iskey = item.IsKey;
        if (item.ParentId !== 0) {
          propertyGridTmp.visible = false;
        }
        this.listItemsGrid.push({ ...propertyGridTmp });
      }
    }
    const listColumnsTmp: PropertyGrid[] = [];
    for (const item of this.listItemsGrid) {
      const field = this.listColumns.find((x) => x.Name === item.name);
      if (field) {

        listColumnsTmp.push(item);
      }
    }
    this.listItemsGrid = [...listColumnsTmp];
    this.generateQuery();
    this.columns.emit({ query: this.queryList, queryCount: this.queryCount, columns: this.listItemsGrid });


  }

  applyChange() {
    this.propertyGrid.dataField = this.propertyGrid.dataField.replace(/\./g, '');
    this.listItemsGrid.splice(this.indexItemWork, 1);
    this.listItemsGrid.splice(this.indexItemWork, 0, { ...this.propertyGrid });
    this.generateQuery();
    this.listItemsGrid.forEach((x) => x.caption = x.dataField);
    this.columns.emit({ query: this.queryList, queryCount: this.queryCount, columns: this.listItemsGrid });
  }

  loadItem(index: number) {
    this.showLoadPanel = true;
    this.refreshItems = false;
    this.loadControls = true;
    this.dataSource = [];
    this.totalItemsDataSource = '0 items';
    this.totalColumnsGroup = '0 Columnas';
    this.indexItemWork = index;
    this.propertyGrid = { ... this.listItemsGrid[index] };
    if (this.propertyGrid.lookup.dataSource) {
      this.dataSource = [...this.propertyGrid.lookup.dataSource];
      this.totalItemsDataSource = `${this.dataSource.length} items`;
    }
    if (!this.propertyGrid.allowEditing) {
      this.propertyGrid.allowEditing = false;
    }
    this.totalColumnsGroup = `${this.propertyGrid.columnGridGroup.length} Columnas`;
    this.selectedIndex = 1;
    setTimeout(() => {
      this.refreshItems = true;
      this.loadControls = false;
    }, 100);
    setTimeout(() => {
      this.showLoadPanel = false;
    }, 1000);
  }

  setDefatultValuesItems() {
    for (const item of this.listColumns) {
      const propertyGridTmp = new PropertyGrid();
      propertyGridTmp.dataField = item.DataField;
      propertyGridTmp.caption = item.DataField;
      propertyGridTmp.name = item.Name;
      propertyGridTmp.iskey = item.IsKey;
      if (item.ParentId !== 0) {
        propertyGridTmp.visible = false;
      }
      this.listItemsGrid.push({ ...propertyGridTmp });
    }
  }

  generateQuery() {
    const listFields: any[] = [];
    const listJoins: any[] = [];
    for (const item of this.listItemsGrid.filter((x) => x.visible === true || x.iskey === true)) {
      const nameTmp = item.name.split('.');

      if (this.connection.ProviderType === 1) {
        // sql server
        listFields.push(`"${nameTmp[0]}"."${nameTmp[1]}" AS "${item.dataField}"`);
      } else {
        // se toman solo 30 caracteres porque solo eso permite oracle
        if (this.tableName === nameTmp[0]) {
          item.dataField = nameTmp[1].length > 30 ? nameTmp[1].substring(0, 30) : nameTmp[1];
        } else {
          item.dataField = item.dataField.length > 30 ? item.dataField.substring(0, 30) : item.dataField;
        }
        listFields.push(`${nameTmp[0]}.${nameTmp[1]} AS ${item.dataField}`);
      }
    }
    for (const item of this.listForeingKeys) {
      const listOn: any[] = [];
      const listColumnsName = item.ColumnName.split(';');
      const listRefrencedColumnName = item.RefrencedColumnName.split(';');
      for (let i = 0; i < listColumnsName.length; i++) {
        const column = listColumnsName[i];
        listOn.push(`${item.ParentTable}.${column}=${item.RefrencedTableAlias}.${listRefrencedColumnName[i]}`);
      }
      listJoins.push(`${item.RefrencedTable} ${item.RefrencedTableAlias} ON (${listOn.join(' AND ')})`);
    }
    if (listJoins.length > 0) {
      this.queryList = `SELECT ${listFields.join(',')} FROM ${this.tableName} ${this.tableName} LEFT JOIN ${listJoins.join(' LEFT JOIN ')}`;
      this.queryCount = `SELECT COUNT(1) AS Count FROM "${this.tableName}" "${this.tableName}" LEFT JOIN ${listJoins.join(' LEFT JOIN ')}`;
    } else {
      this.queryList = `SELECT ${listFields.join(',')} FROM ${this.tableName} ${this.tableName}`;
      this.queryCount = `SELECT COUNT(1) AS Count FROM ${this.tableName} ${this.tableName}`;
    }
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.2);
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.8);
  }

  applyGroup() {
    if (this.listColumnsGroup.length < 2) {
      this.sharedService.info('Debe seleccionar mínimo dos columnas');
      return;
    }
    for (const item of this.listColumnsGroup) {
      const itemGrid = this.listItemsGrid.filter((x) => x.name === item.Name)[0];
      this.listItemsGrid.splice(this.listItemsGrid.indexOf(itemGrid), 1);
      const column = this.listColumns.filter((x) => x.Name === item.Name)[0];
      this.listColumns.splice(this.listColumns.indexOf(column), 1);
      const columUngroup = this.listColumnsUngroup.filter((x) => x.Name === column.Name)[0];
      this.listColumnsUngroup.splice(this.listColumnsUngroup.indexOf(columUngroup), 1);
    }
    const newColumn = new ColumnGrid();
    newColumn.DataField = this.listColumnsGroup.map((x) => x.DataField).join('_');
    newColumn.Name = `${this.listColumnsGroup.map((x) => x.Name).join(`+' - '+`)}`;
    newColumn.Id = this.listColumns.length + 1;
    newColumn.IsKey = false;
    this.listColumns.push(newColumn);

    const propertyGridTmp = new PropertyGrid();
    propertyGridTmp.dataField = newColumn.DataField;
    propertyGridTmp.caption = newColumn.DataField;
    propertyGridTmp.name = newColumn.Name;
    propertyGridTmp.iskey = newColumn.IsKey;
    propertyGridTmp.visible = true;

    this.propertyGrid = { ...propertyGridTmp };
    this.propertyGrid.columnGridGroup = [...this.listColumnsGroup];
    this.totalColumnsGroup = `${this.listColumnsGroup.length} Columnas`;
    this.listColumnsGroup = [];

    this.columnGroupSelected = null;
    this.columnUngroupSelected = null;

    this.list.instance.repaint();


    this.indexItemWork = this.listColumns.length - 1;
    this.applyChange();
    this.showPopupGroupColumns = false;

    setTimeout(() => {
      this.list.instance.selectItem(this.indexItemWork);
    }, 500);

  }

  unGroupColumns() {
    for (const item of this.propertyGrid.columnGridGroup) {
      const newColumn = new ColumnGrid();
      newColumn.DataField = item.DataField;
      newColumn.Name = item.Name;
      newColumn.Id = this.listColumns.length + 1;
      newColumn.IsKey = false;
      this.listColumns.push({ ...newColumn });
      this.listColumnsUngroup.push({ ...newColumn });

      const propertyGridTmp = new PropertyGrid();
      propertyGridTmp.dataField = newColumn.DataField;
      propertyGridTmp.caption = newColumn.DataField;
      propertyGridTmp.name = newColumn.Name;
      propertyGridTmp.iskey = newColumn.IsKey;
      propertyGridTmp.visible = true;
      this.listItemsGrid.push({ ...propertyGridTmp });
    }
    this.list.instance.repaint();
    this.listColumns.splice(this.indexItemWork, 1);
    this.listItemsGrid.splice(this.indexItemWork, 1);
    this.generateQuery();
    this.listItemsGrid.forEach((x) => x.caption = x.dataField);
    this.indexItemWork = this.listColumns.length - 1;

    setTimeout(() => {
      this.list.instance.selectItem(this.indexItemWork);
    }, 500);
    this.totalColumnsGroup = `0 Columnas`;

    this.propertyGrid = { ...this.listItemsGrid[this.listItemsGrid.length - 1] };
    this.columns.emit({ query: this.queryList, queryCount: this.queryCount, columns: this.listItemsGrid });
  }

  applyDatasource() {
    this.propertyGrid.lookup.dataSource = [...this.dataSource];
    this.propertyGrid.lookup.displayExpr = 'text';
    this.propertyGrid.lookup.valueExpr = 'id';
    this.applyChange();
    this.showPopup = false;
    this.totalItemsDataSource = `${this.dataSource.length} items`;
  }

  setAllowEditing = () => {
    if (this.propertyGrid.name.split('.')[0] !== this.tableName) {
      return true;
    }
    // si es la llave principal
    if (this.propertyGrid.iskey) {
      return true;
    }

    const itemForm = this.listItemsForm.find(x => x.dataField.replace(/^FK/, '') === this.propertyGrid.name.split('.')[1]);
    if (itemForm.isForeignKey || itemForm.isFileUpload) {
      return true;
    }
    return false;
  }

  heightForm = () => {
    if (window.innerHeight < 800) {
      return window.innerHeight + 360;
    }
    return window.innerHeight + 170;
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const formEl = document.getElementById(this.formId);
      const popUpEl = document.getElementById(this.popUpId);
      const gridEl = document.getElementById(this.gridId);
      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpEl) {
        this.stylingService.setTitleColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
      }
    }, 1);
  }
  //#endregion

}

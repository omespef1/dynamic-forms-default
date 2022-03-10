import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Column, Property, KeyData, DataSource, ActionResult, EventProperty, Table } from '../../models';
import { DxFormComponent, DxValidatorComponent, DxListComponent, DxAccordionComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { DataSourceType } from '../../enums/data-source-type.enum';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { CommonFunctions } from 'src/app/utils/common-functions';
import { MainFormService } from 'src/app/services/main-form.service';
import { SessionService } from 'src/app/services/session.service';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { ForeignKey } from '../../models/foreign-key';
import { MainFormTab } from '../../models/main-form-tab';


@Component({
  selector: 'app-controls-properties',
  templateUrl: './controls-properties.component.html',
  styleUrls: ['./controls-properties.component.scss']
})
export class ControlsPropertiesComponent implements OnInit {
  //#region Fields
  formId = uuid();
  formEventsId = uuid();
  formDataSourceQueryId = uuid();
  formDataSourceServiceId = uuid();
  formApplicationModeId = uuid();
  formDefaultValueId = uuid();
  gridDataSourceId = uuid();
  gridDataSourceFixedId = uuid();
  gridDataSourceQueryId = uuid();
  gridDataSourceServiceId = uuid();
  gridDataSourceServiceColumnsId = uuid();
  gridFunctionsId = uuid();
  gridSearchColumnsId = uuid();
  gridVisibleColumnsId = uuid();
  gridJoinsId = uuid();
  gridConditionsId = uuid();
  gridconditionOnlyRecordId = uuid();
  gridOrderId = uuid();
  gridPropsId = uuid();
  popUpDataSourceId = uuid();
  popUpDefaultValueId = uuid();
  popUpSearchId = uuid();
  popUpUpdateDataId = uuid();
  popUpFontId = uuid();
  formsubQueryId = uuid();
  @ViewChild(DxListComponent) list: DxListComponent;
  @ViewChild('patterns') listPatterns: DxListComponent;
  @ViewChild(DxFormComponent) form: DxFormComponent;
  @ViewChild('formGeneralProperties') formGeneralProperties: DxFormComponent;
  @ViewChild(DxValidatorComponent) validator: DxValidatorComponent;
  @ViewChild(DxAccordionComponent) accordion: DxAccordionComponent;
  @ViewChild('gridVisibleColumns') gridVisibleColumns: DxDataGridComponent;
  @ViewChild('tabsDatasource') tabsDatasource: NgbTabset;
  @ViewChild('tabSettings') tabSettings: NgbTabset;
  @ViewChild('formQuery') formQuery: DxFormComponent;
  @ViewChild('formService') formService: DxFormComponent;
  @ViewChild('dxListFontFamily') dxListFontFamily: DxListComponent;
  @ViewChild('dxListFontStyle') dxListFontStyle: DxListComponent;
  @ViewChild('dxListFontSize') dxListFontSize: DxListComponent;
  @ViewChild('dxListFontEffect') dxListFontEffect: DxListComponent;
  @ViewChild('defaultValuesPopup') defaultValuesPopup: DxPopupComponent;
  @ViewChild('formsubQuery') formsubQuery: DxFormComponent;
  @Input() tableName: string;
  @Input() connectionId: number;
  @Input() editMode = false;
  @Input() mainFormTabs: MainFormTab[];
  listTabOptions: any[] = [];
  listColumns: Column[] = [];
  @Input() set listItemsFormEdit(items: Property[]) {
    if (this.editMode && items) {
      this.listItemsForm = [];
      this.listItemsForm = [...items];
      for (const item of this.listItemsForm) {
        item.editorOptions.onFocusIn = e => {
          this.loadItemWithClickInForm(e);
        };
      }
    }
  }

  @Input() set listPrimaryKeysFormEdit(items: KeyData[]) {
    if (this.editMode && items) {
      this.listPrimaryKeys = [];
      this.listPrimaryKeys = [...items];
    }
  }
  @Input() set listItemsDataSourceFormEdit(items: DataSource[]) {
    if (this.editMode && items) {
      this.listItemsDataSource = [];
      this.listItemsDataSource = [...items];
    }
  }
  @Input() listEventData: EventProperty[] = [];
  @Output() items = new EventEmitter<any>();
  primaryKey = false;
  foreignKey = false;
  foreignKeyDataField: string = null;
  readonly = false;
  indexItemWork = null;
  listPrimaryKeys: KeyData[] = [];
  listItemsForm: Property[] = [];
  selectedIndex = -1;
  loadControls = false;
  previewControl: any;
  property: Property;
  sourceTabs: MainFormTab[] = [];
  keyData: KeyData = new KeyData();
  showPopup = false;
  showPopupFunctions = false;
  showPopupConfigSearch = false;
  dataType: any;
  isBit = false;
  isNumeric = false;
  numberFormat = '';
  requerid = false;
  refreshItems = true;
  showLoadPanel = false;
  defaultValue: any = {};
  subQueryFormdata: any = {};
  defaultValueEditorOptions: any;
  titleSearch: string;
  listBooleanValue: any[] = [
    { value: true, text: 'Verdadero' },
    { value: false, text: 'Falso' }
  ];
  listItems: any[] = [
    { value: 1, text: 'Campos' },
    { value: 2, text: 'Propiedades' }
  ];
  listOptions: any[] = [
    { value: true, text: 'Si' },
    { value: false, text: 'No' }
  ];
  listColSpan: any[] = [
    { value: 1, text: '1' },
    { value: 2, text: '2' },
    { value: 3, text: '3' },
    { value: 4, text: '4' }
  ];
  listBooleanTypes: any = [
    { value: 'dxSelectBox', text: 'Lista Desplegable' },
    { value: 'dxRadioGroup', text: 'Grupo de Opciones' }
  ];
  listStringTypes: any = [
    { value: 'dxTextBox', text: 'Caja de Texto' },
    { value: 'dxTextArea', text: 'Area de Texto' },
    { value: 'dxCheckBox', text: 'CheckBox' }
  ];
  listStringModes: any = [
    { value: 'email', text: 'Correo Electronico' },
    { value: 'password', text: 'Contraseña' },
    { value: 'tel', text: 'Teléfono' }
  ];
  listNumericModes: any = [
    { value: 'money', text: 'Moneda' },
    { value: 'percentage', text: 'Porcentaje' }
  ];
  listDefaultFunctions: any = [];
  listOptionsTotalField: any[] = [{ value: 'S', text: 'Si' }, { value: 'N', text: 'No' }];
  itemsToolbar = [
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        hint: 'Aplicar',
        icon: 'fas fa-check',
        onClick: () => {
          this.applyChange();
        }
      }
    }
  ];

  toolbarPopupsConfig = {
    toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
  };

  toolbarItemsFontPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setInputAttr();
          this.showPopupSetFontStyle = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Cancelar',
        elementAttr: { class: 'secundary-button-color' },
        onClick: () => {
          this.showPopupSetFontStyle = false;
          this.inputAttr = {};
          this.setInputAttrChangeItem();
        }
      }
    }
  ];

  toolbarItemsConfigSearchPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setVisiblesSearchColumns();
          this.setDisplayColumnsSearch();
          this.setSearchConditions();
          this.setSearchConditionsOnlyRecord();
          this.setJoins();
          this.setOrderBy();
          this.setProps();
          this.setSubQuery();
          this.applyChange();
          this.showPopupConfigSearch = false;
        }
      }
    }
  ];

  toolbarItemsDataSourcePopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.applyDatasource();
        }
      }
    }
  ];
  toolbarItemsDataSourceBooleanPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.applyDatasourceBoolean();
        }
      }
    }
  ];
  toolbarItemsDefaultValuePopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.applyDefaultValue();
        },
      }
    }
  ];



  listModeApplyDefaultValue: any[] = [
    { Id: 1, Name: 'Guardando' },
    { Id: 2, Name: 'Editando' }
  ];
  dafaultModesSelected: any[] = [1];
  dataSource: any[] = [];
  listDataPatterns: any[] = [];
  pattern = { Id: 0, Name: '' };
  listSearchColumns: any[] = [];
  listVisibleColumns: any[] = [];
  listLibraries: any[] = [];
  listItemsDataSource: DataSource[] = [];
  dataSourceType: DataSourceType = DataSourceType.Fixed;
  showPopupDataSource = false;
  dataSourceConfig: DataSource;
  showRemoveDataSource = false;
  disabledTabDataSourceFixed = false;
  disabledTabDataSourceQuery = false;
  disabledTabDataSourceService = false;
  showParams = false;
  showColumns = false;
  refreshItemsService = true;
  listParamsService: any[] = [];
  listColumnsService: any[] = [];
  indexItemDataSource: number;
  listDataSourceFixed: any[] = [];
  listDataSourceConditions: any[] = [];
  listDataSourceConditionsOnlyRecord: any[] = [];
  listDataSourceOrder: any[] = [];
  listDataSourceJoins: any[] = [];
  listDataSourceProps: any[] = [];
  listOperator: any[] = [
    { value: '=', text: 'Igual' },
    { value: '<>', text: 'Diferente' },
    { value: '<', text: 'Menor' },
    { value: '<=', text: 'Menor o Igual' },
    { value: '>', text: 'Mayor' },
    { value: '>=', text: 'Mayor o Igual' },
    { value: 'IN', text: 'Entre' }
  ];
  listOperatorUnion: any[] = [
    { value: 'AND', text: 'Y' },
    { value: 'OR', text: 'O' }
  ];
  listValuesProps: any[] = [
    { value: 'S', text: 'Si' },
    { value: 'N', text: 'No' }
  ];
  allowItemReordering = true;
  showPopupEvents = false;
  eventName: string;
  event: string;
  notificationUpdateInfo: string;
  showPopupUpdateInfo: boolean;
  inputAttr: any;
  showPopupSetFontStyle = false;
  listConnections: any[] = [];
  listTables: Table[] = [];
  listFontFamily = [
    {
      id: `'Courier New', Courier, monospace`,
      name: `Courier New`
    },
    {
      id: `'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif`,
      name: `Franklin Gothic Medium`
    },
    {
      id: `'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`,
      name: `Gill Sans`
    },
    {
      id: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      name: `Segoe UI`
    },
    {
      id: `'Times New Roman', Times, serif`,
      name: `Times New Roman`
    },
    {
      id: `Arial, Helvetica, sans-serif`,
      name: 'Arial'
    },
    {
      id: `Verdana, Geneva, Tahoma, sans-serif`,
      name: 'Verdana'
    }
  ];

  listFontStyle = [
    {
      id: `normal`,
      name: `Normal`
    },
    {
      id: `bold`,
      name: `Negrita`
    },
    {
      id: `italic`,
      name: `Itálica`
    },
    {
      id: `bold italic`,
      name: `Negrita Itálica`
    }
  ];
  listFontSize = [
    {
      id: `10px`,
      name: `10 pixeles`
    },
    {
      id: `12px`,
      name: `12 pixeles`
    },
    {
      id: `14px`,
      name: `14 pixeles`
    },
    {
      id: `16px`,
      name: `16 pixeles`
    },
    {
      id: `18px`,
      name: `18 pixeles`
    }
  ];
  listFontEffect = [
    {
      id: `none`,
      name: `Normal`
    },
    {
      id: `line-through`,
      name: `Tachado`
    },
    {
      id: `underline`,
      name: `Subrayado`
    }
  ];

  listReserveWordsSql = ['ADD', 'ALL', 'AND', 'ANY', 'AS', 'ASC', 'BY', 'BULK', 'CASE', 'DBCC', 'DENY', 'DESC', 'DISK', 'DROP', 'DUMP', 'ELSE', 'END', 'EXEC', 'EXIT', 'ADA', 'ARE', 'AT', 'AVG', 'BIT', 'CAST', 'DATE', 'DAY', 'DEC', 'GET', 'GO'];

  removeColorLabelButton = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.removeBackGroundColorLabel();
    }
  };

  buttonRemoveLabelColor = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.removeBackGroundColorLabel();
    }
  };

  buttonRemoveBackgroundColor = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.removeBackGroundColor();
    }
  };

  buttonSetFont = {
    icon: 'fas fa-ellipsis-h',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    onClick: () => {
      this.setFontStyle();
    }
  };

  buttonRemoveFont = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    onClick: () => {
      this.removeFontStyle();
    }
  };

  buttonsSetFont: any[] = [
    {
      name: 'set',
      location: 'after',
      options: {
        icon: 'fas fa-ellipsis-h',
        type: 'normal',
        stylingMode: 'text',
        disabled: false,
        onClick: () => {
          this.setFontStyle();
        }
      }
    },
    {
      name: 'remove',
      location: 'after',
      options: {
        icon: 'fas fa-times',
        type: 'normal',
        stylingMode: 'text',
        onClick: () => {
          this.removeFontStyle();
        }
      }
    }
  ];

  buttonSetDataSource = {
    icon: 'fas fa-database',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    onClick: () => {
      this.onShowPopupDataSource();
    }
  };

  buttonRemoveDataSource = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    onClick: () => {
      this.removeDataSource();
    }
  };

  buttonSetMinDate = {
    icon: 'far fa-clock',
    type: 'normal',
    stylingMode: 'text',
    hint: 'Establecer Valor Mínimo',
    onClick: () => {
      this.setTodayValue('min');
    }
  };

  buttonSetMaxDate = {
    icon: 'far fa-clock',
    type: 'normal',
    stylingMode: 'text',
    hint: 'Establecer Valor Máximo',
    onClick: () => {
      this.setTodayValue('max');
    }
  };

  buttonSetDataSourceBoolean = {
    icon: 'fas fa-database',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    onClick: () => {
      this.onShowPopupDataSourceBoolean();
    }
  };

  buttonSetValueChanged = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onValueChanged', 'Cambio de Valor');
    }
  };

  buttonRemoveValueChanged = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onValueChanged');
    }
  };

  buttonSetFocusIn = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onFocusIn', 'Recibe el Foco');
    }
  };

  buttonRemoveFocusIn = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onFocusIn');
    }
  };

  buttonSetFocusOut = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onFocusOut', 'Pierde el Foco');
    }
  };

  buttonRemoveFocusOut = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onFocusOut');
    }
  };

  buttonSetEnterKey = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onEnterKey', 'Presionar Enter');
    }
  };

  buttonRemoveEnterKey = {
    icon: 'fas fa-times',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onEnterKey');
    }
  };

  buttonParamsService = {
    icon: 'fas fa-table',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Parametros',
    onClick: () => {
      this.allowShowParams();
    }
  };

  buttonColumnsService = {
    icon: 'fas fa-table',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Columnas',
    onClick: () => {
      this.allowShowColumns();
    }
  };

  //#endregion

  //#region Builder
  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private commonFunctions: CommonFunctions,
    private mainFormService: MainFormService,
    private stylingService: StylingService
  ) {
    this.property = new Property();
    this.inputAttr = {
      background_color: '',
      background_color_label: ''
    };
  }
  //#endregion

  //#region Events
  async ngOnInit() {
    this.loadTabs();
    if (this.listEventData === null) {
      this.listEventData = [];
    }
    await this.getListColumns();
    // this.mainFormService.listAllLibraries(+this.sessionService.session.selectedCompany.code).subscribe((response: ActionResult) => {
    //   this.listLibraries = response.Result;
    // });
    if (!this.editMode) {
      this.setDefatultValuesItems();
    } else {
      this.checkIfMetadataChanged();
    }
    this.setOrderListColumns();
    // consultamos las conexiones
    this.mainFormService.listAllConnection().subscribe((response: ActionResult) => {
      this.listConnections = response.Result;
    });
    this.mainFormService.listTables(this.connectionId).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listTables = response.Result;
      } else {
        this.listTables = [];
      }
      this.sharedService.showLoader(false);
    });



  }

  onDataErrorOccurred(e: any) {
    if (e.error.message.split(' - ')[0] === 'E4008') {
      e.error.message = 'El alias ya existe';
    }
  }

  onCellPreparedJoins(e: any) {
    // se remueven las acciones del primer registro ya que es la tabla principal
    if (e.columnIndex === 4 && e.rowType === 'data') {
      if (e.rowIndex === 0) {
        //const editLink = e.cellElement.querySelector('.dx-link-edit');
        //if (editLink) {
        //editLink.remove();
        //} //permitir editar para poder arreglar informacion incorrecta
        const removeLink = e.cellElement.querySelector('.dx-link-delete');
        if (removeLink) {
          removeLink.remove();
        }
      }
    }
  }

  onInitNewRowJoins(e: any) {
    e.data.id = this.listDataSourceJoins.length + 1;
  }

  onItemReordered(e) {
    this.listColumns.splice(e.fromIndex, 1);
    this.listColumns.splice(e.toIndex, 0, { ...e.itemData });
    const itemTmp = { ...this.listItemsForm[e.fromIndex] };
    this.listItemsForm.splice(e.fromIndex, 1);
    this.listItemsForm.splice(e.toIndex, 0, itemTmp);
    this.list.instance.repaint();
    this.items.emit({
      listItemsForm: this.listItemsForm,
      listPrimaryKeys: this.listPrimaryKeys,
      listItemsDataSource: this.listItemsDataSource
    });
    this.loadItem(e.toIndex, false, false);
    setTimeout(() => {
      if (
        document.getElementsByName(this.listItemsForm[e.toIndex].dataField).length > 0) {
        this.previewControl = document.getElementsByName(this.listItemsForm[e.toIndex].dataField)[0];
        if (this.previewControl) {
          this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
        }
      }
    }, 500);
  }

  onItemClick(e) {
    let index = 0;
    if (e.itemData.ForeignKeys) {
      index = this.listItemsForm.indexOf(this.listItemsForm.filter(x => x.dataField.replace(/^FK/, '') === e.itemData.Name)[0]);
    } else {
      index = this.listItemsForm.indexOf(this.listItemsForm.filter(x => x.dataField === e.itemData.Name)[0]);
    }
    this.loadItem(index, false, false);
    if (this.listColumns[index].ForeignKeys !== null) {
      this.itemIsForeignKey(index);
    } else {
      if (this.listColumns[index].IsKey) {
        this.itemIsKey(index);
      } else {
        this.loadItem(index, false, false);
      }
    }
    if (document.getElementsByName(this.listItemsForm[index].dataField).length > 0) {
      this.previewControl = document.getElementsByName(this.listItemsForm[index].dataField)[0];
      if (this.previewControl) {
        this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
      }
    }
  }

  onShowPopupDataSource() {
    if (this.indexItemWork === null) {
      return;
    }
    if (this.listItemsDataSource.filter(x => x.dataField === this.property.dataField).length > 0) {
      const dataSourceConfigTmp = this.listItemsDataSource.filter(x => x.dataField === this.property.dataField)[0];
      this.indexItemDataSource = this.listItemsDataSource.indexOf(dataSourceConfigTmp);
      this.dataSourceConfig = { ...dataSourceConfigTmp };
      this.listDataSourceFixed = [...this.dataSourceConfig.fixedList];
      switch (this.dataSourceConfig.dataSourceType) {
        case DataSourceType.Query:
          this.disabledTabDataSourceFixed = true;
          this.disabledTabDataSourceQuery = false;
          this.disabledTabDataSourceService = true;
          this.listParamsService = JSON.parse(this.dataSourceConfig.params);
          break;
        case DataSourceType.Service:
          this.disabledTabDataSourceFixed = true;
          this.disabledTabDataSourceQuery = true;
          this.disabledTabDataSourceService = false;
          this.listParamsService = JSON.parse(this.dataSourceConfig.params);
          this.listColumnsService = JSON.parse(this.dataSourceConfig.columns);
          break;
        default:
          this.disabledTabDataSourceFixed = false;
          this.disabledTabDataSourceQuery = true;
          this.disabledTabDataSourceService = true;
          break;
      }
    } else {
      if (this.listItemsDataSource.length > 0) {
        this.indexItemDataSource = this.listItemsDataSource.length;
      } else {
        this.indexItemDataSource = 0;
      }
      this.listDataSourceFixed = [];
      this.dataSourceConfig = new DataSource();
      this.dataSourceConfig.connectionId = this.connectionId;
      this.disabledTabDataSourceFixed = false;
      this.disabledTabDataSourceQuery = false;
      this.disabledTabDataSourceService = false;
      this.listParamsService = [];
      this.listColumnsService = [];
    }
    this.dataSourceType = this.dataSourceConfig.dataSourceType;
    setTimeout(() => {
      switch (this.dataSourceType) {
        case DataSourceType.Query:
          this.tabsDatasource.select('dataSourceQuery');
          break;
        case DataSourceType.Service:
          this.tabsDatasource.select('dataSourceService');
          break;
        default:
          this.tabsDatasource.select('dataSourceFixed');
          break;
      }
    }, 300);
    this.showPopupDataSource = true;
  }

  onShowPopupDataSourceBoolean() {
    if (this.indexItemWork === null) {
      return;
    }
    this.showPopup = true;
  }

  onValueChangedStringType() {
    if (!this.loadControls) {
      this.property.editorOptions.mask = null;
      const emailRule = this.property.validationRules.filter(x => x.type === 'email')[0];
      if (emailRule) {
        this.property.validationRules.splice(this.property.validationRules.indexOf(emailRule), 1);
      }
      this.property.editorOptions.height = null;
      this.property.editorOptions.pattern = null;
      this.property.editorOptions.patternMessage = null;
    }
  }

  onValueChangedMaxLength(e) {
    if (!this.loadControls) {
      if (e.value > this.listColumns[this.indexItemWork].MaxLength || e.value < 1) {
        this.property.editorOptions.maxLength = this.listColumns[this.indexItemWork].MaxLength;
        e.component.option('value', this.property.editorOptions.maxLength);
      }
    }
  }

  onValueChangedStringMode(e) {
    if (!this.loadControls) {
      this.property.editorOptions.mask = null;
      const emailRule = this.property.validationRules.filter(x => x.type === 'email')[0];
      if (emailRule) {
        this.property.validationRules.splice(
          this.property.validationRules.indexOf(emailRule, 1)
        );
      }
      if (e.value === 'email') {
        this.property.validationRules.push({
          message: 'Correo Electrónico Invalido',
          type: 'email'
        });
      }
      if (e.value === 'tel') {
        this.property.editorOptions.mask = '(000) 000-0000';
      }
    }
  }

  onValueChangedNumericMode(e) {
    if (!this.loadControls) {
      const column = this.listColumns[this.indexItemWork];
      let decimals = '.';
      for (let index = 0; index < column.Scale; index++) {
        decimals += '#';
      }
      if (e.value === null) {
        if (decimals.length > 1) {
          this.numberFormat = `##0${decimals}`;
        } else {
          this.numberFormat = '##0';
        }
        this.property.editorOptions.format = this.numberFormat;
      }
      if (e.value === 'money') {
        if (decimals.length > 1) {
          this.numberFormat = `$ #,##0${decimals}`;
        } else {
          this.numberFormat = '$ #,##0';
        }
        this.property.editorOptions.format = this.numberFormat;
      }
      if (e.value === 'percentage') {
        this.numberFormat = `0###.##'%'`; //correccion F79
        this.property.editorOptions.format = this.numberFormat;
      }
    }
  }

  onValueChangedDate(e) {
    if (!this.loadControls) {
      if (e.component.option('name') === 'min') {
        this.property.editorOptions.minDateToday = false;
      } else {
        this.property.editorOptions.maxDateToday = false;
      }
    }
  }

  onValueChangedRequired(e) {
    if (!this.loadControls) {
      if (e.value === true) {
        this.property.validationRules.push({
          message: 'Requerido',
          type: 'required'
        });
      } else {
        const requiredRule = this.property.validationRules.filter(
          x => x.type === 'required'
        )[0];
        if (requiredRule) {
          this.property.validationRules.splice(
            this.property.validationRules.indexOf(requiredRule),
            1
          );
        }
      }
    }
  }

  onShowPopupDefaultValue() {
    this.defaultValueEditorOptions = { ...this.property.editorOptions };
    delete this.defaultValueEditorOptions.onFocusIn;
    this.defaultValueEditorOptions.showClearButton = true;
    this.showPopupFunctions = true;
  }

  onRowClickFunction = e => {
    if (e.data.value === 'getMaxConse' || e.data.value === 'getMaxConseDet') {
      this.defaultValue.value = 1;
      this.property.editorOptions.value = 1;
    }
    else {
      this.defaultValue.value = this.commonFunctions[e.data.value]();
    }
    this.defaultValue.function = e.data.value;
    this.property.editorOptions.defaultValueFunc = e.data.value;
    this.property.patternId = null;
    this.property.pattern = null;
    this.pattern.Id = 0;
    this.pattern.Name = null;
  }

  onShowingPopupFunctions() {
    this.toolbarItemsDefaultValuePopup = [
      {
        ...this.toolbarPopupsConfig,
        options: {
          text: 'Aceptar',
          onClick: () => {
            this.applyDefaultValue();
          },
          elementAttr: { class: 'primary-button-color' },
        }
      }
    ];

    if (this.property.editorType === 'dxCheckBox') {
      if (this.property.editorOptions.value === 'S') {
        this.defaultValue.value === true
      }
      else {
        this.defaultValue.value === false
      }

    }
    else {
      this.defaultValue.value = this.property.editorOptions.value;
    }
    this.defaultValue.function = this.property.editorOptions.defaultValueFunc;

    this.mainFormService.listPatterns().subscribe((response: ActionResult) => {
      this.listDataPatterns = response.Result;
      setTimeout(() => {
        this.dafaultModesSelected = this.property.editorOptions.defaultValueModes ? [...this.property.editorOptions.defaultValueModes] : [1];
        this.pattern.Id = 0;
        this.pattern.Name = null;
        if (this.property.patternId) {
          const pattern = this.listDataPatterns.filter(x => x.PAT_CONT === this.property.patternId)[0];
          this.pattern.Id = pattern.PAT_CONT;
          this.pattern.Name = pattern.PAT_PATR;
          this.listPatterns.instance.selectItem(this.listDataPatterns.indexOf(pattern));
          this.listPatterns.instance.repaint();
        }
      }, 200);
    });
  }

  onValueChangedUniqueIdentifier(e) {
    const column = this.listItemsForm.filter(x => x.dataField === this.listPrimaryKeys[0].Name)[0];
    if (e.value) {
      column.editorOptions.readOnly = true;
      const requeridRule = column.validationRules.filter(x => x.type === 'required')[0];
      if (requeridRule) {
        column.validationRules.splice(column.validationRules.indexOf(requeridRule), 1);
      }
    } else {
      column.editorOptions.readOnly = false;
      column.validationRules.push({
        message: 'Requerido',
        type: 'required'
      });
    }
    this.items.emit({
      listItemsForm: this.listItemsForm,
      listPrimaryKeys: this.listPrimaryKeys,
      listItemsDataSource: this.listItemsDataSource
    });
    setTimeout(() => {
      if (document.getElementsByName(this.listItemsForm[this.indexItemWork].dataField).length > 0) {
        this.previewControl = document.getElementsByName(this.listItemsForm[this.indexItemWork].dataField)[0];
        if (this.previewControl) {
          this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
        }
      }
    }, 500);
  }

  onItemClickPattern(e) {
    this.pattern.Id = e.itemData.PAT_CONT;
    this.pattern.Name = e.itemData.PAT_PATR;
  }

  onValueChangedAllowFileUpload(e) {
    if (this.loadControls) {
      return;
    }
    this.refreshItems = false;
    this.property.editorType = 'dxTextBox';
    if (e.value) {
      this.property.editorOptions.readOnly = true;
      this.property.editorOptions.inputAttr = {
        placeholder: '\uf0c6 Adjuntar Archivo',
        style:
          'font-family: FontAwesome, Helvetica Neue, Segoe UI, Helvetica, Verdana, sans-serif;'
      };
    } else {
      this.property.editorOptions.readOnly = false;
      this.property.editorOptions.inputAttr = null;
      this.property.libraryId = null;
      this.property.library = null;
    }
    setTimeout(() => {
      this.refreshItems = true;
    }, 200);
  }

  onValueChangedLibrary = e => {
    if (this.loadControls) {
      return;
    }
    this.property.library = this.listLibraries.filter(x => x.RMT_BBLI === e.value)[0];
  }

  onTabChangeDataSource(e) {
    switch (e.nextId) {
      case 'dataSourceQuery':
        this.dataSourceType = DataSourceType.Query;
        break;
      case 'dataSourceService':
        this.dataSourceType = DataSourceType.Service;
        break;
      default:
        this.dataSourceType = DataSourceType.Fixed;
        break;
    }
  }

  onContentReadyProperties(e) {
    if (e.component.option('searchValue').length > 0) {
      this.allowItemReordering = false;
    } else {
      this.allowItemReordering = true;
    }
  }

  onValueChangedLabelColor(e) {
    this.property.cssClass = `DG_${e.value}`;
  }

  onItemClickFont(listNumber: number, e: any) {
    switch (listNumber) {
      case 1:
        document.getElementById('fontPreview').style.fontFamily = e.itemData.id;
        this.inputAttr.font_family = e.itemData.id;
        break;
      case 2:
        this.inputAttr.font_weight = 'normal';
        this.inputAttr.font_style = 'normal';
        const fontStyle = e.itemData.id.split(' ');
        if (fontStyle[0] === 'bold') {
          document.getElementById('fontPreview').style.fontWeight = 'bold';
          this.inputAttr.font_weight = 'bold';
        } else {
          document.getElementById('fontPreview').style.fontWeight = 'normal';
          this.inputAttr.font_weight = 'normal';
        }
        if (fontStyle.length > 1) {
          document.getElementById('fontPreview').style.fontStyle = fontStyle[1];
          this.inputAttr.font_style = fontStyle[1];
        } else {
          document.getElementById('fontPreview').style.fontStyle =
            fontStyle[0] === 'bold' ? 'normal' : fontStyle[0];
          this.inputAttr.font_style =
            fontStyle[0] === 'bold' ? 'normal' : fontStyle[0];
        }
        break;
      case 3:
        document.getElementById('fontPreview').style.fontSize = e.itemData.id;
        this.inputAttr.font_size = e.itemData.id;
        break;
      case 4:
        document.getElementById('fontPreview').style.textDecoration =
          e.itemData.id;
        this.inputAttr.text_decoration = e.itemData.id;
        break;
    }
  }

  onToolbarPreparingPamars(e) {
    e.toolbarOptions.items.unshift({
      location: 'center',
      locateInMenu: 'never',
      template: () => {
        return `<div class=\'toolbar-label\'><b>Parametros</b></div>`;
      }
    });
  }

  onToolbarPreparingColumns(e) {
    e.toolbarOptions.items.unshift({
      location: 'center',
      locateInMenu: 'never',
      template: () => {
        return `<div class=\'toolbar-label\'><b>Columnas</b></div>`;
      }
    });
  }

  //#endregion

  //#region Methods
  getSearchConditions() {
    if (this.property.whereForeignKey) {
      this.listDataSourceConditions = JSON.parse(this.property.whereForeignKey);
    } else {
      this.listDataSourceConditions = [];
    }
  }

  getSearchConditionsOnlyRecord() {
    if (this.property.whereForeignKeyOnlyRecord) {
      this.listDataSourceConditionsOnlyRecord = JSON.parse(this.property.whereForeignKeyOnlyRecord);
    } else {
      this.listDataSourceConditionsOnlyRecord = [];
    }
  }

  getJoins() {
    if (this.property.joinsForeignKey) {
      this.listDataSourceJoins = JSON.parse(this.property.joinsForeignKey);
    } else {
      this.listDataSourceJoins = [];
    }
  }

  getOrderBy() {
    if (this.property.orderBy) {
      this.listDataSourceOrder = JSON.parse(this.property.orderBy);
    } else {
      this.listDataSourceOrder = [];
    }
  }

  getProps() {
    if (this.property.propsConfigSearch) {
      this.listDataSourceProps = JSON.parse(this.property.propsConfigSearch);
    } else { //aqui agregar propiedades
      this.listDataSourceProps.splice(0, this.listDataSourceProps.length);
      this.listDataSourceProps.push({ id: 'AutoOpen', field: 'Ejecuta consulta al abrir', value: 'S' });
      this.listDataSourceProps.push({ id: 'Cache', field: 'Guardar resultado consulta', value: 'S' });
    }
  }

  getSubQuery(){
    if (this.property.subQuery){
      this.subQueryFormdata = JSON.parse(this.property.subQuery);
    }
  }


  checkIfMetadataChanged() {
    // se vuelven a establecer las llaves primarias
    this.setValuesPrimaryKeyIfMetadataChange();
    const listFiledsUpdate: string[] = [];
    // se hace la comprobacion de para informar al usuario que cambio
    for (const item of this.listColumns) {
      const field = this.listItemsForm.find(
        x => x.dataField.replace(/^FK/, '') === item.Name
      );
      // si existe se hace la comprobacion de las propiedades
      if (field) {
        if (!field.dataType) {
          field.dataType = item.DataType;
        }
        if (item.IsKey && item.ForeignKeys === null && field.editorType !== 'dxSelectBox') { //solamente es PK
          this.setEditorOptions(item, field);
          //continue;
        }
        if (field.isForeignKey) {
          field.editorOptions.mode = 'search';
          this.setValuesForeignKey(item, field);
        }
        if ((field.dataField === 'EMP_CODI' || field.dataField === 'FKEMP_CODI') && (this.tableName !== 'GN_USUAR' && this.tableName !== 'GN_REMGU')) {
          field.editorOptions.mode = null;
        }
        // si ahora permite null se quita el requerido
        if (item.AllowNull) {
          if (field.validationRules !== undefined) {
            const requeridRule = field.validationRules.filter(x => x.type === 'required')[0];
            if (requeridRule) {
              listFiledsUpdate.push(`Se cambio a no requerido el campo ${field.label.text}`);
              field.validationRules.splice(field.validationRules.indexOf(requeridRule), 1);
            }
          }
        }
        // se pone como requerido
        if (!item.AllowNull && field.editorType !== 'dxCheckBox') {
          if (item.DataType === 'bit') {
            if (field.validationRules !== undefined) {
              const requeridRule = field.validationRules.filter(x => x.type === 'required')[0];
              if (requeridRule) {
                field.validationRules.splice(field.validationRules.indexOf(requeridRule), 1);
              }
            }
            if (!field.editorOptions.value) {
              field.editorOptions.value = false;
            }
          } else {
            if (field.validationRules) {
              if (field.validationRules.filter(x => x.type === 'required').length === 0) {
                listFiledsUpdate.push(`Se cambio a requerido el campo ${field.label.text}`);
                field.validationRules.push({
                  message: 'Requerido',
                  type: 'required'
                });
              }
            }
          }
        }
        // se valida si cambio el tipo de control        
        if (!field.isForeignKey && this.getEditorTypeDataType(item, field) !== field.editorType) {
          listFiledsUpdate.push(`Se cambio el tipo de editor en el campo ${field.label.text}`);
          this.setEditorOptions(item, field);
        }

        // se valida la longitud
        if (!field.isForeignKey && field.editorType === 'dxTextBox') {
          if (field.editorOptions.maxLength > item.MaxLength) {
            listFiledsUpdate.push(`Se cambio el tamaño maximo en el campo ${field.label.text}`);
            field.editorOptions.maxLength = item.MaxLength;
          }
        }
        // si ahora es llave foranea        
        if (item.ForeignKeys !== null && !field.isForeignKey) {
          listFiledsUpdate.push(`Se cambio a llave foranea el campo ${field.label.text}`);
          this.setValuesForeignKey(item, field);
        }
        // si ya no es llave foranea
        if (item.ForeignKeys === null && field.isForeignKey) {
          listFiledsUpdate.push(`Se quito la llave foranea del campo ${field.label.text}`);
          field.visibleColumnsForeignKey = null;
          field.dataField = item.Name;
          field.editorOptions.mode = null;
          field.editorOptions.readOnly = false;
          field.isForeignKey = false;
          field.tableNameForeignKey = null;
          field.valueMemberForeignKey = null;
          field.valueMemberParentKey = null;
          field.nameForeignKey = null;
          this.setEditorOptions(item, field);
        }
        if (field.editorType === 'dxDateBox' || field.editorType === 'dxSelectBox') {
          delete field.editorOptions.buttons;
        }
      } else {
        // se agrega el campo al listado
        listFiledsUpdate.push(`Se agregara el campo ${item.Name}`);
        const propertyTmp = new Property();
        propertyTmp.editorOptions.onFocusIn = e => {
          this.loadItemWithClickInForm(e);
        };
        propertyTmp.dataType = item.DataType;
        propertyTmp.label.text = item.Name;
        propertyTmp.dataField = item.Name;
        propertyTmp.visible = true;
        propertyTmp.editorOptions.readOnly = false;
        if (!item.AllowNull) {
          propertyTmp.validationRules.push({
            message: 'Requerido',
            type: 'required'
          });
        }
        if (item.DataType === 'bit') {
          const requeridRule = propertyTmp.validationRules.filter(x => x.type === 'required')[0];
          if (requeridRule) {
            propertyTmp.validationRules.splice(propertyTmp.validationRules.indexOf(requeridRule), 1);
          }
          if (!propertyTmp.editorOptions.value) {
            propertyTmp.editorOptions.value = false;
          }
        }
        this.setEditorOptions(item, propertyTmp);
        if (item.ForeignKeys !== null) {
          this.setValuesForeignKey(item, propertyTmp);
        }
        this.listItemsForm.push({ ...propertyTmp });
      }
    }
    if (this.listPrimaryKeys.length === 1) {
      if (this.listPrimaryKeys[0].IsIdentity || this.listPrimaryKeys[0].IsGuid) {
        const column = this.listItemsForm.filter(x => x.dataField === this.listPrimaryKeys[0].Name)[0];
        column.editorOptions.readOnly = true;
        const requeridRule = column.validationRules.filter(x => x.type === 'required')[0];
        if (requeridRule) {
          listFiledsUpdate.push(`Se cambio a no requerido el campo ${column.label.text} porque es la llave primaria`
          );
          column.validationRules.splice(column.validationRules.indexOf(requeridRule), 1);
        }
      }
    }

    // se dejan solo los campos que estan en el listado
    const listItemsFormTmp: Property[] = [];
    for (const item of this.listItemsForm) {
      const field = this.listColumns.find(x => x.Name === item.dataField.replace(/^FK/, ''));
      if (field) {
        listItemsFormTmp.push(item);
      } else {
        listFiledsUpdate.push(`Se eliminara el campo ${item.dataField.replace(/^FK/, '')}`);
      }
    }
    this.listItemsForm = [...listItemsFormTmp];

    if (listFiledsUpdate.length > 0) {
      listFiledsUpdate.unshift(`La tabla (${this.tableName}) presenta cambios en la configuración, se realizaron los siguientes cambios \r\n`
      );
      this.notificationUpdateInfo = listFiledsUpdate.join('\r\n');
      this.showPopupUpdateInfo = true;
    }
    this.items.emit({
      listItemsForm: this.listItemsForm,
      listPrimaryKeys: this.listPrimaryKeys,
      listItemsDataSource: this.listItemsDataSource,
      listEventData: this.listEventData
    });
    this.sharedService.setListItemsForm(this.listItemsForm);
  }

  setInputAttrChangeItem() {
    // se establecen las propiedades adicionales del control
    if (!this.property.isFileUpload && this.property.editorOptions.inputAttr) {
      for (const item of Object.keys(this.property.editorOptions.inputAttr)) {
        for (const itemProperty of this.property.editorOptions.inputAttr[
          item
        ].split(';')) {
          const value = itemProperty.split(':');
          this.inputAttr[value[0].replace('-', '_')] = value[1];
        }
      }
    }
  }

  loadItem(index: number, lpkey: boolean, lfkey: boolean) {
    this.showLoadPanel = true;
    this.inputAttr = {};
    this.primaryKey = lpkey;
    this.foreignKey = lfkey;
    if (this.listItemsForm[index].visible && this.previewControl) {
      if (this.previewControl.event) {
        this.previewControl.event.target.parentNode.parentNode.classList.remove('select-item');
      } else {
        this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('select-item');
      }
    }

    this.refreshItems = false;
    this.loadControls = true;
    this.dataSource = [];
    this.indexItemWork = index;
    this.readonly = !this.listColumns[this.indexItemWork].AllowNull;
    this.property = { ...this.listItemsForm[index] };
    this.foreignKeyDataField = this.property.dataField.replace(/^FK/, '');

    this.setInputAttrChangeItem();

    if (this.listItemsDataSource.filter(x => x.dataField === this.property.dataField).length > 0) {
      this.indexItemDataSource = this.listItemsDataSource.indexOf(this.listItemsDataSource.filter(x => x.dataField === this.property.dataField)[0]);
      this.showRemoveDataSource = true;
    } else {
      this.indexItemDataSource = 0;
      this.showRemoveDataSource = false;
    }
    this.initializeDefaultFunctions();
    this.numberFormat = this.property.editorOptions.format;
    if (this.property.validationRules !== undefined) {
      const requiredRule = this.property.validationRules.filter(x => x.type === 'required')[0];
      if (requiredRule) {
        this.requerid = true;
      } else {
        this.requerid = false;
      }
    }
    this.setDataType();

    if (this.property.editorOptions.dataSource) {
      this.dataSource = [...this.property.editorOptions.dataSource];
    }
    this.selectedIndex = 1;
    setTimeout(() => {
      this.refreshItems = true;
      this.loadControls = false;
    }, 100);
    setTimeout(() => {
      this.showLoadPanel = false;
    }, 1000);
  }

  setOrderListColumns() {
    setTimeout(() => {
      const listColumnsTmp = [];
      for (const item of this.listItemsForm) {
        if (this.listColumns.filter(x => x.Name === item.dataField.replace(/^FK/, '')).length > 0) {
          listColumnsTmp.push(this.listColumns.filter(x => x.Name === item.dataField.replace(/^FK/, ''))[0]);
        }
      }
      this.listColumns = listColumnsTmp;
    }, 200);
  }

  async getListColumns() {
    const response: ActionResult = await this.mainFormService.listColumns(this.connectionId, this.tableName).toPromise();
    if (response.IsSucessfull) {
      this.listColumns = response.Result;
    } else if (response.IsError) {
      this.listColumns = [];
      this.sharedService.error(response.ErrorMessage);
    } else {
      this.listColumns = [];
      this.sharedService.error(response.Messages);
    }
    setTimeout(() => {
      this.sharedService.showLoader(false);
    }, 300);
  }

  loadItemWithClickInForm(e) {
    let index = 0;
    const column = this.listColumns.filter(x => x.Name === e.component.option('name').replace(/^FK/, ''))[0];
    if (column.ForeignKeys !== null) {
      this.itemIsForeignKey(this.listColumns.indexOf(column));
    }
    //se quita el else, ya que un campo puede pertenecer a foranea y primaria
    if (column.IsKey) {
      this.itemIsKey(this.listColumns.indexOf(column));
    }
    //if (column.ForeignKeys === null && !column.IsKey) {    
    index = this.listItemsForm.indexOf(this.listItemsForm.filter(x => x.dataField === e.component.option('name'))[0]);
    this.loadItem(index, column.IsKey, column.ForeignKeys !== null);

    // if (this.list) {
    //   this.list.instance.selectItem(this.listColumns.indexOf(column));
    // }
    this.previewControl = e;
    if (this.previewControl) {
      if (this.previewControl.event) {
        this.previewControl.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
      } else {
        this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
      }
    }
    this.tabSettings.select('propertiesTab');
  }

  itemIsKey(index: number) {
    this.keyData = this.listPrimaryKeys.filter(x => x.Name === this.listColumns[index].Name)[0];
    this.primaryKey = true;
    //this.foreignKey = false;
    this.showLoadPanel = true;
    this.inputAttr = {};
    if (this.previewControl) {
      if (this.previewControl.event) {
        this.previewControl.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('select-item');
      } else {
        this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('select-item');
      }
    }
    this.property = { ...this.listItemsForm[index] };
    this.setInputAttrChangeItem();
    this.refreshItems = false;
    this.indexItemWork = index;
    this.requerid = true;
    this.selectedIndex = 1;
    this.initializeDefaultFunctions();
    setTimeout(() => {
      this.refreshItems = true;
      this.loadControls = false;
    }, 100);
    setTimeout(() => {
      this.showLoadPanel = false;
    }, 1000);
  }

  itemIsForeignKey(index: number) {
    this.property = { ...this.listItemsForm[index] };
    this.foreignKey = true;
    this.primaryKey = false;
    this.showLoadPanel = true;
    this.inputAttr = {};
    if (this.previewControl) {
      if (this.previewControl.event) {
        this.previewControl.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('select-item');
      } else {
        this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('select-item');
      }
    }
    this.property = { ...this.listItemsForm[index] };
    this.foreignKeyDataField = this.property.dataField.replace(/^FK/, '');
    this.setInputAttrChangeItem();
    this.refreshItems = false;
    this.indexItemWork = index;
    this.selectedIndex = 1;
    this.initializeDefaultFunctions();
    this.readonly = !this.listColumns[this.indexItemWork].AllowNull;
    const requiredRule = this.property.validationRules.filter(
      x => x.type === 'required'
    )[0];
    if (requiredRule) {
      this.requerid = true;
    } else {
      this.requerid = false;
    }
    setTimeout(() => {
      this.refreshItems = true;
      this.loadControls = false;
    }, 100);
    setTimeout(() => {
      this.showLoadPanel = false;
    }, 1000);
  }

  setValuesPrimaryKey() {
    this.listPrimaryKeys = [];
    for (const item of this.listColumns.filter(x => x.IsKey === true)) {
      const key = new KeyData();
      key.DataType = item.DataType;
      if (item.DataType === 'uniqueidentifier') {
        key.IsGuid = true;
      } else {
        key.IsGuid = false;
      }
      key.IsIdentity = item.IsIdentity;
      key.MaxLength = item.MaxLength;
      key.Name = item.Name;
      this.listPrimaryKeys.push({ ...key });
    }
  }

  setValuesPrimaryKeyIfMetadataChange() {
    const listPrimaryKeysTmp = [...this.listPrimaryKeys];
    this.listPrimaryKeys = [];
    for (const item of this.listColumns.filter(x => x.IsKey === true)) {
      const keyTmp = listPrimaryKeysTmp.find(x => x.Name === item.Name);
      let key = new KeyData();
      if (keyTmp) {
        if (keyTmp.DataType === item.DataType) {
          key = { ...keyTmp };
          if (keyTmp.DataType === 'uniqueidentifier') {
            key.IsGuid = true;
          }
        } else {
          key = { ...item, IsGuid: false };
          if (item.DataType === 'uniqueidentifier') {
            key.IsGuid = true;
          }
        }
      } else {
        key = { ...item, IsGuid: false };
        if (item.DataType === 'uniqueidentifier') {
          key.IsGuid = true;
        }
      }
      this.listPrimaryKeys.push({ ...key });
    }
  }

  setValuesForeignKey(item: Column, propertyTmp: Property) {
    let IsStillForeingKey = false;
    let column: Property;
    let columnApi: ForeignKey;
    if (item.ForeignKeys !== null) {
      for (const foreign of this.listItemsForm) {
        for (const foreignApi of item.ForeignKeys) {
          if (foreignApi.ForeignKeyName === foreign.nameForeignKey && foreignApi.ColumnName === foreign.dataField) {
            IsStillForeingKey = true;
            column = foreign;
            columnApi = foreignApi;
          }
        }
      }
    }
    if (IsStillForeingKey) {
      // const column = this.listItemsForm.filter(
      //   x => x.nameForeignKey === item.ForeignKey.ForeignKeyName
      // )[0];
      column.valueMemberForeignKey += columnApi.RefrencedColumnName;
      column.valueMemberParentKey += columnApi.ColumnName;
      return;
    }
    /*   propertyTmp.visibleColumnsForeignKey = `[{"dataField":"${
          this.listPrimaryKeys[0].Name
          }","caption":"${this.listPrimaryKeys[0].Name}"}]`; Esto ocasiona mostrar info incorrecta*/
    // se agrega FK para diferenciar el dataField y saber que es una llave foranea
    propertyTmp.dataField = `FK${item.Name}`;
    propertyTmp.editorType = 'dxTextBox';
    propertyTmp.editorOptions.mode = 'search';
    //propertyTmp.editorOptions.readOnly = true;
    propertyTmp.isForeignKey = true;
    if (item.ForeignKeys !== undefined && item.ForeignKeys !== null) {
      propertyTmp.tableNameForeignKey = "";
      propertyTmp.valueMemberForeignKey = "";
      propertyTmp.valueMemberParentKey = "";
      propertyTmp.nameForeignKey = "";
      item.ForeignKeys.forEach((foreing) => {
        propertyTmp.tableNameForeignKey = foreing.RefrencedTable;
        propertyTmp.valueMemberForeignKey += foreing.RefrencedColumnName + ';';
        propertyTmp.valueMemberParentKey += foreing.ColumnName + ';';
        propertyTmp.nameForeignKey = foreing.ForeignKeyName;
      })
    }


  }

  getEditorTypeDataType(item: Column, field: Property) {
    //if (field.editorOptions.dataSource && field.editorOptions.dataSource.length > 0 && item.DataType === field.dataType) {
    if (field.editorOptions.dataSource && field.editorOptions.dataSource.length > 0) { //solo validar que tenga datasource
      return field.editorType;
    }
    if (field.editorType === 'dxCheckBox') { // respetar tipo checkbox
      return field.editorType;
    }
    field.dataType = item.DataType;
    switch (item.DataType) {
      case 'datetime':
      case 'datetime2':
      case 'smalldatetime':
      case 'date':
        return 'dxDateBox';
      case 'int':
      case 'decimal':
      case 'smallint':
      case 'numeric':
      case 'tinyint':
      case 'bigint':
      case 'number':
        return 'dxNumberBox';
      default:
        if (item.MaxLength < 0) {
          return 'dxTextArea';
        }
        return 'dxTextBox';
    }
  }

  setEditorOptions(item: Column, propertyTmp: Property) {
    switch (item.DataType) {
      case 'datetime':
      case 'datetime2':
      case 'smalldatetime':
        propertyTmp.editorType = 'dxDateBox';
        propertyTmp.editorOptions.type = 'datetime';
        propertyTmp.editorOptions.width = 'auto';
        propertyTmp.editorOptions.displayFormat = 'yyyy-MM-dd hh:mm a';
        propertyTmp.editorOptions.min = null;
        propertyTmp.editorOptions.max = null;
        break;
      case 'date':
        propertyTmp.editorType = 'dxDateBox';
        propertyTmp.editorOptions.type = 'date';
        propertyTmp.editorOptions.width = 'auto';
        propertyTmp.editorOptions.displayFormat = 'yyyy-MM-dd';
        propertyTmp.editorOptions.min = null;
        propertyTmp.editorOptions.max = null;
        break;
      case 'int':
      case 'decimal':
      case 'smallint':
      case 'numeric':
      case 'tinyint':
      case 'bigint':
      case 'number':
        propertyTmp.editorType = 'dxNumberBox';
        break;
      default:
        propertyTmp.editorType = 'dxTextBox';
        propertyTmp.editorOptions.maxLength = item.MaxLength;
        if (item.MaxLength < 0) {
          propertyTmp.editorType = 'dxTextArea';
        }
        break;
    }
    delete propertyTmp.editorOptions.mode;
    //propertyTmp.editorOptions.readOnly = false; //Respetar propiedad establecida en el diseñador
    propertyTmp.editorOptions.dataSource = null;
    delete propertyTmp.editorOptions.valueExpr;
    delete propertyTmp.editorOptions.displayExpr;
    if (propertyTmp.editorType === 'dxDateBox' || propertyTmp.editorType === 'dxSelectBox') {
      delete propertyTmp.editorOptions.buttons;
    }
  }

  setDefatultValuesItems() {
    setTimeout(() => {
      this.setValuesPrimaryKey();
      for (const item of this.listColumns) {
        const propertyTmp = new Property();
        propertyTmp.editorOptions.onFocusIn = e => {
          this.loadItemWithClickInForm(e);
        };
        this.property.dataType = item.DataType;
        propertyTmp.label.text = item.Name;
        propertyTmp.dataField = item.Name;
        propertyTmp.visible = true;
        propertyTmp.editorOptions.readOnly = false;
        if (!item.AllowNull && item.DataType !== 'bit') {
          propertyTmp.validationRules.push({
            message: 'Requerido',
            type: 'required'
          });
        }
        if (item.DataType === 'bit') {
          propertyTmp.editorOptions.value = false;
        } else {
          propertyTmp.editorOptions.value = null;
        }
        this.setEditorOptions(item, propertyTmp);
        if (item.ForeignKeys !== null) {
          this.setValuesForeignKey(item, propertyTmp);
        }
        this.listItemsForm.push({ ...propertyTmp });
      }
      if (this.listPrimaryKeys.length === 1) {
        if (this.listPrimaryKeys[0].IsIdentity || this.listPrimaryKeys[0].IsGuid) {
          const column = this.listItemsForm.filter(x => x.dataField === this.listPrimaryKeys[0].Name)[0];
          column.editorOptions.readOnly = true;
          const requeridRule = column.validationRules.filter(x => x.type === 'required')[0];
          if (requeridRule) {
            column.validationRules.splice(column.validationRules.indexOf(requeridRule), 1);
          }
        }
      }
      this.items.emit({
        listItemsForm: this.listItemsForm,
        listPrimaryKeys: this.listPrimaryKeys,
        listItemsDataSource: this.listItemsDataSource
      });
      this.sharedService.setListItemsForm(this.listItemsForm);
    }, 200);
  }

  setDataType() {
    switch (this.listColumns[this.indexItemWork].DataType) {
      case 'datetime':
      case 'datetime2':
      case 'smalldatetime':
        this.dataType = 'datetime';
        break;
      case 'date':
        this.dataType = 'date';
        break;
      case 'int':
      case 'decimal':
      case 'smallint':
      case 'tinyint':
      case 'bigint':
      case 'number':
        this.dataType = 'number';
        break;
      case 'bit':
        this.isBit = true;
        this.dataType = 'boolean';
        break;
      case 'numeric':
        this.isNumeric = true;
        this.dataType = 'number';
        break;
      default:
        this.dataType = 'string';
        break;
    }
  }

  setTodayValue(e) {
    if (e === 'min') {
      this.property.editorOptions.minDate = new Date();
      this.property.editorOptions.minDateToday = true;
    } else {
      this.property.editorOptions.maxDate = new Date();
      this.property.editorOptions.maxDateToday = true;
    }
  }

  applyDatasourceBoolean() {
    this.property.editorOptions.dataSource = [...this.dataSource];
    if (this.property.editorOptions.dataSource.length > 0) {
      this.property.editorType = 'dxSelectBox';
      this.property.editorOptions.valueExpr = 'value';
      this.property.editorOptions.displayExpr = 'text';
      delete this.property.editorOptions.buttons;
    } else {
      this.property.editorType = 'dxTextBox';
    }
    this.applyChange();
    this.showPopup = false;
  }

  applyDatasource() {
    this.dataSourceConfig.dataSourceType = this.dataSourceType;
    this.dataSourceConfig.dataField = this.property.dataField;
    switch (this.dataSourceType) {
      case DataSourceType.Query:
        if (!this.formQuery.instance.validate().isValid) {
          return;
        }
        this.dataSourceConfig.params = JSON.stringify(this.listParamsService);
        this.property.editorType = 'dxTextBox';
        this.property.editorOptions.mode = 'search';
        this.property.editorOptions.readOnly = true;
        this.property.editorOptions.dataSource = 'Q';
        this.property.editorOptions.valueExpr = null;
        this.property.editorOptions.displayExpr = null;
        this.property.editorOptions.displayFormat = null;
        break;
      case DataSourceType.Service:
        if (!this.formService.instance.validate().isValid) {
          return;
        }
        this.dataSourceConfig.columns = JSON.stringify(this.listColumnsService);
        this.dataSourceConfig.params = JSON.stringify(this.listParamsService);
        this.property.editorType = 'dxTextBox';
        this.property.editorOptions.mode = 'search';
        this.property.editorOptions.readOnly = true;
        this.property.editorOptions.dataSource = 'S';
        this.property.editorOptions.valueExpr = null;
        this.property.editorOptions.displayExpr = null;
        this.property.editorOptions.displayFormat = null;
        this.showParams = false;
        this.showColumns = false;
        break;
      default:
        if (this.listDataSourceFixed.length === 0) {
          return;
        }
        delete this.property.editorOptions.buttons;
        this.property.editorOptions.valueExpr = 'value';
        this.property.editorOptions.displayExpr = 'text';
        this.property.editorType = 'dxSelectBox';
        this.property.editorOptions.displayFormat = null;
        this.property.editorOptions.mode = null;
        this.property.editorOptions.readOnly = false;
        if (this.property.dataType === 'smallint' || this.property.dataType === 'int' || this.property.dataType === 'numeric') {
          for (const item of this.listDataSourceFixed) {
            item.value = +item.value;
          }
        }
        this.property.editorOptions.dataSource = [...this.listDataSourceFixed];
        this.dataSourceConfig.fixedList = [...this.listDataSourceFixed];
    }
    this.showRemoveDataSource = true;
    this.listItemsDataSource.splice(this.indexItemDataSource, 1);
    this.listItemsDataSource.splice(this.indexItemDataSource, 0, { ...this.dataSourceConfig });
    this.applyChange();
    this.showPopupDataSource = false;
  }

  setInputAttr() {
    const inputAttrStyle = [];
    for (const item of Object.keys(this.inputAttr)) {
      if (!this.inputAttr[item]) {
        delete this.inputAttr[item];
        continue;
      }
      inputAttrStyle.push(`${item.replace('_', '-')}:${this.inputAttr[item]}`);
    }
    this.property.editorOptions.inputAttr = {
      style: inputAttrStyle.join(';')
    };
  }

  applyChange() {
    if (this.property.isFileUpload) {
      if (!this.formGeneralProperties.instance.validate().isValid) {
        return;
      }
    }
    // si tiene propiedades adicionales como color de fondo
    if (!this.property.isFileUpload) {
      this.setInputAttr();
    }
    this.listItemsForm.splice(this.indexItemWork, 1);
    if (!this.defaultValue.function) {
      this.property.editorOptions.defaultValueFunc = null;
    }
    this.listItemsForm.splice(this.indexItemWork, 0, { ...this.property });
    this.items.emit({
      listItemsForm: this.listItemsForm,
      listPrimaryKeys: this.listPrimaryKeys,
      listItemsDataSource: this.listItemsDataSource,
      listEventData: this.listEventData
    });
    this.sharedService.setListItemsForm(this.listItemsForm);
    setTimeout(() => {
      if (this.property.visible) {
        if (document.getElementsByName(this.listItemsForm[this.indexItemWork].dataField).length > 0) {
          this.previewControl = document.getElementsByName(this.listItemsForm[this.indexItemWork].dataField)[0];
          if (this.previewControl) {
            this.previewControl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('select-item');
          }
        }
      } else {
        this.previewControl = null;
      }
    }, 500);
  }

  initializeDefaultFunctions() {
    switch (this.property.editorType) {
      case 'dxDateBox':
        this.listDefaultFunctions = [
          { value: 'getDate', text: 'Obtiene la fecha actual' }
        ];
        break;
      case 'dxNumberBox':
        if (this.property.dataField !== 'EMP_CODI') {
          this.listDefaultFunctions = [
            {
              value: 'getCompany',
              text: 'Obtiene el código de empresa de la sesión'
            },
            {
              value: 'getMaxConse',
              text: 'Obtiene el consecutivo maximo de registro'
            },
            {
              value: 'getMaxConseDet',
              text: 'Obtiene el consecutivo maximo de registro (detalle de transacciones)'
            },
            {
              value: 'getYear',
              text: 'Obtiene el año de la fecha actual'
            },
            {
              value: 'getMonth',
              text: 'Obtiene el mes de la fecha actual'
            },
            {
              value: 'getDay',
              text: 'Obtiene el dia de la fecha actual'
            }
          ];
        }
        break;
      case 'dxSelectBox':
      case 'dxCheckBox':
        this.listDefaultFunctions = [];
        break;
      default:
        this.listDefaultFunctions = [
          {
            value: 'getUserName',
            text: 'Obtiene el nombre de usuario de la sesión'
          },
          {
            value: 'getUserCode',
            text: 'Obtiene el código de usuario de la sesión'
          },
          {
            value: 'getCompany',
            text: 'Obtiene el código de empresa de la sesión'
          }
        ];
        break;
    }
    if (this.listDefaultFunctions.length === 0 && this.property.dataField === 'EMP_CODI') {
      this.listDefaultFunctions = [
        {
          value: 'getCompany',
          text: 'Obtiene el código de empresa de la sesión'
        }
      ]
    }
  }

  applyDefaultValue() {
    this.property.editorOptions.defaultValueFunc = this.defaultValue.function ? this.defaultValue.function : '';
    if (this.property.editorOptions.defaultValueFunc.toString().length !== 0) {
      const item = this.listDefaultFunctions.filter(x => x.value === this.property.editorOptions.defaultValueFunc)[0];
      if (item === undefined) {
        this.sharedService.error('Función asignada no valida');
        return;
      }
    }
    this.property.editorOptions.defaultValueModes = [...this.dafaultModesSelected];
    this.dafaultModesSelected = [1];
    if (this.pattern.Id > 0) {
      this.property.editorOptions.defaultValueModes = [1];
      this.property.editorOptions.value = null;
      this.property.patternId = this.pattern.Id;
      this.property.pattern = this.pattern.Name;
    } else {
      this.property.editorOptions.value = this.defaultValue.value;
      this.property.patternId = null;
      this.property.pattern = null;
    }
    if (this.property.editorType === 'dxCheckBox') {
      if (this.defaultValue.value) {
        this.property.editorOptions.value = 'S'
      }
      else {
        this.property.editorOptions.value = 'N'
      }
    }
    this.pattern.Id = 0;
    this.pattern.Name = null;
    this.applyChange();
    this.showPopupFunctions = false;
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.2);
  }

  popupFontHeight = () => {
    return Math.round(window.innerHeight / 1.5);
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.4);
  }

  textAreaHeight = () => {
    return Math.round(window.innerHeight / 2.9);
  }

  defaultValuesListHeight = () => {
    return Math.round(window.innerHeight / 2.4);
  }

  defaultValuesGridHeight = () => {
    return Math.round(window.innerHeight / 2.4);
  }

  removePattern() {
    this.listPatterns.instance.unselectAll();
    this.property.editorOptions.value = null;
    this.property.patternId = null;
    this.property.pattern = null;
    this.pattern.Id = 0;
    this.pattern.Name = null;
  }

  openPopupConfigSearch() {
    this.titleSearch = `Configuración Buscador (${this.property.label.text})`;
    this.showPopupConfigSearch = true;
    this.getVisiblesSearchColumns();
    this.getDisplayColumnsSearch();
    this.getJoins();
    this.getSearchConditions();
    this.getSearchConditionsOnlyRecord();
    this.getOrderBy();
    this.getProps();
    this.getSubQuery();
    const expresion = /[A-Z]/g;
    this.property.tableNameAliasForeignKey = this.property.tableNameForeignKey.split(';')[0].match(expresion) ? this.property.tableNameForeignKey.split(';')[0].match(expresion).join('').toLowerCase() : this.property.tableNameForeignKey;
    if (this.listReserveWordsSql.find(x => x === this.property.tableNameAliasForeignKey.toUpperCase())) {
      this.property.tableNameAliasForeignKey = `${this.property.tableNameAliasForeignKey}1`;
    }
    if (this.listDataSourceJoins.length === 0) {
      this.listDataSourceJoins.push({
        id: 1,
        table: this.property.tableNameForeignKey.split(';')[0],
        tableAlias: this.property.tableNameAliasForeignKey,
        originField: this.property.valueMemberParentKey,
        destinationField: this.property.valueMemberForeignKey
      });
    }
    else {
      //   // si ha cambiado el alias entonces se actualiza -- no realizarlo para respetar correcciones del usuario
      //   // if (this.listDataSourceJoins[0].tableAlias !== this.property.tableNameAliasForeignKey) {
      //   //   this.listDataSourceJoins[0].tableAlias = this.property.tableNameAliasForeignKey;
    }
    //asignar id
    for (const item of this.listDataSourceJoins) {
      if (item.id === undefined) {
        item.id = this.listDataSourceJoins.indexOf(item) + 1;
      }
    }
  }


  getVisiblesSearchColumns() {
    this.listSearchColumns = JSON.parse(this.property.visibleColumnsForeignKey);
  }

  setVisiblesSearchColumns() {
    this.property.visibleColumnsForeignKey = JSON.stringify(this.listSearchColumns);
  }

  getDisplayColumnsSearch() {
    const selectedKeys = [];
    const indexes = [];
    this.listVisibleColumns = [];
    let tablas = '';
    for (const tabla of JSON.parse(this.property.joinsForeignKey)) {
      if (tablas.indexOf(tabla.tableAlias) === -1) {
        this.mainFormService.listColumns(this.connectionId, tabla.table).subscribe((response: ActionResult) => {
          for (const item of response.Result) {
            this.listVisibleColumns.push(tabla.tableAlias + '.' + item.Name);
          }
          setTimeout(() => {
            if (this.property.displayMemberForeignKey) {
              for (let item of this.property.displayMemberForeignKey.split(';')) {
                //item = tabla.tableAlias + '.' + item;
                indexes.push(this.listVisibleColumns.indexOf(item));
                selectedKeys.push(this.listVisibleColumns[this.listVisibleColumns.indexOf(item)]);
              }
              // this.gridVisibleColumns.instance.selectRowsByIndexes(indexes);
              this.gridVisibleColumns.selectedRowKeys = selectedKeys;
            }
          }, 200);
        });
      }
      tablas = tablas + tabla.tableAlias;
    }
  }

  setDisplayColumnsSearch() {
    this.property.displayMemberForeignKey = this.gridVisibleColumns.instance.getSelectedRowsData().join(';');
  }

  removeDataSource() {
    if (!this.listItemsDataSource.find((x) => x.dataField === this.property.dataField)) {
      return;
    }
    this.setEditorOptions(this.listColumns[this.indexItemWork], this.property);
    this.listDataSourceFixed = [];
    this.listItemsDataSource.splice(this.indexItemDataSource, 1);
    this.applyChange();
    this.disabledTabDataSourceFixed = false;
    this.disabledTabDataSourceQuery = false;
    this.disabledTabDataSourceService = false;
    this.showRemoveDataSource = false;
  }


  allowShowParams() {
    this.refreshItemsService = false;
    this.showParams = !this.showParams;
    this.showColumns = false;
    setTimeout(() => {
      this.refreshItemsService = true;
    }, 100);
  }

  allowShowColumns() {
    this.refreshItemsService = false;
    this.showColumns = !this.showColumns;
    this.showParams = false;
    setTimeout(() => {
      this.refreshItemsService = true;
    }, 100);
  }

  setSearchConditions() {
    this.property.whereForeignKey = JSON.stringify(this.listDataSourceConditions);
  }

  setSearchConditionsOnlyRecord() {
    this.property.whereForeignKeyOnlyRecord = JSON.stringify(this.listDataSourceConditionsOnlyRecord);
  }

  setJoins() {
    this.property.joinsForeignKey = JSON.stringify(this.listDataSourceJoins);
  }

  setOrderBy() {
    this.property.orderBy = JSON.stringify(this.listDataSourceOrder);
  }

  setProps() {
    if (JSON.stringify(this.listDataSourceProps) !== "[]") {
      this.property.propsConfigSearch = JSON.stringify(this.listDataSourceProps)
    }
    else {
      this.listDataSourceProps.splice(0, this.listDataSourceProps.length);
      this.listDataSourceProps.push({ id: 'AutoOpen', field: 'Ejecuta consulta al abrir', value: 'S' });
      this.listDataSourceProps.push({ id: 'Cache', field: 'Guardar resultado consulta', value: 'S' });
      this.property.propsConfigSearch = JSON.stringify(this.listDataSourceProps);
    }
  }

  setSubQuery() {
    //validar palabras reservadas
    const dataRest: any = {};
    this.subQueryFormdata.query ? dataRest['query'] = this.subQueryFormdata.query : dataRest['query'] = '';
    this.mainFormService['ValidateQuery'](dataRest).subscribe(
      (response: ActionResult) => {
        if (response.IsSucessfull) {
          this.property.subQuery = JSON.stringify(this.subQueryFormdata);
        } else {
          this.sharedService.error(response.ErrorMessage);
          this.subQueryFormdata.query = '';
          this.property.subQuery = JSON.stringify(this.subQueryFormdata);
          return;
        }
        this.sharedService.showLoader(false);
      },
      () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      }
    );
  }

  setDataPopupEvent(event: string, eventName: string) {
    this.event = event;
    this.eventName = eventName;
    this.showPopupEvents = true;
  }

  getEventConfig(e: EventProperty) {
    if (this.listEventData.filter(x => x.dataField === e.dataField && x.eventName === e.eventName).length > 0) {
      this.listEventData.splice(this.listEventData.indexOf(this.listEventData.filter(x => x.dataField === e.dataField && x.eventName === e.eventName)[0]), 1);
    }
    switch (e.eventName) {
      case 'onEnterKey':
        this.property.configuredOnEnterKey = 'Configurado';
        break;
      case 'onFocusIn':
        this.property.configuredOnFocusIn = 'Configurado';
        break;
      case 'onFocusOut':
        this.property.configuredOnFocusOut = 'Configurado';
        break;
      case 'onValueChanged':
        this.property.configuredOnValueChanged = 'Configurado';
        break;
    }
    this.listEventData.push(e);
    this.applyChange();
    this.showPopupEvents = false;
  }

  removeEvent(eventName: string) {
    const event = this.listEventData.filter(x => x.eventName === eventName && x.dataField === this.property.dataField)[0];
    this.listEventData.splice(this.listEventData.indexOf(event), 1);
    switch (eventName) {
      case 'onEnterKey':
        this.property.configuredOnEnterKey = null;
        break;
      case 'onFocusIn':
        this.property.configuredOnFocusIn = null;
        break;
      case 'onFocusOut':
        this.property.configuredOnFocusOut = null;
        break;
      case 'onValueChanged':
        this.property.configuredOnValueChanged = null;
        break;
    }
    this.applyChange();
  }

  removeBackGroundColor() {
    this.inputAttr.background_color = '';
    this.setInputAttr();
  }

  removeBackGroundColorLabel() {
    this.inputAttr.background_color_label = '';
    this.property.cssClass = null;
  }

  setFontStyle() {
    this.showPopupSetFontStyle = true;
  }

  setValuesInPreview() {
    if (this.inputAttr.font_family) {
      this.dxListFontFamily.instance.selectItem(
        this.listFontFamily.indexOf(
          this.listFontFamily.find(x => x.id === this.inputAttr.font_family)
        )
      );
      document.getElementById(
        'fontPreview'
      ).style.fontFamily = this.inputAttr.font_family;
    }
    if (this.inputAttr.font_style && this.inputAttr.font_style === 'italic' && this.inputAttr.font_weight && this.inputAttr.font_weight === 'bold') {
      this.dxListFontStyle.instance.selectItem(3);
    } else if (this.inputAttr.font_style && this.inputAttr.font_style === 'italic') {
      this.dxListFontStyle.instance.selectItem(2);
    } else if (this.inputAttr.font_style && this.inputAttr.font_style === 'normal' && this.inputAttr.font_weight && this.inputAttr.font_weight === 'bold') {
      this.dxListFontStyle.instance.selectItem(1);
    } else if (this.inputAttr.font_style && this.inputAttr.font_style === 'normal') {
      this.dxListFontStyle.instance.selectItem(0);
    }
    document.getElementById('fontPreview').style.fontWeight = this.inputAttr.font_weight; document.getElementById('fontPreview').style.fontStyle = this.inputAttr.font_style;

    if (this.inputAttr.font_size) {
      this.dxListFontSize.instance.selectItem(this.listFontSize.indexOf(this.listFontSize.find(x => x.id === this.inputAttr.font_size)));
      document.getElementById('fontPreview').style.fontSize = this.inputAttr.font_size;
    }
    if (this.inputAttr.text_decoration) {
      this.dxListFontEffect.instance.selectItem(this.listFontEffect.indexOf(this.listFontEffect.find(x => x.id === this.inputAttr.text_decoration)));
      document.getElementById('fontPreview').style.textDecoration = this.inputAttr.text_decoration;
    }
  }

  removeFontStyle() {
    delete this.inputAttr.font_family;
    delete this.inputAttr.font_size;
    delete this.inputAttr.font_style;
    delete this.inputAttr.font_weight;
    delete this.inputAttr.text_decoration;
  }

  showClearButtonFont() {
    if (this.inputAttr.font_family || this.inputAttr.font_size || this.inputAttr.font_style || this.inputAttr.font_weight || this.inputAttr.text_decoration) {
      return true;
    }
    return false;
  }


  changeTabDefaultValue(e) {
    if (e.nextId === 'listPatterns') {
      this.dafaultModesSelected = [1];
      this.listModeApplyDefaultValue = [
        { Id: 1, Name: 'Guardando' }
      ];
      if (this.toolbarItemsDefaultValuePopup.length === 2) {
        return;
      }
      this.toolbarItemsDefaultValuePopup.push({
        ...this.toolbarPopupsConfig,
        options: {
          text: 'Remover Secuencia',
          onClick: () => {
            this.removePattern();
          },
          elementAttr: { class: 'primary-button-color' },
        }
      });
    } else {
      this.listModeApplyDefaultValue = [
        { Id: 1, Name: 'Guardando' },
        { Id: 2, Name: 'Editando' }
      ];
      this.toolbarItemsDefaultValuePopup.splice(1, 1);
    }
    this.defaultValuesPopup.instance.option('toolbarItems', this.toolbarItemsDefaultValuePopup);
  }

  heightForm = () => {
    if (window.innerHeight < 800) {
      return window.innerHeight + 820;
    }
    return window.innerHeight + 640;
  }

  heightFormKey = () => {
    if (window.innerHeight < 800) {
      return window.innerHeight - 120;
    }
    return window.innerHeight - 250;
  }

  heightFormForeignKey = () => {
    if (window.innerHeight < 800) {
      return window.innerHeight - 120;
    }
    return window.innerHeight - 250;
  }

  heightPattern = () => {
    if (window.innerHeight < 800) {
      return window.innerHeight;
    }
    return window.innerHeight - 160;
  }

  onContentReady(e: any) {
    //  = uuid();
    //  = uuid();
    //  = uuid();
    //  = uuid();
    //  = uuid();
    setTimeout(() => {
      const formEl = document.getElementById(this.formId);
      const formEventsEl = document.getElementById(this.formEventsId);
      const formDataSourceQueryEl = document.getElementById(this.formDataSourceQueryId);
      const formDataSourceServiceEl = document.getElementById(this.formDataSourceServiceId);
      const formApplicationModeEl = document.getElementById(this.formApplicationModeId);
      const formDefaultValueEl = document.getElementById(this.formDefaultValueId);
      const formsubQueryEl = document.getElementById(this.formsubQueryId);
      const gridDataSourceEl = document.getElementById(this.gridDataSourceId);
      const gridDataSourceFixedEl = document.getElementById(this.gridDataSourceFixedId);
      const gridDataSourceQueryEl = document.getElementById(this.gridDataSourceQueryId);
      const gridDataSourceServiceEl = document.getElementById(this.gridDataSourceServiceId);
      const gridDataSourceServiceColumnsEl = document.getElementById(this.gridDataSourceServiceColumnsId);
      const gridFunctionsEl = document.getElementById(this.gridFunctionsId);
      const gridSearchColumnsEl = document.getElementById(this.gridSearchColumnsId);
      const gridVisibleColumnsEl = document.getElementById(this.gridVisibleColumnsId);
      const gridJoinsEl = document.getElementById(this.gridJoinsId);
      const gridConditionsEl = document.getElementById(this.gridConditionsId);
      const gridconditionOnlyRecordEl = document.getElementById(this.gridconditionOnlyRecordId);
      const gridOrderEl = document.getElementById(this.gridOrderId);
      const gridPropsEl = document.getElementById(this.gridPropsId);

      const popUpDataSourceEl = document.getElementById(this.popUpDataSourceId);
      const popUpDefaultValueEl = document.getElementById(this.popUpDefaultValueId);
      const popUpSearchIdEl = document.getElementById(this.popUpSearchId);
      const popUpUpdateDataEl = document.getElementById(this.popUpUpdateDataId);
      const popUpFontEl = document.getElementById(this.popUpFontId);

      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formEventsEl) {
        this.stylingService.setLabelColorStyle(formEventsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEventsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formDataSourceQueryEl) {
        this.stylingService.setLabelColorStyle(formDataSourceQueryEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formDataSourceQueryEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formDataSourceServiceEl) {
        this.stylingService.setLabelColorStyle(formDataSourceServiceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formDataSourceServiceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formApplicationModeEl) {
        this.stylingService.setLabelColorStyle(formApplicationModeEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formApplicationModeEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formDefaultValueEl) {
        this.stylingService.setLabelColorStyle(formDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formDefaultValueEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formsubQueryEl) {
        this.stylingService.setLabelColorStyle(formsubQueryEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formsubQueryEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceFixedEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceFixedEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceFixedEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceQueryEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceQueryEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceQueryEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceServiceEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceServiceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceServiceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceServiceColumnsEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceServiceColumnsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceServiceColumnsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridFunctionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridFunctionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSearchColumnsEl) {
        this.stylingService.setGridHeaderColorStyle(gridSearchColumnsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSearchColumnsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridVisibleColumnsEl) {
        this.stylingService.setGridHeaderColorStyle(gridVisibleColumnsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridVisibleColumnsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridJoinsEl) {
        this.stylingService.setGridHeaderColorStyle(gridJoinsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridJoinsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridConditionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridConditionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridConditionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridconditionOnlyRecordEl) {
        this.stylingService.setGridHeaderColorStyle(gridconditionOnlyRecordEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridconditionOnlyRecordEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridOrderEl) {
        this.stylingService.setGridHeaderColorStyle(gridOrderEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridOrderEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridPropsEl) {
        this.stylingService.setGridHeaderColorStyle(gridPropsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridPropsEl, this.sessionService.session.selectedCompany.theme);
      }

      if (popUpDataSourceEl) {
        this.stylingService.setTitleColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpDefaultValueEl) {
        this.stylingService.setTitleColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpDefaultValueEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpSearchIdEl) {
        this.stylingService.setTitleColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchIdEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpUpdateDataEl) {
        this.stylingService.setTitleColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpUpdateDataEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpFontEl) {
        this.stylingService.setTitleColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpFontEl, this.sessionService.session.selectedCompany.theme);
      }

    }, 1);
  }


  loadTabs() {

    for (const tab of this.mainFormTabs) {
      this.listTabOptions.push({ Name: tab.Name, Id: Number(tab.Id) });
    }
  }

  //#endregion

}

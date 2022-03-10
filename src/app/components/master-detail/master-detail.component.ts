import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import FileSaver from 'file-saver';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EventProperty, HideField, RuleAction, RestForm, MainForm, Property, DataSource, KeyData, ActionResult, OtherField } from '../../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import moment from 'moment';
import 'moment/min/locales';
import { SharedService } from 'src/app/services/shared.service';
import { CommonFunctions } from 'src/app/utils/common-functions';
import { DynamicProgramsService } from 'src/app/services/dynamic.programs.service';
import { MainFormService } from 'src/app/services/main-form.service';
import { SecurityService } from 'src/app/services/security.service';
import { EventActionType } from 'src/app/enums/event-action-type.enum';
import { DataSourceType } from 'src/app/enums/data-source-type.enum';
import { SessionService } from 'src/app/services/session.service';
import { ConfigService } from 'src/app/services/config.service';
import { ResourceType } from 'src/app/models/permission';
import { SAVE_ACTION, EDIT_ACTION, DELETE_ACTION } from 'src/app/utils/const';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SecuritySevenService } from '../../services/security-seven.service';
import { CacheSearchConfig } from '../../models/cache-search';
import { BaseDocConfg } from 'src/app/models/basedoc-config';
import { AssignConsUbica } from 'src/app/models/ubica-config';
import { Functions } from 'src/app/models/function';
import { Method, MethodDef } from 'src/app/models/method';
import { ActionResultT } from 'src/app/models/action-result';
import { Buttoncnfg } from 'src/app/models/button-config';
import { SpecialDetConfg } from 'src/app/models/specialdet-config';


@Component({
  selector: 'app-master-detail',
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss']
})
export class MasterDetailComponent implements OnInit {
  //#region Fields
  formId = uuid();
  formtotId = uuid();
  gridId = uuid();
  popUpId = uuid();
  gridForeignKeyId = uuid();
  gridDataSourceId = uuid();
  gridFileId = uuid();
  popUpForeignKeyId = uuid();
  popUpAddForeignKeyId = uuid();
  popUpDataSourceId = uuid();
  popUpFileId = uuid();
  popUpSearchFKId = uuid();
  popUpBaseDocId = uuid();
  popUpSearchBaseDocId = uuid();
  popUpSearchSpecialDetId = uuid();
  popUpConsulUbicaId = uuid();
  popUpSpecialDetId = uuid();
  gridSearchFKId = uuid();
  gridSearchBasedocId = uuid();
  gridSearchSpecialdetId = uuid();
  gridConsulUbicaId = uuid();
  gridSpecialDetId = uuid();
  gridBaseDocId = uuid();
  BtnFuncEspec1Id = uuid();
  BtnFuncEspec2Id = uuid();
  BtnFuncEspec3Id = uuid();
  popUpMessageId = uuid();
  gridMessageId = uuid();
  listFunctions: Functions[] = [];
  listMethods: Method[] = [];
  listitemRowClickDataSource: any[] = [];
  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;
  @Input() SupParentMainForm: MainForm;
  @Input() parentMainForm: MainForm;
  @Input() mainForm: MainForm;
  @Input() dataMaster: any;
  showPopupImportExcel = false;
  showPopupDetail = false;
  showPopupSearchFKConditions = false;
  showPopupSearchBasedocConditions = false;
  showPopupConsulUbica = false;
  showPopupSearchSpecialdetConditions = false;
  showPopupMessage = false;
  @Output() responseRefresh = new EventEmitter<any>();
  @ViewChild(DxFormComponent) form: DxFormComponent;
  @ViewChild(DxFormComponent) formtot: DxFormComponent;
  @ViewChild('foreignKeyGrid') foreignKeyGrid: DxDataGridComponent;
  @ViewChild('dataSourceGrid') dataSourceGrid: DxDataGridComponent;
  @ViewChild('baseDocGrid') baseDocGrid: DxDataGridComponent;
  @ViewChild('consulUbicaGrid') consulUbicaGrid: DxDataGridComponent;
  @ViewChild('specialDetGrid') specialDetGrid: DxDataGridComponent;
  formTitle: string;
  formSubTitle: string;
  listMainFormMasterDetail: MainForm[] = [];
  listItemsForm: Property[] = [];
  listItemsFormMaster: Property[] = [];
  listItemsTotal: Property[] = [];
  listColumsGrid: any[] = [];
  dataOut: any = {};
  dataDetail: any = {};
  dataDetailAnt: any = {};
  dataTotal: any = {};
  listData: any[] = [];
  listDataForeignKey: any[] = [];
  listDataBaseDoc: any[] = [];
  DataSpecialDet: any[] = [];
  listDataSpecialDet: any[] = [];
  listDataUbica: any[] = [];
  listKeyMasterDetail: any[] = [];
  listSearchFKConditions: any[] = [];
  listSearchBasedocConditions: any[] = [];
  listSearchSpecialdetConditions: any[] = [];
  listCacheSearch: CacheSearchConfig[] = [];
  listDataMessage: any[] = [];
  empcodiFilter = '';
  messageTitle = '';
  editMode = false;
  searchVisible = false;
  searchBaseDoc = false;
  searchSpecialDet = false;
  page = 1;
  pageSearch = 1;
  totalRecords: number;
  totalRecordsSearch: number;
  totaldocum: number;
  foreignKeyData: Property;
  cacheSearch: CacheSearchConfig;
  emptyField: Property;
  columnsTot = 0;
  button1txt = '';
  button1icon = '';
  button2txt = '';
  button2icon = '';
  button3txt = '';
  button3icon = '';
  funcEspec1 = '';
  funcEspec2 = '';
  funcEspec3 = '';
  cAplicando = 1;
  cEditando = 2;
  cRevertiendo = 3;
  cAnulando = 4;
  listVarsTransaction: any[] = [];
  listExceptDetail: any[] = [];
  baseDocConfig: BaseDocConfg;
  specialDetConfig: SpecialDetConfg;
  errorBeforeSave = false;
  errorValdocu = false;
  errorDelete = false;
  gPro_codi = '';
  gTab_prin = '';
  lglcruField = '';
  gItem = '';
  assignConsUbica: AssignConsUbica;
  searchData = {
    select: null,
    joins: null,
    pageSize: 10,
    pageNumber: 1,
    where: null,
    like: null,
    tableName: '',
    orderBy: '',
    query: '',
    queryCount: '',
    querySum: ''
  };
  itemSelected: any;
  itemRowClickSearch: any;
  itemRowClickBaseDoc: any;
  itemRowClickSpecialDet: any;
  itemRowClickData: any;
  searchMethod: SearchMethod = SearchMethod.StartWith;
  criteria = '';
  metadataGrid: any;
  showMasterDetail = false;
  toolbarItemsMasterDetailPopup: any;
  toolbarPopupsConfig = {
    toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
  };
  listOperator: any[] = [
    { value: '=', text: 'Igual' },
    { value: '<>', text: 'Diferente' },
    { value: '<', text: 'Menor' },
    { value: '<=', text: 'Menor o Igual' },
    { value: '>', text: 'Mayor' },
    { value: '>=', text: 'Mayor o Igual' },
    { value: 'IN', text: 'Entre' },
    { value: 'LIKE', text: 'Contiene' },
    { value: 'NOT LIKE', text: 'No contiene' }
  ];

  toolbarItemsForeignKeyPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.setForeignKey();
          this.form.instance.getEditor(this.foreignKeyData.dataField).option('readOnly', true);
          this.form.instance.getEditor(this.foreignKeyData.dataField).option('buttons[1].options.visible', true);
          this.cleanDependencyFields(this.foreignKeyData.dataField);
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.searchVisible = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'QBE',
        icon: 'fas fa-search',
        onClick: () => {
          this.searchFK();
        }
      }
    }
  ];

  toolbarItemsSearchFKPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Ejecutar',
        icon: 'fas fa-bolt',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setFKConditions();
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Cancelar',
        icon: 'far fa-window-close',
        elementAttr: { class: 'secondary-button-color' },
        onClick: () => {
          this.showPopupSearchFKConditions = false;
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Limpiar',
        icon: 'fas fa-grip-horizontal',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.listSearchFKConditions = [];
          this.empcodiFilter = '';
          this.searchFK();
        }
      }
    }
  ];

  toolbarItemsSearchBasedocPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Ejecutar',
        icon: 'fas fa-bolt',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setBasedocConditions();
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Cancelar',
        icon: 'far fa-window-close',
        elementAttr: { class: 'secondary-button-color' },
        onClick: () => {
          this.showPopupSearchBasedocConditions = false;
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Limpiar',
        icon: 'fas fa-grip-horizontal',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.listSearchBasedocConditions = [];
          this.empcodiFilter = '';
          this.searchBasedoc();
        }
      }
    }
  ];

  toolbarItemsSearchSpecialdetPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Ejecutar',
        icon: 'fas fa-bolt',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setSpecialdetConditions();
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Cancelar',
        icon: 'far fa-window-close',
        elementAttr: { class: 'secondary-button-color' },
        onClick: () => {
          this.showPopupSearchSpecialdetConditions = false;
        }
      }
    },
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Limpiar',
        icon: 'fas fa-grip-horizontal',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.listSearchSpecialdetConditions = [];
          this.empcodiFilter = '';
          this.searchSpecialdet();
        }
      }
    }
  ];

  toolbarItemsConsulUbicaPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Cerrar',
        //icon: 'fas fa-bolt',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.showPopupConsulUbica = false;
        }
      }
    }
  ];

  fileUploadVisible = false;
  dataSourceVisible = false;
  toolbarItemsDataSourcePopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.setDataSourceValue();
        }
      }
    }
  ];
  toolbarItemsFileUploadPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.closePopupFileUpload();
        }
      }
    }
  ];

  toolbarItemsBaseDocPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.loadDetailsBaseDoc();
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.searchBaseDoc = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'QBE',
        icon: 'fas fa-search',
        onClick: () => {
          this.searchBasedoc();
        }
      }
    }
  ];

  toolbarItemsSpecialDetPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.loadDetailsSpecialDet();
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.searchSpecialDet = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'QBE',
        icon: 'fas fa-search',
        onClick: () => {
          this.searchSpecialdet();
        }
      }
    }
  ];

  toolbarItemsMessagePopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        icon: 'far fa-window-close',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.showPopupMessage = false;
        }
      }
    }
  ];

  itemRowClickDataSource: any;
  fieldDataSource: DataSource;
  listDataSource: any[] = [];
  public hasBaseDropZoneOver = false;
  public uploader: FileUploader = new FileUploader({ autoUpload: true, url: `${this.configService.config.opheliaSuiteCoreApiV1}Upload/UpDocument`, method: 'POST' });
  listDocuments: any[] = [];
  listItemsDataSource: DataSource[] = [];
  listMetadataControlEvent: EventProperty[] = [];
  listMetadataFormEvent: EventProperty[] = [];
  listButtons: Buttoncnfg[] = [];
  libraryId: number;
  itemUpload: Property;
  listItemChangeLabelColor: any[] = [];
  showPopupAddForeignKey = false;
  formCodeForeignKey = '';
  @Input() addInForeignKey = false;
  @Output() saveSuccess = new EventEmitter<any>();
  validationGroupName = '';
  searchTitle = '';
  baseDocTitle = '';
  listPermisions = [];
  //#endregion

  //#region Builder
  constructor(
    public sharedService: SharedService,
    private commonFunctions: CommonFunctions,
    private dynamicProgramsService: DynamicProgramsService,
    private mainFormService: MainFormService,
    private http: HttpClient,
    private securityService: SecuritySevenService,
    private sessionService: SessionService,
    private configService: ConfigService,
    private stylingService: StylingService
  ) { }

  //#endregion

  //#region Events
  async ngOnInit() {
    this.setToolbarItemsMasterDetailPopup();
    const resultPermisions = await this.securityService.getPermisions(this.mainForm.ProgramCode).toPromise();
    if (resultPermisions.isSuccessful) {
      this.listPermisions = resultPermisions.result.actions;
    }
    this.formTitle = this.mainForm.Title;
    this.listItemsForm = JSON.parse(this.mainForm.MetadataForm);
    this.listItemsFormMaster = JSON.parse(this.parentMainForm.MetadataForm);
    this.validationGroupName = `dynamicForm${this.mainForm.ProgramCode}`;
    this.metadataGrid = JSON.parse(this.mainForm.MetadataGrid);
    if (this.mainForm.MetadataDataSource) {
      this.listItemsDataSource = JSON.parse(this.mainForm.MetadataDataSource);
    }
    if (this.mainForm.MetadataControlEvent) {
      this.listMetadataControlEvent = JSON.parse(this.mainForm.MetadataControlEvent);
      this.listAllFunctions();
      this.listAllMethods();
    }
    if (this.mainForm.MetadataFormEvent) {
      this.listMetadataFormEvent = JSON.parse(this.mainForm.MetadataFormEvent);
      this.listButtons = [];
      if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onButton').length > 0) {
        const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onButton')[0];
        for (const action of event.actions) {
          const actionRest: RestForm = action.config;
          this.listButtons.push({
            sequence: action.sequence, icon: 'fas fa-exchange-alt', alignment: 'center',
            hint: actionRest.description, text: actionRest.description, elementAttr: { class: 'primary-button-color' }
          });
        }
      }
    }
    this.listColumsGrid = this.metadataGrid.columns;
    if (!this.SupParentMainForm) {
      this.SupParentMainForm = new MainForm();
    }
    if (this.SupParentMainForm.Transaccion === 'S') {
      this.listVarsTransaction = this.SupParentMainForm.VarsTransaction ? JSON.parse(this.SupParentMainForm.VarsTransaction) : [];
      this.listExceptDetail = this.SupParentMainForm.ExceptDetail ? JSON.parse(this.SupParentMainForm.ExceptDetail) : [];
      this.baseDocConfig = this.SupParentMainForm.BaseDocConfig ? JSON.parse(this.SupParentMainForm.BaseDocConfig) : new BaseDocConfg();
      this.specialDetConfig = this.SupParentMainForm.SpecialDetConfig ? JSON.parse(this.SupParentMainForm.SpecialDetConfig) : new SpecialDetConfg();
      this.gPro_codi = this.SupParentMainForm.SubTitle;
      this.gTab_prin = this.SupParentMainForm.TableName;
    }
    else {
      this.listVarsTransaction = this.parentMainForm.VarsTransaction ? JSON.parse(this.parentMainForm.VarsTransaction) : [];
      this.listExceptDetail = this.parentMainForm.ExceptDetail ? JSON.parse(this.parentMainForm.ExceptDetail) : [];
      this.baseDocConfig = this.parentMainForm.BaseDocConfig ? JSON.parse(this.parentMainForm.BaseDocConfig) : new BaseDocConfg();
      this.specialDetConfig = this.parentMainForm.SpecialDetConfig ? JSON.parse(this.parentMainForm.SpecialDetConfig) : new SpecialDetConfg();
      this.gPro_codi = this.parentMainForm.SubTitle;
      this.gTab_prin = this.parentMainForm.TableName;
    }
    if (this.mainForm.FuncEspec === 'UBICA') {
      this.assignConsUbica = this.mainForm.AssignConsUbica ? JSON.parse(this.mainForm.AssignConsUbica) : new AssignConsUbica();
    }
    else if (this.mainForm.FuncEspec.split(';')[0] === 'LEGALCRUCE') {
      this.lglcruField = this.mainForm.FuncEspec.split(';')[1];
    }

    // this.renderGridColumns();
    this.listAllData();
    if (this.mainForm.UseMasterDetail) {
      this.listMasterDetailsDetails();
    }
    this.afterAddingFile();
    this.completeItem();
    this.prepareFuncEsp();
    this.setTotalFields();
  }

  async onInitialized(e) {
    this.sharedService.showLoader(true);
    const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
    e.component.beginUpdate();
    e.component.option('items', []);
    for await (const item of this.listItemsForm) {
      if (item.cssClass) {
        this.listItemChangeLabelColor.push(item.cssClass);
      }
      // se obtiene la llave del maestro, se establece el valor y se deja solo lectura
      if (this.listKeyMasterDetail.filter((x) => x.DetailColumnName === item.dataField.replace(/^FK/, '')).length > 0 && item.dataField.replace(/^FK/, '') !== this.lglcruField) {
        const masterDetailKey = this.listKeyMasterDetail.filter((x) => x.DetailColumnName === item.dataField.replace(/^FK/, ''))[0];
        this.dataDetail[item.dataField.replace(/^FK/, '')] = this.dataMaster[masterDetailKey.MasterColumnName];
        item.editorOptions.value = this.dataMaster[masterDetailKey.MasterColumnName];
        item.editorOptions.readOnly = true;
        delete item.editorOptions.mode;
        e.component.option('items').push({ ...item });
        continue;
      }

      if (!this.editMode) {
        if (listKeyData.filter((x) => x.Name === item.dataField).length > 0) {
          if (!listKeyData.filter((x) => x.Name === item.dataField)[0].IsGuid && !listKeyData.filter((x) => x.Name === item.dataField)[0].IsIdentity) {
            item.editorOptions.readOnly = false;
          }
        }
      } else {
        if (listKeyData.filter((x) => x.Name === item.dataField).length > 0) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.validationRules !== undefined) {
        item.validationRules = item.validationRules.filter(x => x.type !== 'pattern');
        if (item.editorOptions.pattern) {
          const rule = {
            type: 'pattern', pattern: item.editorOptions.pattern, message: item.editorOptions.patternMessage
          };
          if (!item.editorOptions.patternMessage) {
            delete rule.message;
          }
          item.validationRules.push(rule);
        }
      }
      if (item.isForeignKey && (item.dataField !== 'FKEMP_CODI' || this.mainForm.TableName === 'GN_USUAR' || this.mainForm.TableName === 'GN_REMGU')) {
        item.editorOptions.onKeyDown = (el) => {
          // si se presiona tab y tiene configuradas condiciones para un registro unico entonces se ejecuta la consulta
          if (el.event.keyCode === 9) {
            this.foreignKeyData = { ... this.listItemsForm.filter((x) => x.dataField === el.component.option('name'))[0] };
            if (this.dataDetail[el.component.option('name').replace(/^FK/, '')]) {
              return;
            }
            setTimeout(async () => {
              this.dataDetail[el.component.option('name').replace(/^FK/, '')] = this.dataDetail[el.component.option('name')];
              await this.searchDataForeignKeyOnlyRecord();
            }, 200);
          }
        };
        delete item.editorOptions.mode;
        //item.editorOptions.readOnly = false; correccion F92 respetar parametrizacion formulario
        if (!item.editorOptions.readOnly) {
          // se agregan los botones para buscar y limpiar
          item.editorOptions.buttons = [
            {
              name: `search_${uuid()}`,
              location: 'before',
              options: {
                icon: 'dx-icon dx-icon-search icon-foreign-key',
                type: 'normal',
                stylingMode: 'text',
                disabled: false,
                visible: true,
                name: `search_${item.dataField}`,
                onClick: (b: any) => {
                  this.openPopupSearchForeignKey(b.component.option('name').replace('search_', ''));
                }
              }
            },
            {
              name: `times_${uuid()}`,
              options: {
                icon: 'dx-icon dx-icon-clear icon-foreign-key',
                type: 'normal',
                stylingMode: 'text',
                disabled: false,
                visible: false,
                name: `clear_${item.dataField}`,
                onClick: (b: any) => {
                  const dataField = b.component.option('name').replace('clear_', '');
                  this.form.instance.getEditor(dataField).option('readOnly', false);
                  this.form.instance.getEditor(dataField).option('buttons[1].options.visible', false);
                  this.dataDetail[dataField.replace(/^FK/, '')] = null;
                  this.dataDetail[dataField] = null;
                  this.cleanDependencyFields(dataField);
                }
              }
            },
          ];
        }
      }
      if (item.isFileUpload) {
        item.editorOptions.onFocusIn = (el) => {
          this.fileUploadVisible = true;
          this.itemUpload = this.listItemsForm.filter((x) => x.dataField === el.component.option('name'))[0];
          this.libraryId = this.itemUpload.libraryId;
        };
      }
      if (this.listItemsDataSource && this.listItemsDataSource.filter((x) => x.dataField === item.dataField).length > 0) {
        if (item.editorType === 'dxTextBox') {
          item.editorOptions.onFocusIn = (el) => {
            this.openPopupDataSource(el);
          };
        }
      }
      this.prepareEvent();
      this.prepareDateBoxItem(item);
      this.prepareNumberBoxItem(item);
      this.prepareDefaultValue(item);
      await this.prepareSequence(item);
      await this.getValueForeignKey(item);
      if (item.editorOptions.buttons && item.editorOptions.buttons.length === 0) {
        delete item.editorOptions.buttons;
      }
      e.component.option('items').push({ ...item });
    }
    e.component.repaint();
    e.component.endUpdate();

    if (this.listMetadataControlEvent) {
      // se ocultan los campos
      for (const item of this.listMetadataControlEvent.filter((x) => x.actions.filter((y) => y.type === EventActionType.hideField))) {
        this.hideField(item.dataField, item.eventName);
      }
    }
    this.setColorLabels();
    setTimeout(() => {
      this.sharedService.showLoader(false);
    }, 4000);

  }

  async onInitializedt(e) {
    e.component.beginUpdate();
    e.component.option('items', []);
    this.columnsTot = (this.listItemsTotal.length % 2) ? 9 : 10;
    let emptyfi = (this.listItemsTotal.length <= 2) ? 4 : 3;
    emptyfi = (this.listItemsTotal.length >= 5 && this.listItemsTotal.length <= 6) ? 2 : emptyfi;
    emptyfi = (this.listItemsTotal.length >= 7 && this.listItemsTotal.length <= 8) ? 1 : emptyfi;
    emptyfi = (this.listItemsTotal.length >= 9 && this.listItemsTotal.length <= 10) ? 0 : emptyfi;
    //asignar campos vacios
    this.emptyField = new Property();
    this.emptyField.itemType = 'empty';
    for (let i = 0; i < emptyfi; i++) {
      e.component.option('items').push({ ...this.emptyField });
    }
    for await (const item of this.listItemsTotal) {
      if (item.cssClass) {
        this.listItemChangeLabelColor.push(item.cssClass);
      }
      item.editorOptions.readOnly = true;
      e.component.option('items').push({ ...item });
    }
    e.component.repaint();
    e.component.endUpdate();
    //this.setColorLabels();
    setTimeout(() => {
      this.sharedService.showLoader(false);
    }, 4000);
  }

  openPopupSearchForeignKey(item: string) {
    if (this.searchVisible === true) {
      return;
    }
    this.sharedService.showLoader(true);
    this.foreignKeyData = { ... this.listItemsForm.find((x) => x.dataField === item) };
    this.searchTitle = `Seleccionar ${this.foreignKeyData.label.text}`;
    this.searchVisible = true;
    this.empcodiFilter = '';
    this.cacheSearch = { ... this.listCacheSearch.find((x) => x.item === item) };
    if (!this.cacheSearch.data) {
      this.searchDataForeignKey(true);
    }
    else {
      this.listDataForeignKey = this.cacheSearch.data;
      setTimeout(() => {
        if (this.foreignKeyData.visibleColumnsForeignKey && JSON.parse(this.foreignKeyData.visibleColumnsForeignKey).length > 0) {
          this.foreignKeyGrid.instance.option('columns', []);
          for (const column of JSON.parse(this.foreignKeyData.visibleColumnsForeignKey)) {
            if (column.dataField.search(/\./) < 0) {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.dataField });
            } else {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.caption });
            }
          }
        }
      }, 200);
      this.sharedService.showLoader(false);
    }
    this.listSearchFKConditions = [];
  }


  setColorLabels() {
    setTimeout(() => {
      // se establce el color del label
      for (const item of this.listItemChangeLabelColor) {
        const itemsByClass = document.getElementsByClassName(item);
        for (let i = 0; i < itemsByClass.length; i++) {
          const element = itemsByClass[i];
          const itemLabel: any = element.children[0].children[0].children[0];
          itemLabel.style.color = item.replace('DG_', '');
        }
      }
    }, 100);
  }

  onInitializedGridDetail(e: any) {
    e.component.option('columns', []);
    for (const item of this.listColumsGrid) {
      if (item.lookup) {
        if (item.lookup.dataSource.length === 0) {
          delete item.lookup;
        }
      }
      if (!item.allowEditing) {
        item.allowEditing = false;
      } else {
        // se establece el editor que tiene el control en el formulario
        const itemForm = this.listItemsForm.find(x => x.dataField === item.name.split('.')[1]);
        switch (itemForm.dataType) {
          case 'datetime':
          case 'datetime2':
          case 'smalldatetime':
            item.dataType = 'datetime';
            item.editorOptions = { ...itemForm.editorOptions };
            delete item.editorOptions.dataSource;
            item.format = item.editorOptions.displayFormat;
            break;
          case 'date':
            item.dataType = 'date';
            item.editorOptions = { ...itemForm.editorOptions };
            delete item.editorOptions.dataSource;
            item.format = item.editorOptions.displayFormat;
            break;
          case 'int':
          case 'decimal':
          case 'smallint':
          case 'numeric':
          case 'tinyint':
          case 'bigint':
          case 'number':
            item.dataType = 'number';
            item.editorOptions = { ...itemForm.editorOptions };
            delete item.editorOptions.dataSource;
            item.format = item.editorOptions.format;
            break;
          case 'bit':
            item.dataType = 'string';
            break;
          default:
            item.dataType = 'string';
            break;
        }
      }
      e.component.addColumn(item);
    }
    if (this.listPermisions.find(x => x === DELETE_ACTION)) {
      e.component.addColumn({
        width: 100,
        allowResizing: true,
        allowReordering: false,
        allowSearch: false,
        allowSorting: false,
        type: 'buttons',
        buttons: [{
          name: 'delete',
          icon: 'trash',
          visible: true,
          onClick: async (r: any) => {
            if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
              await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
              if (!this.errorValdocu) {
                //Validar formulario documento base
                if (this.mainForm.Id === this.baseDocConfig.projectBaseId) {
                  await this.deleteBasedoc(r.row.data);
                }
                //Validar formulario detalle especial
                else if (this.mainForm.Id === this.specialDetConfig.projectDetailId) {
                  await this.deleteSpecialdet(r.row.data.Reg);
                }
                else {
                  this.deleteData(r.row.data);
                }
              }
            }
            else {
              this.deleteData(r.row.data);
            }
          }
        }]
      });
    }
  }

  onPageChange(e) {
    this.page = e;
    if (this.criteria.length > 0) {
      this.listAllDataWithLike();
    } else {
      this.listAllData();
    }
  }

  onPageChangeSearch(e) {
    this.pageSearch = e;
    if (this.criteria.length > 0) {
      this.searchDataForeignKeyWithLike();
    } else {
      this.showPopupSearchFKConditions = true;
      this.searchDataForeignKey(false);
      this.showPopupSearchFKConditions = false;
    }
  }

  onRowClickSearch(e) {
    this.itemRowClickSearch = { ...e.data };
  }

  onRowClickBaseDoc(e) {
    this.itemRowClickBaseDoc = { ...e.data };
  }

  onRowClickSpecialDet(e) {
    this.itemRowClickSpecialDet = { ...e.data };
  }

  onRowDblClickSearch(e) {
    this.itemRowClickSearch = { ...e.data };
    this.setForeignKey();
    this.form.instance.getEditor(this.foreignKeyData.dataField).option('readOnly', true);
    this.form.instance.getEditor(this.foreignKeyData.dataField).option('buttons[1].options.visible', true);
    this.itemRowClickSearch = null;
    this.cleanDependencyFields(this.foreignKeyData.dataField);
  }

  onRowDblClickBaseDoc(e) {
    this.itemRowClickBaseDoc = { ...e.data };
    this.loadDetailsBaseDoc();
    this.itemRowClickBaseDoc = null;
  }

  onRowDblClickSpecialDet(e) {
    this.itemRowClickSpecialDet = { ...e.data };
    this.loadDetailsSpecialDet();
    this.itemRowClickSpecialDet = null;
  }

  onRowClick(e) {
    this.itemRowClickData = { ...e.data };
  }

  onRowDoubleClick(e) {
    if (this.editMode) {
      return;
    }
    this.editData(e);
  }

  onRowClickDataSource(e) {
    this.itemRowClickDataSource = { ...e.data };
  }

  onRowDblClickDataSource(e) {
    this.itemRowClickDataSource = { ...e.data };
    this.setDataSourceValue();
  }

  onShowingPopupDocument() {
    this.listDocuments = [];
    if (this.dataDetail[this.itemUpload.dataField]) {
      if (this.dataDetail[`OPHFU_${this.itemUpload.dataField}`].split('_OPHFU_').length > 1) {
        this.dynamicProgramsService.getDocument(+this.sessionService.session.selectedCompany.code, this.libraryId, this.dataDetail[`OPHFU_${this.itemUpload.dataField}`].split('_OPHFU_')[1]).subscribe((responseDocument: ActionResult) => {
          this.listDocuments.push(responseDocument.Result);
        }, () => {
          this.sharedService.showLoader(false);
        });
      }
    }
  }

  onToolbarPreparingSearch(e) {
    // e.toolbarOptions.items.unshift(
    //   {
    //     location: 'after',
    //     locateInMenu: 'auto',
    //     widget: 'dxSelectBox',
    //     options: {
    //       width: 120,
    //       items: [{
    //         value: SearchMethod.Equals,
    //         text: 'Igual que'
    //       }, {
    //         value: SearchMethod.StartWith,
    //         text: 'Inicia con'
    //       }, {
    //         value: SearchMethod.Contains,
    //         text: 'Contiene'
    //       }, {
    //         value: SearchMethod.EndWith,
    //         text: 'Termina con'
    //       }],
    //       displayExpr: 'text',
    //       valueExpr: 'value',
    //       value: SearchMethod.StartWith,
    //       onValueChanged: (event) => {
    //         this.searchMethod = event.value;
    //       }
    //     }
    //   },
    //   {
    //     location: 'after',
    //     locateInMenu: 'auto',
    //     widget: 'dxTextBox',
    //     options: {
    //       width: 200,
    //       onValueChanged: (event) => {
    //         this.criteria = event.value;
    //       }
    //     }
    //   }, {
    //   location: 'after',
    //   locateInMenu: 'auto',
    //   widget: 'dxButton',
    //   showText: 'inMenu',
    //   options: {
    //     icon: 'search',
    //     text: 'Buscar',
    //     hint: 'Buscar',
    //     onClick: (event) => {
    //       this.sharedService.showLoader(true);
    //       if (this.criteria.length > 0) {
    //         this.searchDataForeignKeyWithLike();
    //       } else {
    //         this.searchDataForeignKey(false);
    //       }
    //     }
    //   }
    // },
    //   {
    //     location: 'after',
    //     locateInMenu: 'auto',
    //     widget: 'dxButton',
    //     showText: 'inMenu',
    //     options: {
    //       icon: 'plus',
    //       text: 'Agregar',
    //       hint: 'Agregar',
    //       onClick: (event) => {
    //         this.openPopupAddRecordForeignKey();
    //       }
    //     }
    //   });
  }

  onToolbarPreparingBaseDoc(e) {

  }

  onToolbarPreparingSpecialDet(e) {

  }

  onHidingAddForeignKey() {
    this.searchVisible = true;
    this.searchDataForeignKey(false);
  }

  onToolbarPreparing(e) {
    // importacion de excel
    if (this.listPermisions.find(x => x === SAVE_ACTION)) {
      e.toolbarOptions.items.unshift({
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxButton',
        showText: 'inMenu',
        options: {
          icon: 'exportxlsx',
          text: 'Importar Excel',
          hint: 'Importar Excel',
          onClick: () => {
            this.showPopupImportExcel = true;
          }
        }
      });
      // se agrega el boton de guardar desde la rejilla
      if (this.metadataGrid.allowEditing) {
        e.toolbarOptions.items.unshift({
          location: 'after',
          locateInMenu: 'auto',
          widget: 'dxButton',
          showText: 'inMenu',
          options: {
            icon: 'save',
            text: 'Guardar',
            hint: 'Guardar',
            onClick: () => {
              setTimeout(() => {
                if (!this.listPermisions.find(x => x === EDIT_ACTION)) {
                  this.sharedService.warning('No tiene permiso para editar');
                  return;
                }
                const listDataModified = this.listData.filter(x => x.changeTrackerRow === 'modified');
                if (listDataModified.length === 0) {
                  this.sharedService.warning('No existen items modificados');
                  return;
                }
                this.sharedService.showLoader(true);
                const listDataUpdate = [];
                const columnsTable = this.listColumsGrid.filter(x => x.name.split('.')[0].replace('1') === this.mainForm.TableName);
                for (const row of listDataModified) {
                  const rowUpdate = {};
                  for (const key of Object.keys(row)) {
                    // se busca en las columnas para obtener el nombre del campo
                    const column = columnsTable.find(x => x.dataField === key);
                    if (!column) {
                      continue;
                    }
                    rowUpdate[column.name.split('.')[1]] = row[column.dataField];
                  }
                  listDataUpdate.push(rowUpdate);
                }
                this.dynamicProgramsService.updateDataMassive({ ProjectId: this.mainForm.Id, Details: listDataUpdate }).subscribe((response: ActionResult) => {
                  if (response.IsSucessfull) {
                    this.listAllData();
                    this.sharedService.success('Actualización Correcta');
                  } else if (response.IsError) {
                    this.sharedService.error(response.ErrorMessage);
                  } else {
                    this.sharedService.warning(response.Messages);
                  }
                  this.sharedService.showLoader(false);
                }, () => {
                  this.sharedService.error('Ocurrio un error inesperado');
                  this.sharedService.showLoader(false);
                });
              }, 300);
            }
          }
        });
      }
    }
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxSelectBox',
        options: {
          width: 120,
          items: [{
            value: SearchMethod.Equals,
            text: 'Igual que'
          }, {
            value: SearchMethod.StartWith,
            text: 'Inicia con'
          }, {
            value: SearchMethod.Contains,
            text: 'Contiene'
          }, {
            value: SearchMethod.EndWith,
            text: 'Termina con'
          }],
          displayExpr: 'text',
          valueExpr: 'value',
          value: SearchMethod.StartWith,
          onValueChanged: (event) => {
            this.searchMethod = event.value;
          }
        }
      }, {
      location: 'after',
      locateInMenu: 'auto',
      widget: 'dxTextBox',
      options: {
        width: 200,
        onValueChanged: (event) => {
          this.criteria = event.value;
        }
      }
    }, {
      location: 'after',
      locateInMenu: 'auto',
      widget: 'dxButton',
      showText: 'inMenu',
      options: {
        icon: 'search',
        text: 'Buscar',
        hint: 'Buscar',
        onClick: (event) => {
          this.sharedService.showLoader(true);
          if (this.criteria.length > 0) {
            this.listAllDataWithLike();
          } else {
            this.listAllData();
          }
        }
      }
    },
      {
        name: 'add',
        locateInMenu: 'auto',
        showText: 'inMenu',
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          text: 'Agregar',
          hint: 'Agregar Detalle',
          onClick: async () => {
            if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
              this.sharedService.warning('No tiene permiso para agregar');
              return;
            }
            if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
              await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
              if (!this.errorValdocu) {
                //Validar formulario documento base
                if (this.mainForm.Id === this.baseDocConfig.projectBaseId) {
                  this.baseDocTitle = 'Seleccionar documento base';
                  this.listSearchBasedocConditions = [];
                  //traer lista documentos base
                  await this.listBasedoc(' ');
                }
                //Validar formulario detalle especial
                else if (this.mainForm.Id === this.specialDetConfig.projectDetailId) {
                  const lcolumns = this.specialDetConfig.columns.toString();
                  lcolumns.length === 0 ? await this.listSpecialDet('', '') :
                    this.sharedService.info('Use menú contextual para agregar detalles');
                }
                else {
                  this.prepareForNewDetail();
                  this.showPopupDetail = true;
                }
              }
            }
            else {
              this.prepareForNewDetail();
              this.showPopupDetail = true;
            }
          }
        }
      },
      {
        name: 'export',
        locateInMenu: 'auto',
        showText: 'inMenu',
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'export',
          text: 'Exportar',
          hint: 'Exportar',
          onClick: () => {
            this.sharedService.showLoader(true);
            if (this.criteria.length > 0) {
              const conditions = [];
              for (const column of this.grid.instance.getVisibleColumns().map((x) => x.name)) {
                if (!column) {
                  continue;
                }
                switch (this.searchMethod) {
                  case SearchMethod.Contains:
                    conditions.push(`${column} LIKE '%${this.criteria}%'`);
                    break;
                  case SearchMethod.EndWith:
                    conditions.push(`${column} LIKE '%${this.criteria}'`);
                    break;
                  case SearchMethod.Equals:
                    conditions.push(`${column} LIKE '${this.criteria}'`);
                    break;
                  default:
                    conditions.push(`${column} LIKE '${this.criteria}%'`);
                    break;
                }
              }
              this.searchData.query = this.metadataGrid.query;
              this.searchData.like = `(${conditions.join(' OR ')})`;
            }
            this.dynamicProgramsService.listAllDataReport({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((response) => {
              FileSaver.saveAs(new Blob([response]), 'reporte.csv');
              this.sharedService.showLoader(false);
            }, () => {
              this.sharedService.showLoader(false);
            });
          }
        }
      });

  }

  onHidingSearch() {
    this.criteria = '';
    this.searchMethod = SearchMethod.StartWith;
  }

  onHidingPopup() {
    this.cleanPopup();
    this.listAllData();
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const gridEl = document.getElementById(this.gridId);
      const formEl = document.getElementById(this.formId);
      const formtotEl = document.getElementById(this.formtotId);
      const popUpEl = document.getElementById(this.popUpId);
      const gridForeignKeyEl = document.getElementById(this.gridForeignKeyId);
      const gridDataSourceEl = document.getElementById(this.gridDataSourceId);
      const gridFileEl = document.getElementById(this.gridFileId);
      const popUpForeignKeyEl = document.getElementById(this.popUpForeignKeyId);
      const popUpAddForeignKeyEl = document.getElementById(this.popUpAddForeignKeyId);
      const popUpDataSourceEl = document.getElementById(this.popUpDataSourceId);
      const popUpFileEl = document.getElementById(this.popUpFileId);
      const popUpSearchFKEl = document.getElementById(this.popUpSearchFKId);
      const popUpBaseDocEl = document.getElementById(this.popUpBaseDocId);
      const popUpSearchBaseDocEl = document.getElementById(this.popUpSearchBaseDocId);
      const popUpSearchSpecialDetEl = document.getElementById(this.popUpSearchSpecialDetId);
      const popUpConsulUbicaEl = document.getElementById(this.popUpConsulUbicaId);
      const popUpSpecialDetEl = document.getElementById(this.popUpSpecialDetId);
      const gridSearchFKEl = document.getElementById(this.gridSearchFKId);
      const gridSearchBasedocEl = document.getElementById(this.gridSearchBasedocId);
      const gridSearchSpecialdetEl = document.getElementById(this.gridSearchSpecialdetId);
      const gridConsulUbicaEl = document.getElementById(this.gridConsulUbicaId);
      const gridSpecialDetEl = document.getElementById(this.gridSpecialDetId);
      const gridBaseDocEl = document.getElementById(this.gridBaseDocId);
      const btnFuncEspec1El = document.getElementById(this.BtnFuncEspec1Id);
      const btnFuncEspec2El = document.getElementById(this.BtnFuncEspec2Id);
      const btnFuncEspec3El = document.getElementById(this.BtnFuncEspec3Id);
      const popUpMessageEl = document.getElementById(this.popUpMessageId);
      const gridMessageEl = document.getElementById(this.gridMessageId);
      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formtotEl) {
        this.stylingService.setLabelColorStyle(formtotEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formtotEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridForeignKeyEl) {
        this.stylingService.setGridHeaderColorStyle(gridForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridForeignKeyEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridDataSourceEl) {
        this.stylingService.setGridHeaderColorStyle(gridDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridDataSourceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridFileEl) {
        this.stylingService.setGridHeaderColorStyle(gridFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridFileEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpEl) {
        this.stylingService.setTitleColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpForeignKeyEl) {
        this.stylingService.setTitleColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpAddForeignKeyEl) {
        this.stylingService.setTitleColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpAddForeignKeyEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpDataSourceEl) {
        this.stylingService.setTitleColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpDataSourceEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpFileEl) {
        this.stylingService.setTitleColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpFileEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpSearchFKEl) {
        this.stylingService.setTitleColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpBaseDocEl) {
        this.stylingService.setTitleColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpSearchBaseDocEl) {
        this.stylingService.setTitleColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpSearchSpecialDetEl) {
        this.stylingService.setTitleColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchSpecialDetEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpConsulUbicaEl) {
        this.stylingService.setTitleColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpSpecialDetEl) {
        this.stylingService.setTitleColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpSpecialDetEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpMessageEl) {
        this.stylingService.setTitleColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSearchFKEl) {
        this.stylingService.setGridHeaderColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSearchBasedocEl) {
        this.stylingService.setGridHeaderColorStyle(gridSearchBasedocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSearchBasedocEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSearchSpecialdetEl) {
        this.stylingService.setGridHeaderColorStyle(gridSearchSpecialdetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSearchSpecialdetEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridConsulUbicaEl) {
        this.stylingService.setGridHeaderColorStyle(gridConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridConsulUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSpecialDetEl) {
        this.stylingService.setGridHeaderColorStyle(gridSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSpecialDetEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridBaseDocEl) {
        this.stylingService.setGridHeaderColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMessageEl) {
        this.stylingService.setGridHeaderColorStyle(gridMessageEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMessageEl, this.sessionService.session.selectedCompany.theme);
      }
      if (btnFuncEspec1El) {
        this.stylingService.setTitleColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(btnFuncEspec1El, this.sessionService.session.selectedCompany.theme);
      }
      if (btnFuncEspec2El) {
        this.stylingService.setTitleColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(btnFuncEspec2El, this.sessionService.session.selectedCompany.theme);
      }
      if (btnFuncEspec3El) {
        this.stylingService.setTitleColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(btnFuncEspec3El, this.sessionService.session.selectedCompany.theme);
      }
    }, 1);
  }

  //#endregion

  //#region Methods
  saveSucccessForeignKey() {
    this.showPopupAddForeignKey = false;
    this.searchVisible = true;
    this.searchDataForeignKey(false);
  }

  async openPopupAddRecordForeignKey() {
    const result = await this.mainFormService.getMainFormByTableName(this.mainForm.ConnectionId, this.foreignKeyData.tableNameForeignKey).toPromise();
    if (!result.IsSucessfull) {
      this.sharedService.error(result.Messages);
      return;
    }
    this.searchVisible = false;
    this.formCodeForeignKey = result.Result.ProgramCode;
    this.showPopupAddForeignKey = true;
  }

  closePopupFileUpload() {
    this.fileUploadVisible = false;
    this.listDocuments = [];
  }

  validateForeignKeys() {
    let isValid = true;
    for (const item of this.listItemsForm.filter((x) => x.isForeignKey && x.validationRules.find((y: any) => y.type === 'required'))) {
      if (this.dataDetail[item.dataField.replace(/^FK/, '')] === null) {
        this.dataDetail[item.dataField] = null;
        isValid = false;
      }
    }
    return isValid;
  }

  save() {
    if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
      this.sharedService.warning('No tiene permiso para guardar');
      return;
    }
    // se valida que las llaves foraneas requeridas tengan establecido un valor valido
    if (!this.validateForeignKeys()) {
      this.form.instance.validate();
      return;
    }
    this.formatDates();
    if (!this.form.instance.validate().isValid) {
      return;
    }
    this.sharedService.showLoader(true);
    // data que se envia al servicio
    const dataSend = { ...this.dataDetail };

    //modificar campos de auditoria
    let itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_ESTA');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = 'A';
    }
    itemForm = undefined;
    itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_UFAC');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = moment().locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
    }
    itemForm = undefined;
    itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_USUA');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = this.sessionService.session.accountCode;
    }

    for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
      dataSend[item.dataField] = dataSend[`OPHFU_${item.dataField}`];
      delete dataSend[`OPHFU_${item.dataField}`];
    }
    for (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
      delete dataSend[item.dataField];
    }

    //remplazar valores campos con datasource query
    if (this.listitemRowClickDataSource) {
      for (const item of this.listitemRowClickDataSource) {
        const field = this.listItemsDataSource.filter(x => x.dataField === item.dataField)[0];
        dataSend[field.dataField] = item.row[field.valueMember];
        delete dataSend[`DsV${field.dataField}`];
      }
    }
    for (const item of this.listItemsForm) {
      delete dataSend[`DsV${item.dataField}`];
    }

    //Quitar horas, minutos y segundos de campos fecha
    for (const item of this.listItemsForm.filter(x => x.dataType === 'datetime' && x.visible && x.editorOptions.displayFormat === 'dd-MM-yyyy')) {
      if (dataSend[item.dataField]) {
        dataSend[item.dataField] = moment(dataSend[item.dataField]).format(`${this.configService.config.datetimeFormat}T00:00:00`);
      }
    }

    this.dynamicProgramsService.saveData({ ProjectId: this.mainForm.Id, Data: dataSend }).subscribe(async (response: ActionResult) => {
      if (response.IsSucessfull) {
        this.dataDetail = { ...this.dataDetail, ...response.Result };
        // si tiene configuracion de eventos al guardar/editar
        await this.runOnSaveEvent();
        this.sharedService.success('Registro guardado correctamente');
        this.cleanPopup();
        this.listAllData();
      } else if (response.IsError) {
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.sharedService.warning(response.Messages);
      }
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    });
  }

  validate() {
    let isValid = true;
    if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
      this.sharedService.warning('No tiene permiso para guardar');
      isValid = false;
      return isValid;
    }
    this.sharedService.showLoader(true);
    // se valida que las llaves foraneas requeridas tengan establecido un valor valido
    if (!this.validateForeignKeys()) {
      this.form.instance.validate();
      isValid = false;
      return isValid;
    }
    this.formatDates();
    this.formatChecks();
    if (!this.form.instance.validate().isValid) {
      isValid = false;
      return isValid;
    }
    this.sharedService.showLoader(false);
    return isValid;
  }

  async validateEdit() {
    this.sharedService.showLoader(true);
    for await (const item of this.listItemsDataSource.filter(x => x.dataSourceType === DataSourceType.Query)) {
      if (item.params) {
        this.setWhereListData(JSON.parse(item.params));
        this.searchData.where += ` AND ${item.valueMember} = ${this.dataDetailAnt[item.dataField]}`;
      } else {
        this.searchData.where = null;
        this.searchData.where += ` WHERE ${item.valueMember} = ${this.dataDetailAnt[item.dataField]}`;
      }
      this.searchData.query = item.query;
      const response: ActionResult = await this.dynamicProgramsService.listDataFixedDataSourceO({ ProjectId: item.connectionId, Data: { ...this.searchData } }).toPromise();
      if (!response.IsSucessfull) {
        continue;
      }
      if (!response.Result) {
        continue;
      }
      const lresult = response.Result[0];
      lresult ? this.dataDetail[item.dataField] = lresult[item.valueMember] : '';
    }
    if (!this.validate()) {
      this.sharedService.showLoader(false);
      return;
    }
    await this.runOnBeforeSaveEvent(this.dataDetail, this.dataDetailAnt, 'E');
    if (this.errorBeforeSave) {
      this.sharedService.showLoader(false);
      return;
    }
    this.edit();
    this.sharedService.showLoader(false);
  }

  edit() {
    if (!this.listPermisions.find(x => x === EDIT_ACTION)) {
      this.sharedService.warning('No tiene permiso para editar');
      return;
    }
    // se valida que las llaves foraneas requeridas tengan establecido un valor valido
    if (!this.validateForeignKeys()) {
      this.form.instance.validate();
      return;
    }
    this.formatDates();
    if (!this.form.instance.validate().isValid) {
      return;
    }
    this.sharedService.showLoader(true);

    const keyData = {};

    // data que se envia al servicio    
    const dataSend = { ...this.dataDetail };

    //modificar campos de auditoria
    let itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_ESTA');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = 'M';
    }
    itemForm = undefined;
    itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_UFAC');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = moment().locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
    }
    itemForm = undefined;
    itemForm = this.listItemsForm.find(x => x.dataField === 'AUD_USUA');
    if (itemForm !== undefined) {
      dataSend[itemForm.dataField] = this.sessionService.session.accountCode;
    }

    // se eliminan los campos temporales para almacenar el nombre del archivo
    for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
      dataSend[item.dataField] = dataSend[`OPHFU_${item.dataField}`];
      delete dataSend[`OPHFU_${item.dataField}`];
    }
    for (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
      delete dataSend[item.dataField];
    }
    for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
      keyData[item.Name] = this.dataDetail[item.Name];
    }

    //remplazar valores campos con datasource query
    if (this.listitemRowClickDataSource) {
      for (const item of this.listitemRowClickDataSource) {
        const field = this.listItemsDataSource.filter(x => x.dataField === item.dataField)[0];
        dataSend[field.dataField] = item.row[field.valueMember];
        delete dataSend[`DsV${field.dataField}`];
      }
    }
    for (const item of this.listItemsForm) {
      delete dataSend[`DsV${item.dataField}`];
    }

    //Quitar horas, minutos y segundos de campos fecha
    for (const item of this.listItemsForm.filter(x => x.dataType === 'datetime' && x.visible && x.editorOptions.displayFormat === 'dd-MM-yyyy')) {
      if (dataSend[item.dataField]) {
        dataSend[item.dataField] = moment(dataSend[item.dataField]).format(`${this.configService.config.datetimeFormat}T00:00:00`);
      }
    }

    this.dynamicProgramsService.updateData({ ProjectId: this.mainForm.Id, Data: dataSend, KeyData: keyData, DataAnt: this.dataDetailAnt }).subscribe(async (response: ActionResult) => {
      if (response.IsSucessfull) {
        // si tiene configuracion de eventos al guardar/editar
        await this.runOnSaveEvent();
        this.sharedService.success('Registro actualizado correctamente');
        this.cleanPopup();
        this.listAllData();
        this.listAllTotal();
      } else if (response.IsError) {
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.sharedService.warning(response.Messages);
      }
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    });
  }

  async ValModifDocu(pAccion: number, pPro_codi: string, pTab_prin: string, pMensaje: boolean) {
    if (this.listVarsTransaction.toString().length === 0) {
      this.sharedService.showLoader(false);
      this.sharedService.error('Pendiente definir variables formulario transacción');
      this.errorValdocu = true;
      return;
    }
    //Si formulario esta dentro de excepciones, no validar estado
    if (this.listExceptDetail.filter(x => x.ProjectId === this.mainForm.Id).length > 0) {
      this.errorValdocu = false;
      return;
    }
    this.errorValdocu = false;
    const dataRest: any = {};
    dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
    dataRest['top_codi'] = this.dataMaster['TOP_CODI'] && this.parentMainForm.Transaccion === 'S' ? this.dataMaster['TOP_CODI'] : 0;
    dataRest['usu_codi'] = this.sessionService.session.accountCode;
    dataRest['pro_codi'] = pPro_codi;
    dataRest['tab_prin'] = pTab_prin;
    dataRest['cam_cons'] = this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value;
    dataRest['val_cons'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
    dataRest['cam_esta'] = this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value;
    dataRest['val_esed'] = this.listVarsTransaction.filter(x => x.Name === 'P_VEstaEd')[0].Value;
    dataRest['val_esap'] = this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAp')[0].Value;
    dataRest['val_esan'] = this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAn')[0].Value;
    dataRest['val_esre'] = this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0].Value;
    dataRest['accion'] = pAccion;
    try {
      const url = `${this.configService.config.urlWsGnGenerFuncs}ValModifDocu`;
      const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
      if (!resultEvent.IsSucessfull) {
        this.sharedService.showLoader(false);
        pMensaje ? this.sharedService.error(resultEvent.ErrorMessage) : '';
        this.errorValdocu = true;
        return;
      }
      else {
        this.errorValdocu = false;
      }
      this.sharedService.showLoader(false);
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al realizar validaciones modificacion de documento.');
      }, 1000);
    }
  }

  async listBasedoc(pWhere: string) {
    const item = this.baseDocConfig.origins.filter(x => x.value === this.dataMaster[this.baseDocConfig.field])[0];
    if (item !== undefined) {
      const dataRest: any = {};
      dataRest['program'] = this.baseDocConfig.program;
      dataRest['origin'] = item.value;
      dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
      dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
      dataRest['where'] = pWhere;
      try {
        this.sharedService.showLoader(true);
        const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/ListBaseDoc`;
        const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
        if (!resultEvent.IsSucessfull) {
          this.sharedService.showLoader(false);
          this.sharedService.error(resultEvent.ErrorMessage);
          return;
        }
        else {
          this.listDataBaseDoc = resultEvent.Result;
          this.searchBaseDoc = true;
          setTimeout(() => {
            this.baseDocGrid.instance.option('columns', []);
            this.baseDocGrid.instance.addColumn({ caption: 'Tipo operación', dataField: 'top_codi' });
            this.baseDocGrid.instance.addColumn({ caption: 'Nombre tipo operación', dataField: 'top_nomb' });
            this.baseDocGrid.instance.addColumn({ caption: 'Número', dataField: 'bas_nume' });
            this.baseDocGrid.instance.addColumn({ caption: 'Fecha', dataField: 'bas_fech' });
            this.baseDocGrid.instance.addColumn({ caption: 'Tercero', dataField: 'ter_coda' });
            this.baseDocGrid.instance.addColumn({ caption: 'Nombre Tercero', dataField: 'ter_noco' });
            this.baseDocGrid.instance.addColumn({ caption: 'Sucursal', dataField: 'arb_codi' });
            this.baseDocGrid.instance.addColumn({ caption: 'Nombre Sucursal', dataField: 'arb_nomb' });
          }, 200);
        }
        this.sharedService.showLoader(false);
      }
      catch (error) {
        setTimeout(() => {
          this.sharedService.error('Error al consultar documentos base.');
          this.sharedService.showLoader(false);
        }, 1000);
      }
    }
    else {
      this.sharedService.warning('Pendiente definir manejo de documento base para el tipo');
      return;
    }
  }

  async loadDetailsBaseDoc() {
    const item = this.baseDocConfig.origins.filter(x => x.value === this.dataMaster[this.baseDocConfig.field])[0];
    if (item !== undefined) {
      const dataRest: any = {};
      dataRest['program'] = this.baseDocConfig.program;
      dataRest['method'] = item.method;
      dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
      dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
      dataRest['bas_cont'] = this.itemRowClickBaseDoc['bas_cont'];
      try {
        this.sharedService.showLoader(true);
        const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/LoadDetails`;
        const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
        if (!resultEvent.IsSucessfull) {
          this.sharedService.showLoader(false);
          this.sharedService.error(resultEvent.ErrorMessage);
          this.searchBaseDoc = false;
          return;
        }
        else {
          this.listAllData(); //reconsulta doc base
          this.searchBaseDoc = false;
        }
        this.sharedService.showLoader(false);
      }
      catch (error) {
        setTimeout(() => {
          this.sharedService.error('Error al heredar documento base.');
          this.sharedService.showLoader(false);
          return;
        }, 1000);
      }
    }
    else {
      this.sharedService.warning('Pendiente definir manejo de documento base para el tipo');
      return;
    }
  }

  async deleteBasedoc(row: any) {
    if (await this.sharedService.confirm()) {
      const item = this.baseDocConfig.origins.filter(x => x.value === this.dataMaster[this.baseDocConfig.field])[0];
      if (item !== undefined) {
        const dataRest: any = {};
        dataRest['program'] = this.baseDocConfig.program;
        dataRest['origin'] = item.value;
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
        const listConditionsKey = [];
        for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
          const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
          listConditionsKey.push(`${item.Name}='${row[column.dataField]}'`);
        }
        dataRest['where'] = ` WHERE ${listConditionsKey.join(' AND ')}`;
        try {
          this.sharedService.showLoader(true);
          const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/DeleteBaseDoc`;
          const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
          if (!resultEvent.IsSucessfull) {
            this.sharedService.showLoader(false);
            this.sharedService.error(resultEvent.ErrorMessage);
            return;
          }
          else {
            this.listAllData(); //reconsulta doc base
          }
          this.sharedService.showLoader(false);
        }
        catch (error) {
          setTimeout(() => {
            this.sharedService.error('Error al eliminar documento base.');
            this.sharedService.showLoader(false);
            return;
          }, 1000);
        }
      }
      else {
        this.sharedService.warning('Pendiente definir manejo de documento base para el tipo');
        return;
      }
    }
  }

  async deleteSpecialdet(dtr_cont: number) {
    if (await this.sharedService.confirm()) {
      const dataRest: any = {};
      dataRest['program'] = this.specialDetConfig.program;
      dataRest['method'] = this.specialDetConfig.methodD;
      dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
      dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
      dataRest['dtr_cont'] = dtr_cont;
      // const listConditionsKey = [];
      // for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
      //   const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
      //   listConditionsKey.push(`${item.Name}='${row[column.dataField]}'`);
      // }
      // dataRest['where'] = ` WHERE ${listConditionsKey.join(' AND ')}`;
      try {
        this.sharedService.showLoader(true);
        const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/DeleteSpecialDet`;
        const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
        if (!resultEvent.IsSucessfull) {
          this.sharedService.showLoader(false);
          this.sharedService.error(resultEvent.ErrorMessage);
          return;
        }
        else {
          this.listAllData(); //reconsulta doc base
        }
        this.sharedService.showLoader(false);
      }
      catch (error) {
        setTimeout(() => {
          this.sharedService.error('Error al eliminar detalle especial.');
          this.sharedService.showLoader(false);
          return;
        }, 1000);
      }
    }
  }

  async listSpecialDet(pWhere: string, pType: string) {
    const dataRest: any = {};
    dataRest['program'] = this.specialDetConfig.program;
    dataRest['method'] = this.specialDetConfig.methodC;
    dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
    dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
    dataRest['origin'] = pType;
    dataRest['where'] = pWhere;
    try {
      this.sharedService.showLoader(true);
      const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/ListSpecialDet`;
      const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
      if (!resultEvent.IsSucessfull) {
        this.sharedService.showLoader(false);
        this.sharedService.error(resultEvent.ErrorMessage);
        return;
      }
      else {
        this.DataSpecialDet = resultEvent.Result;
        const ltitles = this.DataSpecialDet[0].titles;
        const ltypes = this.DataSpecialDet[2].types;
        const titles = ltitles.split('|');
        const types = ltypes.split('|');
        this.listDataSpecialDet = [];
        for (const item of this.DataSpecialDet.filter(x => x.value !== undefined)) {
          let obj = '';
          const valores = item.value.split('|');
          for (var i = 0; i < titles.length; i++) {
            types[i] === 'N' ? obj += `"${titles[i]}" : ${valores[i]},` : obj += `"${titles[i]}" : "${valores[i]}",`
          }
          obj = `{${obj.substring(0, obj.length - 1)}}`;
          this.listDataSpecialDet.push(JSON.parse(obj));
        }
        this.searchSpecialDet = true;
        setTimeout(() => {
          //
        }, 200);
      }
      this.sharedService.showLoader(false);
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al consultar detalles para transaccion.');
        this.sharedService.showLoader(false);
      }, 1000);
    }
  }

  async loadDetailsSpecialDet() {
    const dataRest: any = {};
    dataRest['program'] = this.specialDetConfig.program;
    dataRest['method'] = this.specialDetConfig.methodI;
    dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
    dataRest['tra_cont'] = this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
    dataRest['dtr_cont'] = this.itemRowClickSpecialDet['Consecutivo'];
    dataRest['origin'] = this.gItem;
    try {
      this.sharedService.showLoader(true);
      const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/AssignSpecialDet`;
      const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
      if (!resultEvent.IsSucessfull) {
        this.sharedService.showLoader(false);
        this.sharedService.error(resultEvent.ErrorMessage);
        this.searchSpecialDet = false;
        return;
      }
      else {
        this.listAllData(); //reconsulta doc base
        this.searchSpecialDet = false;
      }
      this.sharedService.showLoader(false);
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al asignar detalle especial.');
        this.sharedService.showLoader(false);
        return;
      }, 1000);
    }
  }

  formatDates() {
    for (const date of this.listItemsForm.filter((x) => x.editorType === 'dxDateBox')) {
      if (this.dataDetail[date.dataField]) {
        this.dataDetail[date.dataField] = moment(this.dataDetail[date.dataField]).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
      }
    }
  }

  formatChecks() {
    for (const valor of this.listItemsForm.filter((x) => x.editorType === 'dxCheckBox')) {
      if (this.dataDetail[valor.dataField] === true) {
        this.dataDetail[valor.dataField] = 'S'
      }
      else {
        this.dataDetail[valor.dataField] = 'N'
      }
    }
  }

  async editData(row: any) {
    const listConditionsKey = [];
    for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
      const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
      listConditionsKey.push(`${item.Name}='${row.data[column.dataField]}'`);
    }
    this.searchData.where = ` WHERE ${listConditionsKey.join(' AND ')}`;
    const resultData: ActionResult = await this.dynamicProgramsService.getByPrimaryKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
    this.listitemRowClickDataSource = [];
    this.editMode = true;
    this.setToolbarItemsMasterDetailPopup();
    setTimeout(async () => {
      this.showMasterDetail = this.mainForm.UseMasterDetail;
      this.dataDetail = resultData.Result;
      this.dataDetailAnt = Object.assign({}, this.dataDetail);
      this.showPopupDetail = true;
      this.setDisplayFileUpload();
      for await (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
        if (this.dataDetail[item.dataField.replace(/^FK/, '')] === null) {
          continue;
        }

        if (item.dataField === 'FKEMP_CODI') {
          this.dataDetail[item.dataField] = this.dataDetail[item.dataField.replace(/^FK/, '')];
        }
        else {
          const listConditions = [];
          const listValueMember = item.valueMemberForeignKey.split(';');
          const listValueMemberParent = item.valueMemberParentKey.split(';');
          const lalias = JSON.parse(item.joinsForeignKey)[0].tableAlias;

          for (let i = 0; i < listValueMember.length; i++) {
            const element = listValueMember[i];
            if (element.length > 0) {
              listConditions.push(`${lalias}.${element}='${this.dataDetail[listValueMemberParent[i]]}'`);
            }
            //listConditions.push(`${element}='${this.dataDetail[listValueMemberParent[i]]}'`);
          }
          this.searchData.select = item.displayMemberForeignKey.replace(/;/g, ',');
          this.setJoinsListData(JSON.parse(item.joinsForeignKey));
          this.searchData.where = listConditions.join(' AND ');
          this.searchData.tableName = item.tableNameAliasForeignKey;
          const response: ActionResult = await this.dynamicProgramsService.getItemDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();

          if (!response.IsSucessfull) {
            continue;
          }
          if (item.displayMemberForeignKey) {
            const displayMember = [];
            for (let itemDisplay of item.displayMemberForeignKey.split(';')) {
              itemDisplay = itemDisplay.substring(itemDisplay.indexOf('.') + 1, itemDisplay.length);
              displayMember.push(response.Result[itemDisplay]);
            }
            this.dataDetail[`${item.dataField}`] = displayMember.join(' | '); //se modifica separador
          } else {
            this.dataDetail[`${item.dataField}`] = response.Result[item.valueMemberForeignKey.split(';')[0]];
          }
          const fieldTmp = this.form.instance.getEditor(item.dataField);
          if (fieldTmp && fieldTmp.option('buttons')) {
            if (this.dataDetail[item.dataField]) {
              setTimeout(() => {
                if (fieldTmp && fieldTmp.option('buttons')) {
                  fieldTmp.option ? fieldTmp.option('readOnly', true) : '';
                  fieldTmp.option ? fieldTmp.option('buttons[1].options.visible', true) : '';
                }
              }, 300);
            }
          }
        }
      }
      //modificar campos datasource query
      for await (const itemD of this.listItemsDataSource.filter(x => x.dataSourceType === DataSourceType.Query)) {
        if (itemD.params) {
          this.setWhereListData(JSON.parse(itemD.params));
          this.searchData.where += ` AND ${itemD.valueMember} = ${this.dataDetail[itemD.dataField]}`;
        } else {
          this.searchData.where = null;
          this.searchData.where += ` WHERE ${itemD.valueMember} = ${this.dataDetail[itemD.dataField]}`;
        }
        this.searchData.query = itemD.query;
        const response: ActionResult = await this.dynamicProgramsService.listDataFixedDataSourceO({ ProjectId: itemD.connectionId, Data: { ...this.searchData } }).toPromise();
        if (!response.IsSucessfull) {
          continue;
        }
        if (!response.Result) {
          continue;
        }
        const lresult = response.Result[0];
        this.dataDetail[`DsV${itemD.dataField}`] = this.dataDetail[itemD.dataField];
        this.dataDetail[itemD.dataField] = lresult[itemD.valueShow];
      }
    }, 500);
  }

  async deleteData(row: any) {
    if (!this.listPermisions.find(x => x === DELETE_ACTION)) {
      this.sharedService.warning('No tiene permiso para eliminar');
      return;
    }
    this.editMode = true;
    if (await this.sharedService.confirm()) {
      this.sharedService.showLoader(true);
      const listConditionsKey = [];
      for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
        const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
        listConditionsKey.push(`${item.Name}='${row[column.dataField]}'`);
      }
      this.searchData.where = ` WHERE ${listConditionsKey.join(' AND ')}`;
      //Validar borrado de tablas dependientes
      await this.BeforeDelete();
      if (!this.errorDelete) {
        const resultData: ActionResult = await this.dynamicProgramsService.getByPrimaryKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
        this.dynamicProgramsService.deleteData({ ProjectId: this.mainForm.Id, Data: resultData.Result }).subscribe((response: ActionResult) => {
          if (response.IsSucessfull) {
            this.sharedService.success('Registro eliminado correctamente');
            this.listAllData();
          } else if (response.IsError) {
            this.sharedService.error(response.ErrorMessage);
          } else {
            this.sharedService.warning(response.Messages);
          }
          this.cleanPopup();
          this.sharedService.showLoader(false);
        }, () => {
          this.sharedService.error('Ocurrio un error inesperado');
          this.sharedService.showLoader(false);
        });
      }
    } else {
      this.editMode = false;
    }
  }

  setJoinsListData(listJoins: any[]) {
    const listJoinsSend: any[] = [];
    let table_ant = '';
    let table_ini = '';
    for (const item of listJoins) {
      if (listJoins.indexOf(item) === 0) {
        listJoinsSend.push(`${item.table} ${item.tableAlias} `);
        table_ini = item.tableAlias;
      } else {
        if (table_ant !== item.tableAlias) {
          if (item.originField.length > 8) {
            listJoinsSend.push(`LEFT JOIN ${item.table} ${item.tableAlias} ON ${item.originField} = ${item.destinationField} `);
          }
          else {
            listJoinsSend.push(`LEFT JOIN ${item.table} ${item.tableAlias} ON ${table_ini}.${item.originField} = ${item.tableAlias}.${item.destinationField} `);
          }
        }
        else {
          if (item.originField.length > 8) {
            listJoinsSend.push(`AND ${item.originField} = ${item.destinationField} `);
          }
          else {
            listJoinsSend.push(`AND ${table_ini}.${item.originField} = ${item.tableAlias}.${item.destinationField} `);
          }
        }
        table_ant = item.tableAlias;
      }
    }
    this.searchData.joins = listJoinsSend.join('');
  }

  setParamsDataSourceService(listParams: any[], url: string) {
    const listParamsSend: any[] = [];
    for (const param of listParams) {
      if (param.text.startsWith('{')) {
        const dataFieldTmp = param.text.replace('{', '').replace('}', '');
        const fieldTmp = this.listItemsForm.find((x) => x.dataField === dataFieldTmp);
        if (!fieldTmp) {
          this.sharedService.warning(`El campo ${dataFieldTmp} no existe en el formulario`);
          this.dataSourceVisible = false;
          return;
        }
        if (!this.dataDetail[dataFieldTmp]) {
          this.dataSourceVisible = false;
          this.sharedService.warning(`El parametro ${fieldTmp.label.text} no tiene valor establecido`);
          return;
        }

        let value = this.dataDetail[dataFieldTmp];
        // si se debe obtener desde un control de fecha
        if (value instanceof Date) {
          value = moment(value).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
        }
        listParamsSend.push(`${param.value}=${value}`);
      } else {

        switch (param.text) {
          case 'getUserCode()':
            listParamsSend.push(`${param.value}=${this.sessionService.session.accountCode}`);
            break;
          case 'getCompany()':
            listParamsSend.push(`${param.value}=${this.sessionService.session.selectedCompany.code}`);
            break;
          case 'getRol()':
            listParamsSend.push(`${param.value}=${this.sessionService.session.roleCode}`);
            break;
          case 'getDate()':
            listParamsSend.push(`${param.value}=${moment().locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`)}`);
            break;
          default:
            listParamsSend.push(`${param.value}=${param.text}`);
            break;
        }
      }
    }
    if (listParams.length > 0) {
      url = `${url}?${listParamsSend.join('&')}`;
    }

    return url;
  }

  setWhereListData(listConditions: any[]): boolean {
    let where = '';
    for (let i = 0; i < listConditions.length; i++) {
      const element = listConditions[i];
      if (element.value.startsWith('{')) {

        // se comprueba que el campo exista en el formulario
        const dataFieldTmp = element.value.replace('{', '').replace('}', '').replace('?', '');
        const fieldTmp = this.listItemsForm.find((x) => x.dataField.replace(/^FK/, '') === dataFieldTmp);
        if (!fieldTmp) {
          this.sharedService.warning(`El campo ${dataFieldTmp} no existe en el formulario`);
          this.searchVisible = false;
          this.dataSourceVisible = false;
          return false;
        }
        // si el value termina con signo de pregunta lo vuelve opcional y se establece en null su valor
        if (!element.value.endsWith('?')) {
          if (!this.dataDetail[dataFieldTmp]) {
            this.sharedService.warning(`El parametro ${fieldTmp.label.text} no tiene valor establecido`);
            this.searchVisible = false;
            this.dataSourceVisible = false;
            return false;
          }
          let value = this.dataDetail[dataFieldTmp];
          // si se debe obtener desde un control de fecha
          if (value instanceof Date) {
            value = moment(value).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
          }
          where += `${element.field}${element.operator}'${value}' ${element.operatorUnion} `;
        } else if (this.dataDetail[dataFieldTmp] === undefined || this.dataDetail[dataFieldTmp] === null) {
          if (element.operator === '=') {
            where += `${element.field} IS NULL ${element.operatorUnion} `;
          } else {
            where += `${element.field} IS NOT NULL ${element.operatorUnion} `;
          }
        } else {
          // si tiene valor
          let value = this.dataDetail[dataFieldTmp];
          // si se debe obtener desde un control de fecha
          if (value instanceof Date) {
            value = moment(value).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
          }
          where += `${element.field}${element.operator}'${value}' ${element.operatorUnion} `;
        }

      } else {
        switch (element.value) {
          case 'getUserCode()':
            where += `${element.field}${element.operator}'${this.sessionService.session.accountCode}' ${element.operatorUnion} `;
            break;
          case 'getCompany()':
            where += `${element.field}${element.operator}'${this.sessionService.session.selectedCompany.code}' ${element.operatorUnion} `;
            break;
          case 'getRol()':
            where += `${element.field}${element.operator}'${this.sessionService.session.roleCode}' ${element.operatorUnion} `;
            break;
          case 'getDate()':
            where += `${element.field}${element.operator} ${element.value} ${element.operatorUnion} `;
            break;
          default:
            if (element.value.toUpperCase() === 'NULL') {
              if (element.operator === '=') {
                where += `${element.field} IS NULL ${element.operatorUnion} `;
              } else {
                where += `${element.field} IS NOT NULL ${element.operatorUnion} `;
              }
            } else {
              if (element.operator !== 'IN' && element.operator !== 'LIKE' && element.operator !== 'NOT LIKE') {
                // si tiene un punto se entiende que es un campo de los joins
                //if (element.value.search(/\./) < 0) {
                if (element.type === 'S' || element.type === undefined) {
                  where += `${element.field} ${element.operator} '${element.value}' ${element.operatorUnion} `;
                } else if (element.type === 'D') {
                  const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                  const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                  where += `${lfield} ${element.operator} '${lvalue}' ${element.operatorUnion} `;
                }
                else {
                  where += `${element.field} ${element.operator} ${element.value} ${element.operatorUnion} `;
                }
              }
              else {
                if (element.operator === 'IN') {
                  //Verificar si campo ya fue incluido
                  if (where.includes(element.field)) {
                    //if (element.value.search(/\./) < 0) {
                    if (element.type === 'S' || element.type === undefined) {
                      where = where.replace(`${element.field} IN (`, `${element.field} IN ('${element.value}',`)
                    } else if (element.type === 'D') {
                      const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                      const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                      where = where.replace(`${lfield} IN (`, `${lfield} IN ('${lvalue}',`)
                    }
                    else {
                      where = where.replace(`${element.field} IN (`, `${element.field} IN (${element.value},`)
                    }
                  }
                  else {
                    //if (element.value.search(/\./) < 0) {
                    if (element.type === 'S' || element.type === undefined) {
                      where += `${element.field} IN ('${element.value}') ${element.operatorUnion} `
                    } else if (element.type === 'D') {
                      const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                      const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                      where += `${lfield} IN ('${lvalue}') ${element.operatorUnion} `
                    }
                    else {
                      where += `${element.field} IN (${element.value}) ${element.operatorUnion} `
                    }
                  }
                }
                else if (element.operator === 'LIKE' || element.operator === 'NOT LIKE') {
                  if (element.type === 'S' || element.type === undefined) {
                    where += `${element.field} ${element.operator} '%${element.value}%' ${element.operatorUnion} `;
                  } else if (element.type === 'D') {
                    const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                    const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                    where += `${lfield} ${element.operator} '%${lvalue}%' ${element.operatorUnion} `;
                  }
                  else {
                    where += `${element.field} ${element.operator} %${element.value}% ${element.operatorUnion} `;
                  }
                }
              }
            }
            break;
        }
      }
    }
    //filtros qbe de lupa
    if (this.showPopupSearchFKConditions) {
      for (let i = 0; i < this.listSearchFKConditions.length; i++) {
        const element = this.listSearchFKConditions[i];
        if (element.value.length > 0) {
          if (element.operator !== 'IN' && element.operator !== 'LIKE' && element.operator !== 'NOT LIKE') {
            //if (element.value.search(/\./) < 0) {
            if (element.type === 'S' || element.type === undefined) {
              where += `${element.field} ${element.operator} '${element.value}' ${element.operatorUnion} `;
            } else if (element.type === 'D') {
              const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
              const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
              where += `${lfield} ${element.operator} '${lvalue}' ${element.operatorUnion} `;
            }
            else {
              where += `${element.field} ${element.operator} ${element.value} ${element.operatorUnion} `;
            }
          }
          else {
            if (element.operator === 'IN') { //manejo de IN lupa
              if (element.type === 'S' || element.type === undefined) {
                where += `${element.field} IN ('${element.value}') ${element.operatorUnion} `
              } else if (element.type === 'D') {
                const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                where += `${lfield} IN ('${lvalue}') ${element.operatorUnion} `;
              }
              else {
                where += `${element.field} IN (${element.value}) ${element.operatorUnion} `
              }
            }
            else if (element.operator === 'LIKE' || element.operator === 'NOT LIKE') {
              if (element.type === 'S' || element.type === undefined) {
                where += `${element.field} ${element.operator} '%${element.value}%' ${element.operatorUnion} `;
              } else if (element.type === 'D') {
                const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                where += `${lfield} ${element.operator} '%${lvalue}%' ${element.operatorUnion} `;
              }
              else {
                where += `${element.field} ${element.operator} %${element.value}% ${element.operatorUnion} `;
              }
            }
          }
        }
      }
    }
    if (where.endsWith('OR ')) {
      where = where.substring(0, where.lastIndexOf('OR'));
    }
    if (where.endsWith('AND ')) {
      where = where.substring(0, where.lastIndexOf('AND'));
    }
    if (where.length === 0) {
      this.searchData.where = null;
    } else {
      this.searchData.where = where;
    }

    return true;
  }
  //#endregion

  configSearchDataForeignKey(conditions: string) {
    let resultSetWhereListData = true;
    if (conditions) {
      resultSetWhereListData = this.setWhereListData(JSON.parse(conditions));
    } else {
      this.searchData.where = null;
    }
    if (!resultSetWhereListData) {
      return false;
    }
    if (this.foreignKeyData.joinsForeignKey) {
      this.setJoinsListData(JSON.parse(this.foreignKeyData.joinsForeignKey));
    } else {
      this.searchData.joins = null;
    }

    const listFields: any[] = [];
    const ltable = JSON.parse(this.foreignKeyData.joinsForeignKey)[0].table;
    const lalias = JSON.parse(this.foreignKeyData.joinsForeignKey)[0].tableAlias;
    // se agregan los campos al select
    if (this.foreignKeyData.visibleColumnsForeignKey) {

      for (const column of JSON.parse(this.foreignKeyData.visibleColumnsForeignKey)) {
        if (column.dataField.search(/\./) < 0) {
          if (this.foreignKeyData.tableNameAliasForeignKey) {
            listFields.push(` ${this.foreignKeyData.tableNameAliasForeignKey}.${column.dataField} `);
          } else {
            listFields.push(` ${this.foreignKeyData.tableNameForeignKey}.${column.dataField} `);
          }
        } else {
          column.caption ? listFields.push(` ${column.dataField} '${column.caption}'`) : listFields.push(` ${column.dataField}`);
        }
      }
    }
    // se agregan los campos que forman la llave primaria
    for (const item of this.foreignKeyData.displayMemberForeignKey.split(';')) {
      // if (this.foreignKeyData.tableNameAliasForeignKey) {
      //   listFields.push(` ${this.foreignKeyData.tableNameAliasForeignKey}.${item} `);
      // } else {
      //   listFields.push(` ${this.foreignKeyData.tableNameForeignKey}.${item} `);
      // }
      listFields.push(item);
    }
    if (this.foreignKeyData.tableNameAliasForeignKey) {
      this.searchData.tableName = `${ltable} ${lalias}`;
      // (this.foreignKeyData.valueMemberForeignKey.split(';')[1] !== this.foreignKeyData.valueMemberForeignKey.split(';')[0])
      //   && (this.foreignKeyData.valueMemberForeignKey.split(';')[1].length > 0) ?
      //   this.searchData.orderBy = ` ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]} ,
      // ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[1]}` :
      //   this.searchData.orderBy = ` ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]}`;
      this.searchData.orderBy = '';
      const lfields = this.foreignKeyData.valueMemberForeignKey.split(';').filter((item, index) => { return this.foreignKeyData.valueMemberForeignKey.split(';').indexOf(item) === index; });
      for (const item of lfields) {
        item.length > 0 ? this.searchData.orderBy += ` ${lalias}.${item} ,` : '';
      }
      this.searchData.orderBy = this.searchData.orderBy.substring(0, this.searchData.orderBy.length - 1);
    } else {
      this.searchData.tableName = ltable;
      // (this.foreignKeyData.valueMemberForeignKey.split(';')[1] !== this.foreignKeyData.valueMemberForeignKey.split(';')[0])
      //   && (this.foreignKeyData.valueMemberForeignKey.split(';')[1].length > 0) ?
      //   this.searchData.orderBy = ` ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]} ,
      // ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[1]}` :
      //   this.searchData.orderBy = ` ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]}`;
      this.searchData.orderBy = '';
      const lfields = this.foreignKeyData.valueMemberForeignKey.split(';').filter((item, index) => { return this.foreignKeyData.valueMemberForeignKey.split(';').indexOf(item) === index; });
      for (const item of lfields) {
        item.length > 0 ? this.searchData.orderBy += ` ${ltable}.${item} ,` : '';
      }
      this.searchData.orderBy = this.searchData.orderBy.substring(0, this.searchData.orderBy.length - 1);
    }
    if (listFields.indexOf(this.searchData.orderBy) === -1) {
      listFields.push(this.searchData.orderBy);
    }
    this.searchData.select = listFields.join(',');
    this.searchData.pageNumber = this.pageSearch;
    this.searchData.pageSize = 10;
    if (this.foreignKeyData.subQuery) {
      let lcadena = '';
      JSON.parse(this.foreignKeyData.subQuery).query ? lcadena = JSON.parse(this.foreignKeyData.subQuery).query : lcadena = '';
      if (lcadena.includes('getUserCode()')) {
        lcadena = lcadena.replace('getUserCode()', `'${this.sessionService.session.accountCode}'`);
      }
      if (lcadena.includes('{{')) { // tiene parametros de maestro
        let lpos1 = lcadena.indexOf('{{');
        let lpos2 = lcadena.indexOf('}}');
        while (lpos1 !== -1) {
          const lvar = lcadena.substring(lpos1, lpos2 + 2);
          const lfield = lcadena.substring(lpos1 + 2, lpos2);
          let lvalor = this.dataMaster[lfield.replace(/^FK/, '')];
          //obtener el tipo de variables
          const ltype = this.listItemsFormMaster.filter(z => z.dataField.replace(/^FK/, '') === lfield)[0].dataType;
          switch (ltype) {
            case 'datetime':
            case 'datetime2':
            case 'smalldatetime':
            case 'date':
              lvalor = `${moment(lvalor).locale('es-CO').format('DD/MM/YYYY')}`;
              lvalor = `'${lvalor.substr(6, 4)}${lvalor.substr(3, 2)}${lvalor.substr(0, 2)}'`;
              break;
            case 'int':
            case 'decimal':
            case 'smallint':
            case 'numeric':
            case 'tinyint':
            case 'bigint':
            case 'number':
              break;
            case 'bit':
              break;
            default:
              lvalor = `'${lvalor}'`;
              break;
          }
          lcadena = lcadena.replace(lvar, lvalor);
          lpos1 = lcadena.indexOf('{{', lpos2 + 2);
          lpos2 = lcadena.indexOf('}}', lpos1 + 2);
        }
        if (lcadena.includes('undefined')) {
          this.sharedService.error(`No se han definido valores necesarios para incluir subconsulta`);
          return false;
        }
      }
      if (lcadena.includes('{')) { // tiene parametros de detalle
        let lpos1 = lcadena.indexOf('{');
        let lpos2 = lcadena.indexOf('}');
        while (lpos1 !== -1) {
          const lvar = lcadena.substring(lpos1, lpos2 + 1);
          const lfield = lcadena.substring(lpos1 + 1, lpos2);
          let lvalor = this.dataDetail[lfield.replace(/^FK/, '')];
          //obtener el tipo de variables
          const ltype = this.listItemsForm.filter(z => z.dataField.replace(/^FK/, '') === lfield)[0].dataType;
          switch (ltype) {
            case 'datetime':
            case 'datetime2':
            case 'smalldatetime':
            case 'date':
              lvalor = `${moment(lvalor).locale('es-CO').format('DD/MM/YYYY')}`;
              lvalor = `'${lvalor.substr(6, 4)}${lvalor.substr(3, 2)}${lvalor.substr(0, 2)}'`;
              break;
            case 'int':
            case 'decimal':
            case 'smallint':
            case 'numeric':
            case 'tinyint':
            case 'bigint':
            case 'number':
              break;
            case 'bit':
              break;
            default:
              lvalor = `'${lvalor}'`;
              break;
          }
          lcadena = lcadena.replace(lvar, lvalor);
          lpos1 = lcadena.indexOf('{', lpos2 + 1);
          lpos2 = lcadena.indexOf('}', lpos1 + 1);
        }
        if (lcadena.includes('undefined')) {
          this.sharedService.error(`No se han definido valores necesarios para incluir subconsulta`);
          return false;
        }
      }
      this.searchData.where += lcadena;
    }
    return true;
  }

  async searchDataForeignKeyOnlyRecord() {
    this.searchData.query = null;
    this.searchData.queryCount = null;
    this.searchData.like = null;
    this.searchData.pageSize = 10;
    this.listDataForeignKey = null;
    if (!this.foreignKeyData.whereForeignKeyOnlyRecord) {
      this.sharedService.showLoader(false);
      return;
    }
    if (!this.configSearchDataForeignKey(this.foreignKeyData.whereForeignKeyOnlyRecord)) {
      return;
    }
    const response: ActionResult = await this.dynamicProgramsService.listDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
    if (response.IsSucessfull) {
      if (response.Result && response.Result.Data && response.Result.Data.length > 0) {
        this.itemRowClickSearch = response.Result.Data[0];
        this.setForeignKey();
        this.form.instance.getEditor(this.foreignKeyData.dataField).option('readOnly', true);
        this.form.instance.getEditor(this.foreignKeyData.dataField).option('buttons[1].options.visible', true);
        this.itemRowClickSearch = null;
        this.cleanDependencyFields(this.foreignKeyData.dataField);
      } else {
        this.dataDetail[this.foreignKeyData.dataField] = null;
        this.dataDetail[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
        this.sharedService.error('Valor no encontrado');
      }
    } else if (response.IsError) {
      this.sharedService.error(response.ErrorMessage);
      this.dataDetail[this.foreignKeyData.dataField] = null;
      this.dataDetail[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
    } else {
      this.sharedService.error(response.Messages);
      this.dataDetail[this.foreignKeyData.dataField] = null;
      this.dataDetail[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
    }
  }

  cleanDependencyFields(foreignKey: string) {
    for (const item of this.listItemsForm.filter(x => x.dataField !== foreignKey && x.isForeignKey)) {
      if (item.whereForeignKey) {
        for (const itemCondition of JSON.parse(item.whereForeignKey).filter((x: any) => x.value.startsWith('{'))) {
          const fieldTmp = itemCondition.value.replace('{', '').replace('}', '');

          if (fieldTmp === foreignKey.replace(/^FK/, '')) {
            delete this.dataDetail[item.dataField];
            delete this.dataDetail[item.dataField.replace(/^FK/, '')];
            if (item.visible) {
              this.form.instance.getEditor(item.dataField).option('readOnly', false);
              this.form.instance.getEditor(item.dataField).option('buttons[1].options.visible', false);
            }
          }

          if (item.propsConfigSearch) {
            const cache = JSON.parse(item.propsConfigSearch).find((x) => x.id === 'Cache');
            if (cache.value === 'S') {
              const index = this.listCacheSearch.find(x => x.item === item.dataField);
              this.listCacheSearch = this.listCacheSearch.filter((y) => y !== index);
            }
          }
        }
      }
      if (item.whereForeignKeyOnlyRecord) {
        for (const itemCondition of JSON.parse(item.whereForeignKeyOnlyRecord).filter((x: any) => x.value.startsWith('{'))) {
          const fieldTmp = itemCondition.value.replace('{', '').replace('}', '');
          if (fieldTmp === foreignKey.replace(/^FK/, '')) {
            delete this.dataDetail[item.dataField];
            delete this.dataDetail[item.dataField.replace(/^FK/, '')];
            this.form.instance.getEditor(item.dataField).option('readOnly', false);
            this.form.instance.getEditor(item.dataField).option('buttons[1].options.visible', false);
          }
        }
      }
    }
  }


  searchDataForeignKey(inicial: boolean) {
    this.searchData.query = null;
    this.searchData.queryCount = null;
    this.searchData.querySum = null;
    this.searchData.like = null;
    this.listDataForeignKey = null;

    if (!this.configSearchDataForeignKey(this.foreignKeyData.whereForeignKey)) {
      this.sharedService.showLoader(false);
      return;
    }
    if (this.foreignKeyData.orderBy && JSON.parse(this.foreignKeyData.orderBy).length > 0) {
      const listOrder: any[] = JSON.parse(this.foreignKeyData.orderBy);
      this.searchData.orderBy = listOrder.map(x => x.field).join(',');
    }
    if (this.foreignKeyData.propsConfigSearch && inicial) {
      const autoOpen = JSON.parse(this.foreignKeyData.propsConfigSearch).find(x => x.id === 'AutoOpen');
      if (autoOpen.value === 'N') {
        this.searchData.where = '1 = 0';
      }
    }
    this.dynamicProgramsService.listDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listDataForeignKey = response.Result.Data;
        this.totalRecordsSearch = response.Result.TotalRecords;
        if (this.foreignKeyData.propsConfigSearch && this.listDataForeignKey.length !== 0) {
          const cache = JSON.parse(this.foreignKeyData.propsConfigSearch).find(x => x.id === 'Cache');
          if (cache.value === 'S') {
            const item = this.listCacheSearch.find(x => x.item === this.foreignKeyData.dataField);
            this.listCacheSearch = this.listCacheSearch.filter((y) => y !== item);
            this.listCacheSearch.push({ item: this.foreignKeyData.dataField, data: this.listDataForeignKey });
          }
        }
        if (this.foreignKeyData.visibleColumnsForeignKey && JSON.parse(this.foreignKeyData.visibleColumnsForeignKey).length > 0) {
          this.foreignKeyGrid.instance.option('columns', []);
          for (const column of JSON.parse(this.foreignKeyData.visibleColumnsForeignKey)) {
            if (column.dataField.search(/\./) < 0) {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.dataField });
            } else {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.caption });
            }
          }
        }
      } else if (response.IsError) {
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.sharedService.error(response.Messages);
      }
      this.sharedService.showLoader(false);
    });
  }

  searchDataForeignKeyWithLike() {
    this.searchData.query = null;
    this.searchData.queryCount = null;
    this.searchData.like = null;
    this.listDataForeignKey = null;

    if (!this.configSearchDataForeignKey(this.foreignKeyData.whereForeignKey)) {
      this.sharedService.showLoader(false);
      return;
    }

    const conditions = [];
    for (const column of JSON.parse(this.foreignKeyData.visibleColumnsForeignKey)) {
      let dataField = '';
      // si tiene punto es porque tiene alias de join
      if (column.dataField.search(/\./) >= 0) {
        dataField = this.foreignKeyData.tableNameAliasForeignKey ? `${column.dataField}` : `${this.foreignKeyData.tableNameForeignKey}.${column.dataField}`;
      } else {
        dataField = this.foreignKeyData.tableNameAliasForeignKey ? `${this.foreignKeyData.tableNameAliasForeignKey}.${column.dataField}` : `${this.foreignKeyData.tableNameForeignKey}.${column.dataField}`;
      }
      switch (this.searchMethod) {
        case SearchMethod.Contains:
          conditions.push(`${dataField} LIKE '%${this.criteria}%'`);
          break;
        case SearchMethod.EndWith:
          conditions.push(`${dataField} LIKE '%${this.criteria}'`);
          break;
        case SearchMethod.Equals:
          conditions.push(`${dataField} LIKE '${this.criteria}'`);
          break;
        default:
          conditions.push(`${dataField} LIKE '${this.criteria}%'`);
          break;
      }
    }
    this.searchData.like = `(${conditions.join(' OR ')})`;


    this.dynamicProgramsService.listDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listDataForeignKey = response.Result.Data;
        this.totalRecordsSearch = response.Result.TotalRecords;
        if (this.foreignKeyData.visibleColumnsForeignKey && JSON.parse(this.foreignKeyData.visibleColumnsForeignKey).length > 0) {
          this.foreignKeyGrid.instance.option('columns', []);
          for (const column of JSON.parse(this.foreignKeyData.visibleColumnsForeignKey)) {
            if (column.dataField.search(/\./) < 0) {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.dataField });
            } else {
              this.foreignKeyGrid.instance.addColumn({ caption: column.caption, dataField: column.caption });
            }
          }
        }
      } else if (response.IsError) {
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.sharedService.error(response.Messages);
      }
      this.sharedService.showLoader(false);
    });
  }

  async searchDataBasedoc() {
    if (this.showPopupSearchBasedocConditions) {
      let where: string[] = [];
      let j = -1;
      for (let i = 0; i < this.listSearchBasedocConditions.length; i++) {
        const element = this.listSearchBasedocConditions[i];
        if (element.value.length > 0) {
          if (element.operator !== 'IN') {
            if (element.type !== 'N') {
              where.push(`${element.operatorUnion} ${element.field} ${element.operator} '${element.value}' `);
            } else {
              where.push(`${element.operatorUnion} ${element.field} ${element.operator} ${element.value} `);
            }
            j += 1;
          }
          else {//manejo de IN lupa
            if (element.type !== 'N') {
              where.push(`${element.operatorUnion} ${element.field} IN ('${element.value}') `);
            }
            else {
              where.push(`${element.operatorUnion} ${element.field} IN (${element.value}) `);
            }
            j += 1;
          }
        }
      }
      if (where.length !== 0) {
        await this.listBasedoc(where.join('|'));
      }
    }
  }

  async searchDataSpecialdet() {
    if (this.showPopupSearchSpecialdetConditions) {
      let where: string[] = [];
      let j = -1;
      for (let i = 0; i < this.listSearchSpecialdetConditions.length; i++) {
        const element = this.listSearchSpecialdetConditions[i];
        if (element.value.length > 0) {
          if (element.operator !== 'IN') {
            if (element.type !== 'N') {
              where.push(`${element.operatorUnion} ${element.field} ${element.operator} '${element.value}' `);
            } else {
              where.push(`${element.operatorUnion} ${element.field} ${element.operator} ${element.value} `);
            }
            j += 1;
          }
          else {//manejo de IN lupa
            if (element.type !== 'N') {
              where.push(`${element.operatorUnion} ${element.field} IN ('${element.value}') `);
            }
            else {
              where.push(`${element.operatorUnion} ${element.field} IN (${element.value}) `);
            }
            j += 1;
          }
        }
      }
      if (where.length !== 0) {
        await this.listSpecialDet(where.join(' AND '), this.gItem);
      }
    }
  }

  listAllData() {
    setTimeout(() => {
      this.searchData.where = null;
      if (this.metadataGrid.conditions) {
        // se establece si tiene un where inicial
        this.setWhereListData(JSON.parse(this.metadataGrid.conditions));
      }
      this.listKeyMasterDetail = JSON.parse(this.parentMainForm.MetadataMasterDetail).filter((x) => x.ProjectId === this.mainForm.Id)[0].MasterDetails;
      const listConditions = [];
      // se obtiene solo la informacion que pertenece a la cabecera
      for (const item of this.listKeyMasterDetail) {
        if (item.DetailColumnName !== this.lglcruField) {
          listConditions.push(`${this.mainForm.TableName}.${item.DetailColumnName}='${this.dataMaster[item.MasterColumnName]}'`);
        }
      }
      if (this.searchData.where !== null) {
        this.searchData.where += ` AND ${listConditions.join(' AND ')}`;
      } else {
        this.searchData.where = listConditions.length > 0 ? listConditions.join(' AND ') : null;
      }
      this.searchData.tableName = this.mainForm.TableName;
      this.searchData.pageNumber = this.page;
      this.searchData.orderBy = `${this.mainForm.TableName}.${this.listKeyMasterDetail[0].MasterColumnName}`;
      this.searchData.query = this.metadataGrid.query;
      this.searchData.queryCount = this.metadataGrid.queryCount;
      this.searchData.querySum = this.metadataGrid.queryCount;
      if (this.metadataGrid.pageSize) {
        this.searchData.pageSize = this.metadataGrid.pageSize;
      }
      this.searchData.like = null;
      this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
        this.listData = responseList.Result.Data;
        this.totalRecords = responseList.Result.TotalRecords;
        this.sharedService.showLoader(false);
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    }, 300);
  }

  listAllDataWithLike() {
    this.searchData.where = null;
    if (this.metadataGrid.conditions) {
      // se establece si tiene un where inicial
      this.setWhereListData(JSON.parse(this.metadataGrid.conditions));
    }
    const listConditions = [];
    // se obtiene solo la informacion que pertenece a la cabecera
    for (const item of this.listKeyMasterDetail) {
      listConditions.push(`${this.mainForm.TableName}.${item.DetailColumnName}='${this.dataMaster[item.MasterColumnName]}'`);
    }
    if (this.searchData.where !== null) {
      this.searchData.where += ` AND ${listConditions.join(' AND ')}`;
    } else {
      this.searchData.where = listConditions.length > 0 ? listConditions.join(' AND ') : null;
    }
    this.searchData.tableName = this.mainForm.TableName;
    this.searchData.pageNumber = this.page;
    this.searchData.orderBy = `${this.mainForm.TableName}.${this.listKeyMasterDetail[0].MasterColumnName}`;
    if (this.metadataGrid.pageSize) {
      this.searchData.pageSize = this.metadataGrid.pageSize;
    }
    const conditions = [];
    for (const column of JSON.parse(this.mainForm.MetadataGrid).columns.filter((x) => x.visible === true)) {
      switch (this.searchMethod) {
        case SearchMethod.Contains:
          conditions.push(`${column.name} LIKE '%${this.criteria}%'`);
          break;
        case SearchMethod.EndWith:
          conditions.push(`${column.name} LIKE '%${this.criteria}'`);
          break;
        case SearchMethod.Equals:
          conditions.push(`${column.name} LIKE '${this.criteria}'`);
          break;
        default:
          conditions.push(`${column.name} LIKE '${this.criteria}%'`);
          break;
      }
    }
    this.searchData.like = `(${conditions.join(' OR ')})`;
    this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
      this.listData = responseList.Result.Data;
      this.totalRecords = responseList.Result.TotalRecords;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    });
  }

  listAllTotal() {
    if (this.listItemsTotal.length > 0) {
      this.sharedService.showLoader(true);
      const lcampos = [];
      const lkeydata = JSON.parse(this.parentMainForm.MetadataPrimaryKey);
      const lcam_cont = lkeydata.filter((x) => x.Name !== 'EMP_CODI')[0];
      const dataRest: any = {};
      dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
      dataRest['tra_cont'] = this.dataMaster[lcam_cont.Name];
      dataRest['tab_nomb'] = this.mainForm.TableName;
      dataRest['cam_cont'] = lcam_cont.Name;
      for (const item of this.listItemsTotal) {
        lcampos.push(item.dataField);
      }
      dataRest['fields'] = lcampos.join(',');
      this.mainFormService['CalcularTot'](dataRest).subscribe(
        (response: ActionResult) => {
          if (response.IsSucessfull) {
            //asignar resultado
            const lvalores = response.Result.lGnValues;
            for (const item of lvalores) {
              this.dataTotal[item.nom_camp] = item.val_camp;
            }
          } else {
            this.sharedService.error(response.ErrorMessage);
          }
          this.sharedService.showLoader(false);
        },
        () => {
          this.sharedService.error('Ocurrio un error inesperado');
          this.sharedService.showLoader(false);
        }
      );
    }
  }

  async searchFK() {
    //Armar QBE de lupa
    let filterEmp = false;
    let ltable = '';
    let lalias = '';
    let ltables: any[] = [];
    if (this.listSearchFKConditions.length === 0) {
      for await (const ljoin of JSON.parse(this.foreignKeyData.joinsForeignKey)) {
        //const ltable = JSON.parse(this.foreignKeyData.joinsForeignKey)[0].table;
        //const lalias = JSON.parse(this.foreignKeyData.joinsForeignKey)[0].tableAlias;
        ltable = ljoin.table;
        lalias = ljoin.tableAlias;
        if (ltables.indexOf(lalias) === -1) {
          const response: ActionResult = await this.mainFormService.listColumns(this.mainForm.ConnectionId, ltable).toPromise();
          for await (const item of response.Result) {
            if (item.Name === 'EMP_CODI' && !filterEmp) {
              this.empcodiFilter = `${lalias}.EMP_CODI = ${this.sessionService.session.selectedCompany.code}`;
              filterEmp = true;
            }
            const itemTmp = JSON.parse(this.foreignKeyData.visibleColumnsForeignKey).find((x) => x.dataField === `${lalias}.${item.Name}` || x.dataField === item.Name);
            if (itemTmp !== undefined) {
              let ltipo = '';
              switch (item.DataType) {
                case 'datetime':
                case 'datetime2':
                case 'smalldatetime':
                case 'date':
                  ltipo = 'D';
                  break;
                case 'int':
                case 'decimal':
                case 'smallint':
                case 'numeric':
                case 'tinyint':
                case 'bigint':
                case 'number':
                  ltipo = 'N';
                  break;
                case 'bit':
                  ltipo = 'S';
                  break;
                default:
                  ltipo = 'S';
                  break;
              }
              if (!this.listSearchFKConditions.find(x => x.field === `${lalias}.${item.Name}`)) {
                this.listSearchFKConditions.push({ field: `${lalias}.${item.Name}`, label: itemTmp.caption, type: ltipo, operator: '=', value: '', operatorUnion: 'AND' });
              }
            }
          }
          setTimeout(() => {
            //this.showPopupSearchFKConditions = true;
          }, 300);
        }
        ltables.push(lalias);
      }
      this.showPopupSearchFKConditions = true;
    }
    else {
      this.showPopupSearchFKConditions = true;
    }
  }

  searchBasedoc() {
    //Armar QBE de lista de documentos base
    if (this.listSearchBasedocConditions.length === 0) {
      this.listSearchBasedocConditions.push({ field: 'GN_TOPER.TOP_CODI', label: 'Tipo operación', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'GN_TOPER.TOP_NOMB', label: 'Nombre tipo operación', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'BAS_NUME', label: 'Número', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'BAS_FECH', label: 'Fecha', type: 'D', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'GN_TERCE.TER_CODA', label: 'Tercero', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'GN_TERCE.TER_NOCO', label: 'Nombre tercero', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'GN_ARBOL.ARB_CODI', label: 'Sucursal', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
      this.listSearchBasedocConditions.push({ field: 'GN_ARBOL.ARB_NOMB', label: 'Nombre sucursal', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
      this.showPopupSearchBasedocConditions = true;
    }
    else {
      this.showPopupSearchBasedocConditions = true;
    }
  }

  searchSpecialdet() {
    //Armar QBE de lista de detalles especiales
    if (this.listSearchSpecialdetConditions.length === 0) {
      const ltitles = this.DataSpecialDet[0].titles;
      const lfields = this.DataSpecialDet[1].fields;
      let ltypes = this.DataSpecialDet[2].types;
      ltypes = ltypes.replace(/C/g, 'N');
      const titles = ltitles.split('|');
      const fields = lfields.split('|');
      const types = ltypes.split('|');
      for (var i = 0; i < fields.length; i++) {
        this.listSearchSpecialdetConditions.push({ field: fields[i], label: titles[i], type: types[i], operator: '=', value: '', operatorUnion: 'AND' });
      }
    }
    else {
      this.showPopupSearchSpecialdetConditions = true;
    }
  }

  setFKConditions() {
    let lcampos = 0;
    let lfilter = 0;
    for (const item of this.listSearchFKConditions) {
      lcampos += 1;
      if (item.value.length === 0) {
        lfilter += 1;
      }
    }
    if (lcampos !== lfilter) {
      this.searchDataForeignKey(false);
      this.showPopupSearchFKConditions = false;
    }
    else {
      this.showPopupSearchFKConditions = false;
      this.searchDataForeignKey(false);
    }
  }

  async setBasedocConditions() {
    let lcampos = 0;
    let lfilter = 0;
    for (const item of this.listSearchBasedocConditions) {
      lcampos += 1;
      if (item.value.length === 0) {
        lfilter += 1;
      }
    }
    if (lcampos !== lfilter) {
      this.searchDataBasedoc();
      this.showPopupSearchBasedocConditions = false;
    }
    else {
      await this.listBasedoc(' ');
      this.showPopupSearchBasedocConditions = false;
    }
  }

  async setSpecialdetConditions() {
    let lcampos = 0;
    let lfilter = 0;
    for (const item of this.listSearchSpecialdetConditions) {
      lcampos += 1;
      if (item.value.length === 0) {
        lfilter += 1;
      }
    }
    if (lcampos !== lfilter) {
      this.searchDataSpecialdet();
      this.showPopupSearchSpecialdetConditions = false;
    }
    else {
      await this.listSpecialDet('', this.gItem);
      this.showPopupSearchSpecialdetConditions = false;
    }
  }

  prepareDateBoxItem(item: Property) {
    if (item.editorType === 'dxDateBox') {
      if (item.editorOptions.minDateToday) {
        item.editorOptions.min = new Date();
      } else {
        item.editorOptions.min = item.editorOptions.minDate;
      }
      if (item.editorOptions.maxDateToday) {
        item.editorOptions.max = new Date();
      } else {
        item.editorOptions.max = item.editorOptions.maxDate;
      }
    }
  }

  prepareNumberBoxItem(item: Property) {
    if (item.editorType === 'dxNumberBox') {
      item.editorOptions.min = item.editorOptions.minNumber;
      item.editorOptions.max = item.editorOptions.maxNumber;
    }
  }

  prepareDefaultValue(item: Property) {
    // si es llave foranea no se hace nada
    //if (item.isForeignKey) {
    //return;
    //}
    // si el editor es un numero y el registro es nuevo se establcece 0
    if (!this.editMode && item.editorType === 'dxNumberBox') {
      this.dataDetail[item.dataField] = 0;
    }
    // si no tiene modos de aplicacion del valor no se hace nada
    if (!item.editorOptions.defaultValueModes) {
      if (!this.editMode && item.dataType === 'bit') {
        this.dataDetail[item.dataField] = false;
        delete item.editorOptions.value;
      }
      return;
    }
    // si es nuevo y tiene el modo de aplicacion en nuevo
    if (!this.editMode && (item.editorOptions.defaultValueModes as any[]).find(x => x === 1)) {
      this.applyDefaultValue(item);
    }
    // si se esta editando y tiene el modo de aplicacion en edicion
    if (this.editMode && (item.editorOptions.defaultValueModes as any[]).find(x => x === 2)) {
      this.applyDefaultValue(item);
    }
    //delete item.editorOptions.value;
  }

  applyDefaultValue(item: Property) {
    // si tiene una funcion
    if (item.editorOptions.defaultValueFunc) {
      if (item.editorOptions.defaultValueFunc === 'getMaxConse') {
        this.mainFormService.getMaxConse(this.sessionService.session.selectedCompany.code,
          this.mainForm.TableName, item.dataField).subscribe((response: ActionResult) => {
            if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
              return;
            }
            else {
              this.dataDetail[item.dataField] = response.Result.con_disp;
              this.dataDetail[item.dataField.replace(/^FK/, '')] = response.Result.con_disp;
            }
          });
      }
      else if (item.editorOptions.defaultValueFunc === 'getMaxConseDet') {
        const masterDetailKey = this.listKeyMasterDetail.filter((x) => x.DetailColumnName !== 'EMP_CODI')[0];
        this.mainFormService.getMaxConseDet(this.sessionService.session.selectedCompany.code,
          this.dataDetail[masterDetailKey.MasterColumnName], this.mainForm.TableName,
          masterDetailKey.MasterColumnName, item.dataField).subscribe((response: ActionResult) => {
            if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
              return;
            }
            else {
              this.dataDetail[item.dataField] = response.Result.con_disp;
              this.dataDetail[item.dataField.replace(/^FK/, '')] = response.Result.con_disp;
            }
          });
      }
      else {
        const value = this.commonFunctions[item.editorOptions.defaultValueFunc]();
        this.dataDetail[item.dataField] = value;
        this.dataDetail[item.dataField.replace(/^FK/, '')] = value;
      }
      delete item.editorOptions.value;
    }
    // si tiene valor por defecto y no funcion
    if (item.editorOptions.value !== undefined) {
      this.dataDetail[item.dataField] = item.editorOptions.value;
      this.dataDetail[item.dataField.replace(/^FK/, '')] = item.editorOptions.value;
      //delete item.editorOptions.value;
    }
  }

  async prepareSequence(item: Property) {
    if (item.patternId) {
      if (item.editorOptions.defaultValueModes.length === 0) {
        return;
      }
      if (item.editorOptions.defaultValueModes.length === 2 || item.editorOptions.defaultValueModes[0] === 2) {
        const result: ActionResult = await this.dynamicProgramsService.getNumericSequence(item.sequenceId).toPromise();
        item.editorOptions.value = result.Result;
        this.dataDetail[item.dataField] = item.editorOptions.value;
      } else {
        // si tiene el modo de guardar
        if (!this.editMode) {
          const result: ActionResult = await this.dynamicProgramsService.getNumericSequence(item.sequenceId).toPromise();
          item.editorOptions.value = result.Result;
          this.dataDetail[item.dataField] = item.editorOptions.value;
        } else {
          item.editorOptions.value = this.dataDetail[item.dataField];
        }
      }

    }
  }

  async getValueForeignKey(item: Property) {
    // Pendiente de validar por JEL. Se elimina porque en modo edición estas lineas eliminan los valores actuales de la lupa
    // Se corrije en evento de cambio de valor la eliminacion de valores de la lupa JEL
    if (this.editMode) {
      delete item.editorOptions.value;
      return;
    }
    if (!item.isForeignKey) {
      return;
    }
    if (!item.editorOptions.value) {
      return;
    }
    const listConditions = [];
    const listValueMember = item.valueMemberForeignKey.split(';');

    for (let i = 0; i < listValueMember.length; i++) {
      const element = listValueMember[i];
      //listConditions.push(`${element}='${item.editorOptions.value}'`);      
      element.length > 0 ? listConditions.push(`${item.tableNameAliasForeignKey}.${element} = '${item.editorOptions.value}'`) : '';
    }
    //Correccion F88
    this.searchData.select = item.valueMemberForeignKey.split(';')[1].length > 0 ? item.valueMemberForeignKey.split(';')[1] :
      item.valueMemberForeignKey.split(';')[0];
    this.searchData.joins = `${item.tableNameForeignKey.replace(';', '')} AS ${item.tableNameAliasForeignKey}`
    this.searchData.where = listConditions.join(' AND ');
    this.searchData.tableName = item.tableNameForeignKey;
    const response: ActionResult = await this.dynamicProgramsService.getItemDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();

    if (!response.IsSucessfull) {
      return;
    }
    if (!response.Result) {
      return;
    }
    if (item.displayMemberForeignKey) {
      const displayMember = [];
      for (let itemDisplay of item.displayMemberForeignKey.split(';')) {
        itemDisplay = itemDisplay.substring(itemDisplay.indexOf('.') + 1, itemDisplay.length);
        displayMember.push(response.Result[itemDisplay]);
      }
      this.dataDetail[`${item.dataField}`] = displayMember.join(' | '); //se modifica separador
    } else {
      this.dataDetail[`${item.dataField}`] = response.Result[item.valueMemberForeignKey.split(';')[0]];
    }
    this.dataDetail[item.dataField.replace(/^FK/, '')] = item.editorOptions.value;
    setTimeout(() => {
      if (item.visible) {
        this.form.instance.getEditor(item.dataField).option('readOnly', true);
        this.form.instance.getEditor(item.dataField).option('buttons[1].options.visible', true);
      }
    }, 200);
    delete item.editorOptions.value;

  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.2);
  }

  formHeight = () => {
    setTimeout(() => {
      if (!this.showMasterDetail) {
        return Math.round(window.innerHeight / 1.8);
      } else {
        return 'auto';
      }
    }, 200);
  }

  gridHeight = () => {
    return window.innerHeight - 400;
  }

  gridHeightBasedoc = () => {
    return window.innerHeight - 370;
  }

  gridSearchFKHeight = () => {
    if (this.listSearchFKConditions.length > 10) {
      return window.innerHeight / 1.5;
    }
    else {
      return this.listSearchFKConditions.length * 50;
    }
  }

  gridSearchBasedocHeight = () => {
    return window.innerHeight / 2.8;
  }

  gridSearchSpecialdetHeight = () => {
    return window.innerHeight / 1.8;
  }

  setForeignKey() {
    if (!this.itemRowClickSearch) {
      return;
    }
    if (this.foreignKeyData.displayMemberForeignKey) {
      const displayMember = [];
      for (let item of this.foreignKeyData.displayMemberForeignKey.split(';')) {
        item = item.substring(item.indexOf('.') + 1, item.length);
        displayMember.push(this.itemRowClickSearch[item]);
      }
      this.dataDetail[`${this.foreignKeyData.dataField}`] = displayMember.join(' | '); //se modifica separador
    } else {
      this.dataDetail[`${this.foreignKeyData.dataField}`] = this.itemRowClickSearch[this.foreignKeyData.valueMemberForeignKey.split(';')[0]];
    }

    const listValueMember = this.foreignKeyData.valueMemberForeignKey.split(';');
    const listValueMemberParent = this.foreignKeyData.valueMemberParentKey.split(';');

    for (let i = 0; i < listValueMember.length; i++) {
      const element = listValueMember[i];
      this.itemRowClickSearch[element] !== undefined ? this.dataDetail[listValueMemberParent[i]] = this.itemRowClickSearch[element] : '';
    }

    this.searchVisible = false;
  }

  listAllFunctions() {
    this.mainFormService.listAllFunction().subscribe((response: ActionResult) => {
      this.listFunctions = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  listAllMethods() {
    this.mainFormService.listAllMethod().subscribe((response: ActionResult) => {
      this.listMethods = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  listMasterDetailsDetails() {
    const listMainFormMasterDetailTmp: any[] = JSON.parse(this.mainForm.MetadataMasterDetail).sort((a: any, b: any) => {
      if (a.Order > b.Order) {
        return 1;
      }
      if (a.Order < b.Order) {
        return -1;
      }
      return 0;
    });
    const projects = listMainFormMasterDetailTmp.map((x) => x.ProjectId);
    this.mainFormService.listByIdsMainForm(projects).subscribe((response: ActionResult) => {

      for (const item of listMainFormMasterDetailTmp) {
        let projectTmp = response.Result.find(x => x.Id === item.ProjectId);
        if (this.parentMainForm.Transaccion === 'S' && projectTmp.FuncEspec.split(';')[0] === 'COPYDIS') {
          if (projectTmp.FuncEspec.split(';')[2] === this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_Cdist')[0].Value]) {
            projectTmp = {
              ...projectTmp,
              Visible: true
            };
          }
          else {
            projectTmp = {
              ...projectTmp,
              Visible: false
            };
          }
        }
        else {
          projectTmp = {
            ...projectTmp,
            Visible: true
          };
        }
        this.listMainFormMasterDetail.push(projectTmp);
      }

    }, () => {
      this.listMainFormMasterDetail = [];
    });
  }

  cleanPopup() {
    this.editMode = false;
    //this.dataDetail = {}; ojo
    this.itemSelected = null;
    this.showMasterDetail = false;
    this.showPopupDetail = false;
  }

  setDataSourceValue() {
    if (!this.itemRowClickDataSource) {
      return;
    }
    if (!this.itemRowClickDataSource[this.fieldDataSource.valueMember]) {
      this.sharedService.warning(`El campo (${this.fieldDataSource.valueMember}) no existe en el item seleccionado`);
    } else {
      this.dataDetail[this.fieldDataSource.dataField] = this.itemRowClickDataSource[this.fieldDataSource.valueMember];
      if (this.fieldDataSource.valueShow) {
        this.dataDetail[`DsV${this.fieldDataSource.dataField}`] = this.dataDetail[this.fieldDataSource.dataField];
        this.dataDetail[this.fieldDataSource.dataField] = this.itemRowClickDataSource[this.fieldDataSource.valueShow];
        //insertar en arreglo para luego remplazar
        if (this.listitemRowClickDataSource.find(x => x.dataField === this.fieldDataSource.dataField)) {
          const index = this.listitemRowClickDataSource.indexOf(this.listitemRowClickDataSource.find(x => x.dataField === this.fieldDataSource.dataField)[0]);
          this.listitemRowClickDataSource.splice(index, 1);
          this.listitemRowClickDataSource.push({ dataField: this.fieldDataSource.dataField, row: this.itemRowClickDataSource });
        }
        else {
          this.listitemRowClickDataSource.push({ dataField: this.fieldDataSource.dataField, row: this.itemRowClickDataSource });
        }
      }
    }
    this.dataSourceVisible = false;
  }

  setToolbarItemsMasterDetailPopup() {
    if (this.editMode) {
      this.toolbarItemsMasterDetailPopup = [
        {
          ...this.toolbarPopupsConfig,
          options: {
            elementAttr: { class: 'primary-button-color' },
            text: 'Editar',
            onClick: async () => {
              if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
                await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
                if (!this.errorValdocu) {
                  //this.edit();
                  this.validateEdit();
                }
              }
              else {
                //this.edit();
                this.validateEdit();
              }
            }
          }
        }
      ];
    } else {
      this.toolbarItemsMasterDetailPopup = [
        {
          ...this.toolbarPopupsConfig,
          options: {
            elementAttr: { class: 'primary-button-color' },
            text: 'Guardar',
            onClick: async () => {
              if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
                await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
                if (!this.errorValdocu) {
                  await this.runOnBeforeSaveEvent(this.dataDetail, null, 'I');
                  if (!this.errorBeforeSave) {
                    this.save();
                  }

                }
              }
              else {
                await this.runOnBeforeSaveEvent(this.dataDetail, null, 'I');
                if (!this.errorBeforeSave) {
                  this.save();
                }
              }
            }
          }
        }
      ];
    }

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  download(row) {
    this.sharedService.showLoader(true);
    const byteCharacters = atob(row.data.FileBody);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: row.data.FileExt });
    FileSaver.saveAs(blob, row.data.FileName);
    this.sharedService.showLoader(false);
  }

  afterAddingFile() {
    this.uploader.onAfterAddingFile = (file: FileItem) => {
      this.sharedService.showLoader(true);
      file.withCredentials = false;
      const headerData = {
        act_esta: 'A',
        act_hora: new Date(),
        act_usua: this.sessionService.session.accountCode,
        usu_crea: this.sessionService.session.accountCode,
        cod_empr: this.sessionService.session.selectedCompany.code,
        rmt_bbli: this.libraryId,
        rmt_blar: -1,

        bai_nomb: `${this.sessionService.session.selectedCompany.code}_${file._file.name}`,
        bai_tamn: file.file.size,
        bai_extn: file.file.name.split('.').pop(),
        bai_orig: 'Formulario Dinamico',
        bai_sesc: 'S',
        bai_verc: '1.0',
        bai_esta: 'A',
      };
      file.headers = [{ name: 'FileData', value: JSON.stringify(headerData) }];
    };
  }

  completeItem() {
    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (status === 200) {
        this.listDocuments = [];
        const result = JSON.parse(response);
        this.dataDetail[this.itemUpload.dataField] = `${this.sessionService.session.selectedCompany.code}_${item.file.name}`;
        this.dataDetail[`OPHFU_${this.itemUpload.dataField}`] = `${this.sessionService.session.selectedCompany.code}_${item.file.name}_OPHFU_${result[0].RMT_BLAR}`;
        this.dynamicProgramsService.getDocument(+this.sessionService.session.selectedCompany.code, this.libraryId, result[0].RMT_BLAR).subscribe((responseDocument: ActionResult) => {
          this.listDocuments.push(responseDocument.Result);
          this.sharedService.showLoader(false);
        }, () => {
          this.sharedService.showLoader(false);
        });
      } else {
        this.sharedService.error(response);
        this.sharedService.showLoader(false);
      }
    };
  }

  setTotalFields() {
    //recorrer items para saber cuales totalizar
    for (const item of JSON.parse(this.mainForm.MetadataForm)) {
      if (item.isTotalField === 'S') {
        item.label.text = 'Total ' + item.label.text;
        this.listItemsTotal.push(item);
      }
    }
    this.listAllTotal();
  }

  prepareFuncEsp() {
    const listFuncMember = this.mainForm.FuncEspec ? this.mainForm.FuncEspec.split(';') : [];
    //const listFuncMember = this.mainForm.FuncEspec.split(';');
    this.funcEspec1 = listFuncMember[0] ? listFuncMember[0] : '';
    if (listFuncMember[1]) {
      this.funcEspec2 = listFuncMember[1] ? listFuncMember[1] : '';
    }
    if (listFuncMember[2]) {
      this.funcEspec3 = listFuncMember[2] ? listFuncMember[2] : '';
    }
    switch (this.funcEspec1) {
      case 'CALCPOS':
        this.button1txt = 'Calcular Posición';
        this.button1icon = 'fas fa-plus';
        break;
      case 'COPYDIS':
        this.button1txt = 'Copiar Distribución';
        this.button1icon = 'far fa-copy';
        break;
      case 'CALCDOC':
        this.button1txt = '';
        this.button1icon = 'fas fa-calculator';
        break;
    }
    switch (this.funcEspec2) {
      case 'DELEDIS':
        this.button2txt = 'Eliminar Distribución';
        this.button2icon = 'far fa-trash-alt';
        break;
    }
  }

  async ExecFuncEspec(btn: number) {
    if (btn !== 3) {
      if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
        await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
        if (this.errorValdocu) {
          return;
        }
      }
    }
    if (btn === 1) {
      switch (this.funcEspec1) {
        case 'CALCPOS':
          //consumir servicio
          if (this.mainForm.TableName === 'TS_DEREG') {
            this.mainFormService.getCalcPos(this.sessionService.session.selectedCompany.code, this.dataMaster['ARC_CODI'],
              this.dataMaster['REG_NUME'], this.mainForm.TableName).subscribe((response: ActionResult) => {
                if (response.IsError) {
                  this.sharedService.error(response.ErrorMessage);
                  return;
                }
                else {
                  this.listAllData();
                }
              });
          }
          else if (this.mainForm.TableName === 'CN_DPICS') {
            this.mainFormService.getCalcPos(this.sessionService.session.selectedCompany.code, this.dataMaster['CUE_CONT'],
              0, this.mainForm.TableName).subscribe((response: ActionResult) => {
                if (response.IsError) {
                  this.sharedService.error(response.ErrorMessage);
                  return;
                }
                else {
                  this.listAllData();
                }
              });
          }
          break;
        case 'COPYDIS':
          //consumir servicio
          this.sharedService.showLoader(true);
          const lkeydata = JSON.parse(this.parentMainForm.MetadataPrimaryKey);
          const lcam_cont = lkeydata.filter((x) => x.Name !== 'EMP_CODI' && x.Name !== `${this.parentMainForm.TableName.slice(3, 6)}_CONT`)[0];
          const dataRest: any = {};
          dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
          dataRest['tra_cont'] = this.dataMaster[`FK${lcam_cont.Name}`];
          dataRest['dtr_cont'] = this.dataMaster[`${this.parentMainForm.TableName.slice(3, 6)}_CONT`];
          dataRest['tab_nomb'] = this.mainForm.TableName;
          dataRest['tab_nomd'] = this.parentMainForm.TableName;
          dataRest['cam_cont'] = lcam_cont.Name;
          dataRest['cam_cond'] = `${this.parentMainForm.TableName.slice(3, 6)}_CONT`;
          this.mainFormService['CopyDistrib'](dataRest).subscribe(
            (response: ActionResult) => {
              if (response.IsSucessfull) {
                this.sharedService.info('Se copió distribución a otros detalles');
              } else {
                this.sharedService.error(response.ErrorMessage);
              }
              this.sharedService.showLoader(false);
            },
            () => {
              this.sharedService.error('Ocurrio un error inesperado');
              this.sharedService.showLoader(false);
            }
          );
          break;
      }
    }
    else if (btn === 2) {
      switch (this.funcEspec2) {
        case 'DELEDIS':
          //consumir servicio
          this.sharedService.showLoader(true);
          const lkeydata = JSON.parse(this.parentMainForm.MetadataPrimaryKey);
          const lcam_cont = lkeydata.filter((x) => x.Name !== 'EMP_CODI' && x.Name !== `${this.parentMainForm.TableName.slice(3, 6)}_CONT`)[0];
          const dataRest: any = {};
          dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
          dataRest['tra_cont'] = this.dataMaster[`FK${lcam_cont.Name}`];
          dataRest['dtr_cont'] = this.dataMaster[`${this.parentMainForm.TableName.slice(3, 6)}_CONT`];
          dataRest['tab_nomb'] = this.mainForm.TableName;
          dataRest['tab_nomd'] = this.parentMainForm.TableName;
          dataRest['cam_cont'] = lcam_cont.Name;
          dataRest['cam_cond'] = `${this.parentMainForm.TableName.slice(3, 6)}_CONT`;
          this.mainFormService['DeleteDistrib'](dataRest).subscribe(
            (response: ActionResult) => {
              if (response.IsSucessfull) {
                this.listAllData();
                this.sharedService.info('Se ha eliminado distribucion para detalle');
              } else {
                this.sharedService.error(response.ErrorMessage);
              }
              this.sharedService.showLoader(false);
            },
            () => {
              this.sharedService.error('Ocurrio un error inesperado');
              this.sharedService.showLoader(false);
            }
          );
          break;
      }
    }
    else if (btn === 3) {
      switch (this.funcEspec1) {
        case 'CALCDOC':
          //consumir servicio
          this.sharedService.showLoader(true);
          const lkeydata = JSON.parse(this.parentMainForm.MetadataPrimaryKey);
          const lcam_cont = lkeydata.filter((x) => x.Name !== 'EMP_CODI')[0];
          const dataRest: any = {};
          dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
          dataRest['tra_cont'] = this.dataMaster[lcam_cont.Name];
          dataRest['tab_nomb'] = this.mainForm.TableName;
          dataRest['tra_esta'] = this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value ? this.dataMaster[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] : 'A';
          dataRest['tra_esli'] = this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0].Value ? this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0].Value : 'A';
          this.mainFormService['CalcularDoc'](dataRest).subscribe(
            (response: ActionResult) => {
              if (response.IsSucessfull) {
                this.listAllData();
                this.totaldocum = response.Result.tot_docu;
              } else {
                this.sharedService.error(response.ErrorMessage);
              }
              this.sharedService.showLoader(false);
            },
            () => {
              this.sharedService.error('Ocurrio un error inesperado');
              this.sharedService.showLoader(false);
            }
          );
          break;
      }
    }
  }

  openPopupDataSource(e) {
    this.dataSourceVisible = true;
    if (this.listItemsDataSource) {
      this.fieldDataSource = this.listItemsDataSource.filter((x) => x.dataField === e.component.option('name'))[0];
    } else {
      this.fieldDataSource = new DataSource();
    }
    switch (this.fieldDataSource.dataSourceType) {
      case DataSourceType.Query:
        if (this.fieldDataSource.params) {
          this.setWhereListData(JSON.parse(this.fieldDataSource.params));
        } else {
          this.searchData.where = null;
        }
        // no se ejecuta si ocurrio un error estableciendo el where
        if (!this.dataSourceVisible) {
          return;
        }
        this.searchData.query = this.fieldDataSource.query;
        this.dynamicProgramsService.listDataFixedDataSource({ ProjectId: this.fieldDataSource.connectionId, Data: { ...this.searchData } }).subscribe((response: ActionResult) => {
          if (response.IsSucessfull) {
            this.listDataSource = response.Result;
            //ocultar columna de campo valor
            setTimeout(() => {
              this.dataSourceGrid.instance.columnOption(this.fieldDataSource.valueMember, 'visible', false);
            }, 200);
          } else {
            this.listDataSource = [];
          }
        }, () => {
          this.sharedService.error('Error ejecutando la consulta');
          this.listDataSource = [];
        });
        break;
      case DataSourceType.Service:
        if (this.fieldDataSource.columns) {
          setTimeout(() => {
            if (JSON.parse(this.fieldDataSource.columns).length > 0) {
              this.dataSourceGrid.instance.option('columns', []);
              for (const item of JSON.parse(this.fieldDataSource.columns)) {
                this.dataSourceGrid.instance.addColumn(item);
              }
            }
          }, 200);
        }
        let url = this.fieldDataSource.urlService;
        if (this.fieldDataSource.params) {
          url = this.setParamsDataSourceService(JSON.parse(this.fieldDataSource.params), url);
        }
        // no se ejecuta si ocurrio un error estableciendo el where
        if (!this.dataSourceVisible) {
          return;
        }
        this.http.get<any>(url).subscribe((response) => {
          if (this.fieldDataSource.dataSourceObject) {
            this.listDataSource = response[this.fieldDataSource.dataSourceObject];
          } else {
            this.listDataSource = response;
          }
        }, () => {
          this.sharedService.error('Error consumiendo el servicio');
          this.listDataSource = [];
        });
        break;
      default:
        setTimeout(() => {
          this.dataSourceGrid.instance.option('columns', []);
          this.dataSourceGrid.instance.addColumn({ dataField: 'value', caption: 'Valor' });
          this.dataSourceGrid.instance.addColumn({ dataField: 'text', caption: 'Etiqueta' });
          this.listDataSource = this.fieldDataSource.fixedList;
        }, 200);
    }
  }

  prepareEvent() {
    if (!this.listMetadataControlEvent) {
      return;
    }
    for (const item of this.listMetadataControlEvent) {
      const editor = this.listItemsForm.filter((x) => x.dataField === item.dataField)[0];
      if (!editor) {
        continue;
      }
      switch (item.eventName) {
        case 'onEnterKey':
          editor.editorOptions.onEnterKey = this.onEnterKeyControl;
          break;
        case 'onFocusIn':
          editor.editorOptions.onFocusIn = this.onFocusInControl;
          break;
        case 'onFocusOut':
          editor.editorOptions.onFocusOut = this.onFocusOutControl;
          break;
        case 'onValueChanged':
          editor.editorOptions.onValueChanged = this.onValueChangedControl;
          break;
      }
    }
  }

  onEnterKeyControl = (e) => {
    this.hideField(e.component.option('name'), 'onEnterKey');
    this.executeRule(e.component.option('name'), 'onEnterKey');
  }

  onFocusInControl = (e) => {
    this.hideField(e.component.option('name'), 'onFocusIn');
    this.executeRule(e.component.option('name'), 'onFocusIn');
  }

  onFocusOutControl = (e) => {
    this.hideField(e.component.option('name'), 'onFocusOut');
    this.executeRule(e.component.option('name'), 'onFocusOut');
  }

  onValueChangedControl = (e) => {
    this.hideField(e.component.option('name'), 'onValueChanged');
    this.executeRule(e.component.option('name'), 'onValueChanged');
    this.otherField(e.component.option('name'), 'onValueChanged');
  }

  hideField(dataField: string, eventName: string) {
    // se establece esta variable para que sea valida en el eval
    const data = this.dataDetail;
    const event = this.listMetadataControlEvent.filter((x) => x.dataField === dataField && x.eventName === eventName)[0];
    const actions = event.actions.sort((a, b) => {
      if (a.sequence > b.sequence) {
        return 1;
      }
      if (a.sequence < b.sequence) {
        return -1;
      }
      return 0;
    });
    for (const action of actions) {
      switch (action.type) {
        case EventActionType.rest:
          break;
        case EventActionType.hideField:
          const hideField: HideField = action.config;
          const values = hideField.value.split(';');
          const listEpresionValues: any[] = [];
          for (const value of values) {
            if (value.startsWith('{')) {
              if (!this.dataDetail[value.replace('{', '').replace('}', '')]) {
                continue;
              }
              listEpresionValues.push(`data.${dataField} ${hideField.operator} data.${value.replace('{', '').replace('}', '')}`);
            } else {
              const itemTmp = this.listItemsForm.find((x) => x.dataField === dataField);
              if (itemTmp.editorType === 'dxDateBox') {
                listEpresionValues.push(`data.${dataField} ${hideField.operator} new Date('${value}')`);
              } else {
                if (itemTmp.isForeignKey) {
                  if (itemTmp.dataType === 'uniqueidentifier' || itemTmp.dataType === 'varchar') {
                    if (data[dataField.replace(/^FK/, '')] !== undefined && data[dataField.replace(/^FK/, '')] !== null) {
                      listEpresionValues.push(`data.${dataField.replace(/^FK/, '')}.toUpperCase() ${hideField.operator} '${value}'.toUpperCase()`);
                    } else {
                      listEpresionValues.push(`data.${dataField.replace(/^FK/, '')} ${hideField.operator} '${value}'.toUpperCase()`);
                    }
                  } else {
                    listEpresionValues.push(`data.${dataField.replace(/^FK/, '')} ${hideField.operator} ${value}`);
                  }
                } else {
                  listEpresionValues.push(`data.${dataField} ${hideField.operator} ${value}`);
                }
              }
            }
          }
          let expresion = listEpresionValues[0];
          if (listEpresionValues.length > 1) {
            expresion = listEpresionValues.join(` || `);
          }
          if (eval(expresion)) {
            let refresDetails = false;
            for (const field of hideField.hideFields) {
              // se valida si es un item del formulario o un detalle
              if (!new RegExp(/^\d+$/).test(field)) {
                if (this.form.instance.itemOption(field)) {
                  this.form.instance.itemOption(field, 'visible', hideField.visible);
                }
              } else {
                const item = this.listMainFormMasterDetail.find(x => x.Id === +field);
                if (item) {
                  item.Visible = hideField.visible;
                  refresDetails = true;
                }
              }
            }
            // refrescamos los detalles
            if (this.editMode && refresDetails) {
              this.showMasterDetail = false;
              setTimeout(() => {
                this.showMasterDetail = true;
              }, 100);
            }
          }
          break;
        case EventActionType.operation:
          break;
      }
    }
    this.setColorLabels();
  }

  async executeRule(dataField: string, eventName: string) {
    const event = this.listMetadataControlEvent.filter((x) => x.dataField === dataField && x.eventName === eventName)[0];
    const actions = event.actions.sort((a, b) => {
      if (a.sequence > b.sequence) {
        return 1;
      }
      if (a.sequence < b.sequence) {
        return -1;
      }
      return 0;
    });
    for (const action of actions) {
      if (action.type === EventActionType.rule) {
        const ruleAction: RuleAction = action.config;
        let rule = {
          RuleCode: ruleAction.ruleCode,
          Variables: []
        };

        for (const param of ruleAction.parameters) {
          if (param.dataType === 'date') {
            param.dataType = 'DateTime';
          }
          // si el valor se debe obtener de un campo del formulario
          if (param.sourceType === 2) {
            const itemTmp = this.listItemsForm.find(x => x.dataField.replace(/^FK/, '') === param.value.replace(/^FK/, ''));
            if (itemTmp.dataType !== 'bit' && !this.dataDetail[param.value]) {
              this.sharedService.warning(`El campo ${itemTmp.label.text} no tiene valor establecido`);
              rule = null;
              break;
            }
            const paramSend = { ...param };
            paramSend.value = this.dataDetail[param.value];
            rule.Variables.push(paramSend);
          } else {
            rule.Variables.push(param);
          }
        }
        // si la configuracion no es valida se detiene el proceso
        if (!rule) {
          return;
        }
        // ejecutamos la regla
        try {
          this.sharedService.showLoader(true);
          const response: any = await this.dynamicProgramsService.executeRule(rule).toPromise();
          if (response.isSuccessful) {
            // se setea el resultado en el campo
            this.dataDetail[ruleAction.setValueField] = response.result.result;
            if (response.result.message) {
              this.sharedService.info(response.result.message);
            }

          } else if (response.IsError) {
            this.sharedService.error(response.errorMessage);
          } else {
            this.sharedService.warning(response.messages);
          }
          this.sharedService.showLoader(false);
        } catch (error) {
          this.sharedService.error('Ocurrio un error inesperado');
          this.sharedService.showLoader(false);
        }

      }
    }
  }

  async otherField(dataField: string, eventName: string) {
    //si no hay cambio de valor no ejecutar funcion o metodo
    if (this.dataDetail[`DsV${dataField}`]) {
      if (this.dataDetail[`DsV${dataField}`] === this.dataDetailAnt[dataField.replace(/^FK/, '')]) {
        return;
      }
    }
    else {
      if (this.dataDetail[dataField.replace(/^FK/, '')] === this.dataDetailAnt[dataField.replace(/^FK/, '')]) {
        return;
      }
    }
    const event = this.listMetadataControlEvent.filter((x) => x.dataField === dataField && x.eventName === eventName)[0];
    const actions = event.actions.sort((a, b) => {
      if (a.sequence > b.sequence) {
        return 1;
      }
      if (a.sequence < b.sequence) {
        return -1;
      }
      return 0;
    });
    for (const action of actions) {
      switch (action.type) {
        case EventActionType.otherField:
          const otherField: OtherField = action.config;
          if (otherField.type === 1) { //valor fijo
            this.dataDetail[otherField.field] = otherField.valuefunc;
          }
          else if (otherField.type === 2) { //funcion
            //validar en listado de funciones                        
            const lfunction = this.listFunctions.filter(x => `${x.FunctionCode}()` === otherField.valuefunc)[0];
            if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
              await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, false);
            }
            if (lfunction && !this.errorValdocu) {
              //reemplazar variables                            
              let lcadena = lfunction.FunctionBody;
              let lpos1 = lcadena.indexOf('{');
              let lpos2 = lcadena.indexOf('}');
              while (lpos1 !== -1) {
                const lvar = lcadena.substring(lpos1, lpos2 + 1);
                const lfield = otherField.varsfunc.filter(y => `{${y.variable}}` === lvar)[0].field;
                let lvalor = '';
                this.dataDetail[`DsV${lfield.replace(/^FK/, '')}`] ? lvalor = this.dataDetail[`DsV${lfield.replace(/^FK/, '')}`] :
                  lvalor = this.dataDetail[lfield.replace(/^FK/, '')];
                //obtener el tipo de variables
                const ltype = this.listItemsForm.filter(z => z.dataField === lfield)[0].dataType;
                switch (ltype) {
                  case 'datetime':
                  case 'datetime2':
                  case 'smalldatetime':
                  case 'date':
                    lvalor = `${moment(lvalor).locale('es-CO').format('DD/MM/YYYY')}`;
                    lvalor = `'${lvalor.substring(6, 10)}${lvalor.substring(3, 5)}${lvalor.substring(0, 2)}'`;
                    break;
                  case 'int':
                  case 'decimal':
                  case 'smallint':
                  case 'numeric':
                  case 'tinyint':
                  case 'bigint':
                  case 'number':
                    break;
                  case 'bit':
                    break;
                  default:
                    lvalor = `'${lvalor}'`;
                    break;
                }
                lcadena = lcadena.replace(lvar, lvalor);
                lpos1 = lcadena.indexOf('{', lpos2 + 1);
                lpos2 = lcadena.indexOf('}', lpos1 + 1);
              }
              //obtener el tipo de salida
              let ltipoOut = '';
              switch (this.listItemsForm.filter(z => z.dataField === otherField.field)[0].dataType) {
                case 'datetime':
                case 'datetime2':
                case 'smalldatetime':
                case 'date':
                  ltipoOut = 'D';
                  break;
                case 'int':
                case 'decimal':
                case 'smallint':
                case 'numeric':
                case 'tinyint':
                case 'bigint':
                case 'number':
                  ltipoOut = 'N';
                  break;
                case 'bit':
                  ltipoOut = 'S';
                  break;
                default:
                  ltipoOut = 'S';
                  break;
              }
              //consumir servicio
              const dataRest: any = {};
              dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
              dataRest['out_type'] = ltipoOut;
              dataRest['fun_body'] = lcadena;
              if (lcadena.includes('undefined')) {
                this.sharedService.error(`No se han definido valores necesarios para función: ${otherField.valuefunc}`);
                return;
              }
              this.mainFormService['ExecFunction'](dataRest).subscribe(
                (response: ActionResult) => {
                  if (response.IsSucessfull) {
                    //antes de asignar resultado asignar valor actual a dataAnt
                    this.dataDetailAnt[dataField.replace(/^FK/, '')] = this.dataDetail[dataField.replace(/^FK/, '')];
                    this.dataDetailAnt[dataField] = this.dataDetail[dataField];
                    ltipoOut === 'N' ? this.dataDetail[otherField.field] = response.Result.lGnFuncOut.show_result :
                      ltipoOut === 'D' ? this.dataDetail[otherField.field] = response.Result.lGnFuncOut.dtm_result :
                        ltipoOut === 'S' ? this.dataDetail[otherField.field] = response.Result.lGnFuncOut.show_result : '';
                    //remplazar valores internos en caso de ser asignacion a FK
                    ltipoOut === 'N' ? this.dataDetail[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.num_result :
                      ltipoOut === 'D' ? this.dataDetail[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.dtm_result :
                        ltipoOut === 'S' ? this.dataDetail[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.str_result : '';
                  } else {
                    this.sharedService.warning(`${otherField.valuefunc}: ${response.ErrorMessage}`);
                  }
                  this.sharedService.showLoader(false);
                },
                () => {
                  this.sharedService.error('Ocurrio un error inesperado');
                  this.sharedService.showLoader(false);
                }
              );
            }
            else {
              switch (otherField.valuefunc) {
                case "YEAR()":
                  this.dataDetail[otherField.field] = moment(this.dataDetail[dataField]).format('YYYY');
                  break;
                case "MONTH()":
                  this.dataDetail[otherField.field] = moment(this.dataDetail[dataField]).format('MM');
                  break;
                case "DAY()":
                  this.dataDetail[otherField.field] = moment(this.dataDetail[dataField]).format('DD');
                  break;
                case "NDATE()":
                  this.dataDetail[otherField.field] = moment(this.dataDetail[dataField]).format('YYYYMMDD');
                  break;
                case "DTOVER()":
                  if (this.dataDetail['TIP_CODI'] === undefined) {
                    this.sharedService.error('No hay valor para tipo de documento');
                    return;
                  }
                  //consumir servicio
                  this.mainFormService.getDtoVer(this.dataDetail['TIP_CODI'], this.dataDetail[dataField]).subscribe((response: ActionResult) => {
                    if (response.IsError) {
                      this.sharedService.error(lfunction.FunctionCode + response.ErrorMessage);
                      return;
                    }
                    else {
                      this.dataDetail[otherField.field] = response.Result.val_dive;
                    }
                  });
                  break;
                case "VALBLOMES()":
                  //consumir servicio
                  if (this.dataDetail[dataField]) {
                    this.mainFormService.getValBloMes(this.sessionService.session.selectedCompany.code, this.mainForm.TableName.slice(0, 2), moment(this.dataDetail[dataField]).format('DD/MM/YYYY')).subscribe((response: ActionResult) => {
                      if (!response.IsSucessfull) {
                        this.sharedService.error(response.ErrorMessage);
                        this.dataDetail[dataField] = null;
                        return;
                      }
                      else {
                        //
                      }
                    });
                  }
                  break;
                case "VALTIPOPE()":
                  //consumir servicio                  
                  if (this.dataDetail[dataField]) {
                    const lmodulo = this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0] ? this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0].Value : this.mainForm.TableName.slice(0, 2);
                    this.mainFormService.getValTipOpe(this.sessionService.session.selectedCompany.code,
                      this.dataDetail[dataField.replace(/^FK/, '')], lmodulo,
                      this.sessionService.session.accountCode, this.mainForm.SubTitle).subscribe((response: ActionResult) => {
                        if (!response.IsSucessfull) {
                          this.sharedService.error(response.ErrorMessage);
                          this.dataDetail[dataField] = null;
                          return;
                        }
                        else {
                          //Fecha automatica
                          if (response.Result.lGnToper.top_feau === 'S') {
                            this.dataDetail[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value] = moment().locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
                            this.form.instance.getEditor(this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value).option('readOnly', true);
                          }
                          else {
                            this.form.instance.getEditor(this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value).option('readOnly', false);
                          }
                          //Numeracion automatica
                          if (response.Result.lGnToper.top_auto === 'S') {
                            this.form.instance.getEditor(this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0].Value).option('readOnly', true);
                          }
                          else {
                            this.form.instance.getEditor(this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0].Value).option('readOnly', false);
                          }
                        }
                      });
                  }
                  break;
              }
            }
          }
          else if (otherField.type === 3) { //metodo
            if (this.parentMainForm.Transaccion === 'S' || this.SupParentMainForm.Transaccion === 'S') {
              await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, false);
            }
            if (!this.errorValdocu && otherField.parInmethod) {
              const lmethod = this.listMethods.filter(x => x.MethodCode === otherField.valuefunc)[0];
              const lmethodDef = JSON.parse(lmethod.MethodBody);
              //consumir servicio
              const dataRest: any = {};
              const lparams = [];
              const lvalues = [];
              dataRest['program'] = lmethodDef.program;
              dataRest['method'] = lmethodDef.method;
              for (const item of otherField.parInmethod) {
                lparams.push(item.param);
                if (this.listItemsForm.find(x => x.dataField === item.field && x.dataType === 'datetime') !== undefined) {
                  lvalues.push(moment(this.dataDetail[item.field]).format('DD/MM/YYYY'));
                }
                else if (item.field.startsWith('FK')) {
                  const valor = this.dataDetail[item.field];
                  isNaN(valor) ? lvalues.push(this.dataDetail[item.field].substr(0, this.dataDetail[item.field].indexOf('|') - 1)) : lvalues.push(this.dataDetail[item.field]);
                }
                else {
                  lvalues.push(this.dataDetail[item.field]);
                }
              }
              dataRest['fields'] = lparams.join(',');
              dataRest['values'] = lvalues.join(',');
              if (lvalues.join(',').includes('undefined')) {
                this.sharedService.error(`No se han definido valores necesarios para método: ${otherField.valuefunc}`);
                return;
              }
              this.mainFormService['ExecMethod'](dataRest).subscribe(
                (response: ActionResult) => {
                  if (response.IsSucessfull) {
                    //asignar parametros de salida
                    const lresult = response.Result;
                    for (const item of otherField.parOutmethod) {
                      if (this.listItemsForm.find(x => x.dataField === item.field && x.dataType === 'datetime') !== undefined) {
                        const dt = lresult.filter(x => x.param === item.param)[0].value;
                        this.dataDetail[item.field] = new Date(dt.slice(6, 10), dt.slice(3, 5) - 1, dt.slice(0, 2), 0, 0, 0, 0);
                      }
                      else {
                        this.dataDetail[item.field] = lresult.filter(x => x.param === item.param)[0].value;
                        lresult.filter(x => x.param === item.param)[0].intvalue !== -1 ?
                          this.dataDetail[item.field.replace(/^FK/, '')] = lresult.filter(x => x.param === item.param)[0].intvalue :
                          this.dataDetail[item.field.replace(/^FK/, '')] = lresult.filter(x => x.param === item.param)[0].value;
                      }
                    }
                  } else {
                    this.sharedService.warning(`${otherField.valuefunc}: ${response.ErrorMessage}`);
                  }
                  this.sharedService.showLoader(false);
                },
                () => {
                  this.sharedService.error('Ocurrio un error inesperado');
                  this.sharedService.showLoader(false);
                }
              );
            }
          }
          break;
      }
    }
    this.setColorLabels();
  }

  setDisplayFileUpload() {
    for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
      if (!this.dataDetail[item.dataField]) {
        continue;
      }
      this.dataDetail[`OPHFU_${item.dataField}`] = this.dataDetail[item.dataField];
      this.dataDetail[item.dataField] = this.dataDetail[item.dataField].split('_OPHFU_')[0];
    }
  }

  async runOnBeforeSaveEvent(pData: any, pDataAnt: any, pEstado: string) {
    this.errorBeforeSave = false;
    if (!this.listMetadataFormEvent) {
      return;
    }
    if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onBeforeSave').length > 0) {
      const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onBeforeSave')[0];
      for (const action of event.actions) {
        switch (action.type) {
          case EventActionType.rest:
            const actionRest: RestForm = action.config;
            // metodo post
            if (actionRest.method === 1) {
              const dataRest: any = {};
              dataRest['data'] = pData;
              dataRest['dataAnt'] = pDataAnt;
              dataRest['estado'] = pEstado;
              try {
                const resultEvent: ActionResultT<any> = await this.http.post<ActionResultT<any>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                if (resultEvent.IsSucessfull) {
                  if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                    for (const item of actionRest.messages) {
                      if (item.type === 'M' && resultEvent.Messages[item.id - 1].length > 0) {
                        await this.sharedService.alertMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                      }
                      else if (item.type === 'D' && resultEvent.Messages[item.id - 1].length > 0) {
                        const lshow = await this.sharedService.confirmMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                        if (!lshow) {
                          return;
                        }
                      }
                      else if (item.type === 'C') {
                        this.messageTitle = item.description;
                        this.listDataMessage = resultEvent.Result;
                        this.listDataMessage.length > 0 ? this.showPopupMessage = true : '';
                      }
                      else if (item.type === 'O') {
                        this.dataOut = JSON.parse(resultEvent.Result);
                        for (const item of Object.entries(this.dataOut)) {
                          const field = item[0].toUpperCase();
                          this.dataDetail[field] = item[1];
                        }
                      }
                    }
                  }
                  else if (actionRest.responseMessage) {
                    this.sharedService.hide();
                    setTimeout(() => {
                      this.sharedService.success(actionRest.responseMessage);
                    }, 500);
                  }
                }
                else {
                  this.errorBeforeSave = true;
                  this.sharedService.error(resultEvent.ErrorMessage);
                }
              } catch (error) {
                this.errorBeforeSave = true;
                this.sharedService.error(error);
              }
            }
            else {
              // metodo get
            }
            break;
        }
      }
    }
  }

  async runOnSaveEvent() {
    if (!this.listMetadataFormEvent) {
      return;
    }
    if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onSave').length > 0) {
      const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onSave')[0];
      for await (const action of event.actions) {
        switch (action.type) {
          case EventActionType.rest:
            const actionRest: RestForm = action.config;
            // metodo post
            if (actionRest.method === 1) {
              const dataRest: any = {};
              for (const param of actionRest.params) {
                if (param.value.startsWith('{')) {
                  const listValues = [];
                  for (const item of param.value.split(';')) {
                    if (this.dataDetail[item.replace('{', '').replace('}', '')]) {
                      listValues.push(this.dataDetail[item.replace('{', '').replace('}', '')]);
                    }
                  }
                  dataRest[param.key] = listValues.join(' ');
                } else {
                  dataRest[param.key] = param.value;
                }
              }
              try {
                //condicionar para formularios que lo requieran
                // const httpOptions = {
                //   headers: new HttpHeaders({
                //     Authorization: ''
                //   })
                // };
                //const resultEvent: ActionResult = await this.http.post<ActionResult>(actionRest.url, dataRest).toPromise();
                const resultEvent: ActionResultT<any> = await this.http.post<ActionResultT<any>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                if (resultEvent.IsSucessfull) {
                  if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                    for (const item of actionRest.messages) {
                      if (item.type === 'M' && resultEvent.Messages[item.id - 1].length > 0) {
                        await this.sharedService.alertMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                      }
                      else if (item.type === 'D' && resultEvent.Messages[item.id - 1].length > 0) {
                        const lshow = await this.sharedService.confirmMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                        if (!lshow) {
                          return;
                        }
                      }
                      else if (item.type === 'C') {
                        this.messageTitle = item.description;
                        this.listDataMessage = resultEvent.Result;
                        this.listDataMessage.length > 0 ? this.showPopupMessage = true : '';
                      }
                    }
                  }
                  else if (actionRest.responseMessage) {
                    this.sharedService.hide();
                    setTimeout(() => {
                      this.sharedService.success(actionRest.responseMessage);
                    }, 500);
                  }
                  actionRest.redirect ? this.responseRefresh.emit(actionRest.redirect) : this.responseRefresh.emit(true);
                }
              } catch (error) {

              }
            } else {
              // metodo get
            }
            break;
        }
      }
    }
  }

  async runOnButtonEvent(pSequence: number) {
    if (!this.listMetadataFormEvent) {
      return;
    }
    if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onButton').length > 0) {
      const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onButton')[0];
      for (const action of event.actions.filter((y) => y.sequence === pSequence)) {
        switch (action.type) {
          case EventActionType.rest:
            const actionRest: RestForm = action.config;
            // metodo post
            if (actionRest.method === 1) {
              const dataRest: any = {};
              for (const param of actionRest.params) {
                if (param.value.startsWith('{')) {
                  const listValues = [];
                  for (const item of param.value.split(';')) {
                    if (this.dataDetail[item.replace('{', '').replace('}', '')]) {
                      listValues.push(this.dataDetail[item.replace('{', '').replace('}', '')]);
                    }
                  }
                  dataRest[param.key] = listValues.join(' ');
                } else {
                  dataRest[param.key] = param.value;
                }
              }
              try {
                //condicionar para formularios que lo requieran
                // const httpOptions = {
                //   headers: new HttpHeaders({
                //     Authorization: ''
                //   })
                // };
                const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                if (resultEvent.IsSucessfull) {
                  if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                    for (const item of actionRest.messages) {
                      if (item.type === 'M' && resultEvent.Messages[item.id - 1].length > 0) {
                        await this.sharedService.alertMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                      }
                      else if (item.type === 'D' && resultEvent.Messages[item.id - 1].length > 0) {
                        const lshow = await this.sharedService.confirmMessage(resultEvent.Messages[item.id - 1],
                          item.description);
                        if (!lshow) {
                          return;
                        }
                      }
                      else if (item.type === 'C') {
                        this.messageTitle = item.description;
                        this.listDataMessage = resultEvent.Result;
                        this.listDataMessage.length > 0 ? this.showPopupMessage = true : '';
                      }
                      else if (item.type === 'A') {
                        //const source = resultEvent.Messages[item.id - 1];
                        const source = resultEvent.Messages[item.id - 1].split('|')[1];
                        const link = document.createElement("a");
                        link.href = source;
                        //link.download = `${item.description}.docx`;
                        link.download = resultEvent.Messages[item.id - 1].split('|')[0];
                        setTimeout(() => {
                          link.click();
                        }, 1000);
                      }
                    }
                  }
                  else if (actionRest.responseMessage) {
                    this.sharedService.hide();
                    setTimeout(() => {
                      this.sharedService.success(actionRest.responseMessage);
                    }, 500);
                  }
                  this.responseRefresh.emit(true);
                }
                else {
                  this.sharedService.error(resultEvent.ErrorMessage);
                }
              } catch (error) {
                this.sharedService.error(error);
              }
            } else {
              // metodo get
            }
            break;
        }
      }
    }
    else {
      this.sharedService.warning('No hay configuración establecida para el evento Botón funcionalidad');
    }
  }

  async button(pSequence: number) {
    //validacion modificacion documento
    // if (this.mainForm.Transaccion === 'S') {
    //   try {
    //     this.sharedService.showLoader(true);
    //     await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
    //     this.sharedService.showLoader(false);
    //   }
    //   catch {
    //     this.sharedService.error('Ocurrio un error inesperado');
    //     this.sharedService.showLoader(false);
    //   }
    // }
    // si tiene configuracion de eventos de boton
    //if (!this.errorValdocu) { //No se realiza validacion de edicion de documento, debe ser responsabilidad del back
    try {
      const listConditionsKey = [];
      for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
        const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
        listConditionsKey.push(`${item.Name}='${this.itemRowClickData[column.dataField]}'`);
      }
      this.searchData.where = ` WHERE ${listConditionsKey.join(' AND ')}`;
      const resultData: ActionResult = await this.dynamicProgramsService.getByPrimaryKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
      setTimeout(async () => {
        this.dataDetail = resultData.Result;
        this.sharedService.showLoader(true);
        await this.runOnButtonEvent(pSequence);
        this.sharedService.showLoader(false);
      }, 500);
    }
    catch {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
    //}
  }

  heightScroll = () => {
    return Math.round(window.innerHeight / 1.3);
  }

  onRowUpdated(e) {
    // se establece como modificado el item
    e.data.changeTrackerRow = 'modified';
  }

  responseImport(e: boolean) {
    if (e) {
      // refrescamos la info
      this.listAllData();
    }
    this.showPopupImportExcel = false;
  }

  addMenuItems(e) {
    if (e.target == 'content' && this.mainForm.FuncEspec === 'UBICA') {
      if (!e.items) e.items = [];
      e.items.push({
        text: 'Asignar ubicaciones',
        onItemClick: async () => {
          await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
          if (!this.errorValdocu) {
            this.assignUbica(e.row.data.Reg);
          }
          else {
            //this.showPopupConsulUbica = true;
          }
        }
      },
        {
          text: 'Ver ubicaciones',
          onItemClick: () => {
            this.consultUbica(e.row.data.Reg);
            this.showPopupConsulUbica = true;
          }
        }
      );
    }
    else if (e.target == 'content' && this.specialDetConfig.columns) {
      if (!e.items) e.items = [];
      for (const item of this.specialDetConfig.columns) {
        e.items.push({
          text: item.label,
          onItemClick: async () => {
            await this.ValModifDocu(this.cEditando, this.gPro_codi, this.gTab_prin, true);
            if (!this.errorValdocu) {
              this.gItem = item.id;
              await this.listSpecialDet('', item.id);
            }
          }
        });
      }
    }
  }
  async consultUbica(dmo_cont: number) {
    const dataRest: any = {};
    dataRest['program'] = this.assignConsUbica.program;
    dataRest['method'] = this.assignConsUbica.methodC;
    dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
    dataRest['bas_cont'] = this.dataMaster[this.assignConsUbica.fields[0].field];
    dataRest['dmo_cont'] = dmo_cont;
    dataRest['table'] = this.assignConsUbica.tableC;
    dataRest['hiu_cons'] = this.assignConsUbica.idC;
    try {
      this.sharedService.showLoader(true);
      const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/ConsultUbica`;
      const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
      if (!resultEvent.IsSucessfull) {
        this.sharedService.showLoader(false);
        this.sharedService.error(resultEvent.ErrorMessage);
        return;
      }
      else {
        //asignar resultado
        this.listDataUbica = resultEvent.Result;
        this.showPopupConsulUbica = true;
        setTimeout(() => {
          this.consulUbicaGrid.instance.option('columns', []);
          this.consulUbicaGrid.instance.addColumn({ caption: 'Producto', dataField: 'pro_codi' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Lote sugerido', dataField: 'lot_nums' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Lote real', dataField: 'lot_numr' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Ubicación sugerida', dataField: 'ubi_cods' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Ubicación real', dataField: 'ubi_codr' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Cantidad sugerida', dataField: 'hiu_caus' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Cantidad real', dataField: 'hiu_caur' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Cantidad unidad presentación', dataField: 'hiu_canu' });
          this.consulUbicaGrid.instance.addColumn({ caption: 'Unidad de presentación', dataField: 'uni_iniu' });
        }, 200);
      }
      this.sharedService.showLoader(false);
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al consultar ubicaciones.');
        this.sharedService.showLoader(false);
        return;
      }, 1000);
    }
  }

  async assignUbica(dmo_cont: number) {
    const dataRest: any = {};
    dataRest['program'] = this.assignConsUbica.program;
    dataRest['method'] = this.assignConsUbica.methodA;
    dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
    dataRest['bas_cont'] = this.dataMaster[this.assignConsUbica.fields[0].field];
    dataRest['dmo_cont'] = dmo_cont;
    try {
      this.sharedService.showLoader(true);
      const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/AssignUbica`;
      const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
      if (!resultEvent.IsSucessfull) {
        this.sharedService.showLoader(false);
        this.sharedService.error(resultEvent.ErrorMessage);
        return;
      }
      else {
        this.sharedService.info('Ubicaciones asignadas correctamente');
      }
      this.sharedService.showLoader(false);
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al asignar ubicaciones.');
        this.sharedService.showLoader(false);
        return;
      }, 1000);
    }
  }

  async BeforeDelete() {
    this.errorDelete = false;
    const dataRest: any = {};
    try {
      if (!this.listMetadataFormEvent) { //no hay configuracion de eventos de formulario
        dataRest['table'] = this.mainForm.TableName;
        dataRest['where'] = this.searchData.where;
        const url = `${this.configService.config.urlWsGnGenerFuncs}BeforeDelete`;
        const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
        if (!resultEvent.IsSucessfull) {
          this.errorDelete = true;
          this.sharedService.error(resultEvent.ErrorMessage);
          return;
        }
        else {
          this.errorDelete = false;
        }
      }
      else {
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onBeforeDelete').length > 0) {
          const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onBeforeDelete')[0];
          for (const action of event.actions) {
            switch (action.type) {
              case EventActionType.rest:
                const actionRest: RestForm = action.config;
                // metodo post
                if (actionRest.method === 1) {
                  for (const param of actionRest.params) {
                    if (param.value.startsWith('{')) {
                      const listValues = [];
                      for (const item of param.value.split(';')) {
                        if (this.dataDetail[item.replace('{', '').replace('}', '')]) {
                          listValues.push(this.dataDetail[item.replace('{', '').replace('}', '')]);
                        }
                      }
                      dataRest[param.key] = listValues.join(' ');
                    } else {
                      dataRest[param.key] = param.value;
                    }
                  }
                  this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW' ? dataRest['table'] = this.mainForm.TableName : '';
                  try {
                    const resultEvent: ActionResultT<any> = await this.http.post<ActionResultT<any>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                    if (resultEvent.IsSucessfull) {
                      if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW' && resultEvent.Result.Retorno === 'I') {
                        this.errorDelete = true;
                        this.sharedService.showLoader(false);
                        return;
                      }
                      if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                        for (const item of actionRest.messages) {
                          if (item.type === 'M' && resultEvent.Messages[item.id - 1].length > 0) {
                            await this.sharedService.alertMessage(resultEvent.Messages[item.id - 1],
                              item.description);
                          }
                          else if (item.type === 'D' && resultEvent.Messages[item.id - 1].length > 0) {
                            const lshow = await this.sharedService.confirmMessage(resultEvent.Messages[item.id - 1],
                              item.description);
                            if (!lshow) {
                              return;
                            }
                          }
                          else if (item.type === 'C') {
                            this.messageTitle = item.description;
                            this.listDataMessage = resultEvent.Result;
                            this.listDataMessage.length > 0 ? this.showPopupMessage = true : '';
                          }
                        }
                      }
                      else if (actionRest.responseMessage) {
                        this.sharedService.hide();
                        setTimeout(() => {
                          this.sharedService.success(actionRest.responseMessage);
                        }, 500);
                      }
                    }
                    else {
                      this.errorDelete = true;
                      this.sharedService.showLoader(false);
                      this.sharedService.error(resultEvent.ErrorMessage);
                    }
                  } catch (error) {
                    this.errorDelete = true;
                    this.sharedService.showLoader(false);
                    this.sharedService.error(error);
                  }
                }
                break;
            }
          }
        }
        else {
          dataRest['table'] = this.mainForm.TableName;
          dataRest['where'] = this.searchData.where;
          const url = `${this.configService.config.urlWsGnGenerFuncs}BeforeDelete`;
          const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
          if (!resultEvent.IsSucessfull) {
            this.errorDelete = true;
            this.sharedService.error(resultEvent.ErrorMessage);
            return;
          }
          else {
            this.errorDelete = false;
          }
        }
      }
    }
    catch (error) {
      setTimeout(() => {
        this.sharedService.error('Error al realizar eliminacion de registros (BeforeDelete)');
        this.errorDelete = true;
      }, 1000);
    }
  }

  private prepareForNewDetail() {
    // Se hace reset a los items ya que después de editar un registro, este elimina el editorOptions.value, con lo cual se pierden los valores para un nuevo registro
    // Pendiente de validar por JEL, que es quién conoce la lógica
    this.listItemsForm = JSON.parse(this.mainForm.MetadataForm);
    this.editMode = false;
    this.setToolbarItemsMasterDetailPopup();
    this.dataDetail = {};
    this.dataDetailAnt = {}; //correccion F116
    this.listitemRowClickDataSource = [];
  }

  itemClick(e) {
    if (!this.itemRowClickData) {
      this.sharedService.error('Debe seleccionar un registro de la rejilla');
      return;
    }
    this.button(e.itemData.sequence);
  }

  responseRefreshDet(e: boolean) {
    this.editMode ? this.validateEdit() : this.save();
  }
  //#endregion
}

enum SearchMethod {
  Equals = 1,
  StartWith,
  Contains,
  EndWith
}

import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxContextMenuComponent, DxDataGridComponent, DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';
import FileSaver from 'file-saver';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EventProperty, HideField, RestForm, RuleAction, MainForm, Property, DataSource, ActionResult, KeyData, ColumnGrid, OtherField } from '../../models';
import moment from 'moment';
import 'moment/min/locales';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainFormService } from 'src/app/services/main-form.service';
import { SharedService } from 'src/app/services/shared.service';
import { CommonFunctions } from 'src/app/utils/common-functions';
import { DynamicProgramsService } from 'src/app/services/dynamic.programs.service';
import { SecurityService } from 'src/app/services/security.service';
import { EventActionType } from 'src/app/enums/event-action-type.enum';
import { DataSourceType } from 'src/app/enums/data-source-type.enum';
import { ConfigService } from 'src/app/services/config.service';
import { SessionService } from 'src/app/services/session.service';
import { ResourceType } from 'src/app/models/permission';
import { SAVE_ACTION, EDIT_ACTION, DELETE_ACTION, APPLY_ACTION, REVERT_ACTION, ANNUL_ACTION, NEW_ICON, SAVE_ICON, BACK_ICON, APPLY_ICON, REVERT_ICON, ANNUL_ICON, SEARCH_ICON, REPORT_ICON, COUNT_ICON, SUM_ICON, AUDIT_ICON, PROCESS_ICON, MCONT_ICON, ATTACH_ICON, DEFVAL_ICON } from 'src/app/utils/const';
import { MenuGroupItem, Menu, MenuGroup, MenuItem } from 'src/app/models/menu';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { TabForm, TabItem } from '../../models/tab-form';
import { MainFormTab } from '../../models/main-form-tab';
import { SecuritySevenService } from '../../services/security-seven.service';
import { CacheSearchConfig } from '../../models/cache-search';
import { MultiReport, ReportFilters, ReportParams, ReportTemptable } from 'src/app/models/report-config';
import { ActionResultT } from 'src/app/models/action-result';
import { BaseDocConfg } from 'src/app/models/basedoc-config';
import { ExecProcess } from 'src/app/models/process-config';
import { Functions } from 'src/app/models/function';
import * as CryptoJS from 'crypto-js';
import { Method } from 'src/app/models/method';
import { Attach } from 'src/app/models/attach';
import { Buttoncnfg } from 'src/app/models/button-config';

@Component({
    selector: 'app-form-visualization',
    templateUrl: './form-visualization.component.html',
    styleUrls: ['./form-visualization.component.scss']
})
export class FormVisualizationComponent implements OnInit {
    //#region Fields
    formId = uuid();
    gridId = uuid();
    gridForeignKeyId = uuid();
    gridDataSourceId = uuid();
    gridFileId = uuid();
    popUpForeignKeyId = uuid();
    popUpAddForeignKeyId = uuid();
    popUpDataSourceId = uuid();
    popUpFileId = uuid();
    popUpSearchId = uuid();
    popUpSearchFKId = uuid();
    popUpGnDocinId = uuid();
    popUpAuditId = uuid();
    formAuditId = uuid();
    gridSearchId = uuid();
    gridSearchFKId = uuid();
    gridGnDocinId = uuid();
    gridLogerId = uuid();
    popUpBaseDocId = uuid();
    popUpSearchBaseDocId = uuid();
    gridSearchBasedocId = uuid();
    gridBaseDocId = uuid();
    popUpMovContId = uuid();
    gridMovContId = uuid();
    popUpAttachId = uuid();
    gridAttachId = uuid();
    formAttachId = uuid();
    popUpDefValuesId = uuid();
    popUpMessageId = uuid();
    gridDefValuesId = uuid();
    gridMessageId = uuid();
    listFunctions: Functions[] = [];
    listMethods: Method[] = [];
    showPopupSearchConditions = false;
    showPopupDefaultValues = false;
    showPopupMessage = false;
    showPopupSearchFKConditions = false;
    showPopupSearchBasedocConditions = false;
    showPopupGnDocin = false;
    showPopupMcont = false;
    showPopupAttach = false;
    docinTitle = '';
    messageTitle = '';
    errorBeforeSave = false;
    errorValBlome = false;
    errorValTree = false;
    errorTemptable = false;
    errorValdocu = false;
    errorProcess = false;
    errorDelete = false;
    fileBase64 = '';
    docBase64 = '';
    gprc_cont = -1;
    gcon_disp = 0;
    showPopupAudit = false;
    listSearchConditions: any[] = [];
    listSumAuditConditions: any[] = [];
    listSearchFKConditions: any[] = [];
    listSearchBasedocConditions: any[] = [];
    listDefValues: any[] = [];
    listGnVadep: any[] = [];
    listGnDocin: any[] = [];
    listLoger: any[] = [];
    listitemRowClickDataSource: any[] = [];
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
    listOperatorUnion: any[] = [
        { value: '', text: '' },
        { value: 'AND', text: 'Y' },
        { value: 'OR', text: 'O' }
    ];
    listDataType: any[] = [
        { value: 'datetime', text: 'D' },
        { value: 'datetime2', text: 'D' },
        { value: 'smalldatetime', text: 'D' },
        { value: 'date', text: 'D' },
        { value: 'int', text: 'N' },
        { value: 'decimal', text: 'N' },
        { value: 'smallint', text: 'N' },
        { value: 'numeric', text: 'N' },
        { value: 'tinyint', text: 'N' },
        { value: 'bigint', text: 'N' },
        { value: 'number', text: 'N' },
        { value: 'varchar', text: 'S' },
        { value: 'char', text: 'S' },
    ];
    listColumns: ColumnGrid[] = [];
    listActions: Menu[];
    @ViewChild('form') form: DxFormComponent;
    @ViewChild('grid') grid: DxDataGridComponent;
    @ViewChild('foreignKeyGrid') foreignKeyGrid: DxDataGridComponent;
    @ViewChild('dataSourceGrid') dataSourceGrid: DxDataGridComponent;
    @ViewChild('treeViewId', { static: false }) treeViewId: DxTreeViewComponent;
    @ViewChild('contextMenuId', { static: false }) contextMenuId: DxContextMenuComponent;
    @ViewChild('baseDocGrid') baseDocGrid: DxDataGridComponent;
    @ViewChild('movContGrid') movContGrid: DxDataGridComponent;
    @ViewChild('messageGrid') messageGrid: DxDataGridComponent;
    @ViewChild('txtImport') txtImport: ElementRef;
    @ViewChild('docImport') docImport: ElementRef;
    showPopupImportExcel = false;
    formTitle: string;
    formSubTitle: string;
    attachForm: Attach;
    mainForm: MainForm;
    listMainFormMasterDetail: MainForm[] = [];
    icon: string;
    visualizeForm = false;
    treeView = false;
    newTree = false;
    reportView = false;
    processView = false;
    txtField = '';
    docField = '';
    tar_codi = 0;
    cam_movi = '';
    tab_nive = '';
    refresh = false;
    listItemsForm: Property[] = [];
    listCacheSearch: CacheSearchConfig[] = [];
    // se usa para poder restablecer valores cuando redireccionan
    listItemsFormTmp: string;
    listColumsGrid: any[] = [];
    listMetadataControlEvent: EventProperty[] = [];
    listMetadataFormEvent: EventProperty[] = [];
    listButtons: Buttoncnfg[] = [];
    showMasterDetail = false;
    toolBarButtons = { add: true, save: false, edit: false, redirect: false };
    data: any = {};
    dataAnt: any = {};
    dataOut: any = {};
    listData: any[] = [];
    listDataForeignKey: any[] = [];
    listDataBaseDoc: any[] = [];
    listDataMovCont: any[] = [];
    listDataAttach: any[] = [];
    listPassFields: any[] = [];
    listDataMessage: any[] = [];
    editMode = false;
    empcodiFilter = '';
    conditionsRecordKey = [];
    @Input() formCode: string;
    //@ViewChild(DxDataGridComponent) grid: DxDataGridComponent;    
    searchVisible = false;
    searchBaseDoc = false;
    errorload = false;
    page = 1;
    pageSearch = 1;
    totalRecords = 0;
    sumRecords = 0;
    totalRecordsSearch: number;
    foreignKeyData: Property;
    cacheSearch: CacheSearchConfig;
    formTabItem: TabForm[] =
        [
            {
                "itemType": "tabbed",
                "colCount": 4,
                "tabs": [

                ]
            }
        ];
    formTabs: MainFormTab[] = [];
    listParams: ReportParams[] = [];
    listFilters: ReportFilters[] = [];
    listFiltersF: ReportFilters[] = [];
    tempTable: ReportTemptable;
    listMultiReport: MultiReport[] = [];
    execProces: ExecProcess;
    listVarsTransaction: any[] = [];
    baseDocConfig: BaseDocConfg;
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
    auditData = {
        dateini: new Date(),
        datefin: new Date(),
        user: ''
    };
    itemSelected: any;
    itemRowClickSearch: any;
    itemRowClickBaseDoc: any;
    itemRowClick: any;
    itemColumnClick: any;
    searchMethod: SearchMethod = SearchMethod.StartWith;
    criteria = '';
    criteriaSearch = '';
    metadataGrid: any;
    fileUploadVisible = false;
    public uploader: FileUploader = new FileUploader({ autoUpload: true, url: `${this.configService.config.opheliaSuiteCoreApiV1}Upload/UpDocument`, method: 'POST' });
    public hasBaseDropZoneOver = false;
    libraryId: number;
    itemUpload: Property;
    listDocuments: any[] = [];
    listItemsDataSource: DataSource[] = [];
    dataSourceVisible = false;
    listDataSource: any[] = [];
    TreeListData: any[] = [];
    currentTreeItem: any;
    itemRowClickDataSource: any;
    fieldDataSource: DataSource;
    toolbarPopupsConfig = {
        toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
    };

    toolbarItemsForeignKeyPopup = [
        {
            ...this.toolbarPopupsConfig,
            options: {
                text: 'Aceptar',
                icon: 'fas fa-bolt',
                elementAttr: { class: 'primary-button-color' },
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
                icon: 'far fa-window-close',
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
                    //this.showPopupSearchFKConditions = true;
                    this.searchFK();
                }
            }
        }

    ];
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
    toolbarItemsSearchPopup = [
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
                    this.setConditions();
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
                    this.showPopupSearchConditions = false;
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
                    this.listSearchConditions = [];
                    this.search();
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

    toolbarItemsGnDocinPopup = [
        {
            ...this.toolbarPopupsConfig,
            options: {
                elementAttr: { class: 'primary-button-color' },
                text: 'Imprimir Inconsistencias',
                icon: 'fas fa-print',
                onClick: () => {
                    this.docinReport();
                    //this.showPopupGnDocin = false;
                }
            }
        }
    ];

    toolbarItemsAuditPopup = [
        {
            ...this.toolbarPopupsConfig,
            options: {
                elementAttr: { class: 'primary-button-color' },
                text: 'Consultar',
                icon: 'fas fa-search',
                onClick: () => {
                    this.audit();
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
                    this.ValModifDocu(this.cEditando, true, false);
                    if (!this.errorValdocu) {
                        this.data[this.baseDocConfig.basefield] = this.itemRowClickBaseDoc['bas_cont'];
                        this.sharedService.info('Al guardar registro se cargaran los detalles');
                        this.searchBaseDoc = false;
                    }
                    else {
                        this.searchBaseDoc = false;
                    }

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

    toolbarItemsMovContPopup = [
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Cerrar',
                icon: 'far fa-window-close',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.showPopupMcont = false;
                }
            }
        }
    ];

    toolbarItemsAttachPopup = [
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Adicionar',
                icon: 'fas fa-folder-plus',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.sharedService.info('Adicionar');
                }
            }
        },
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Descargar',
                icon: 'fas fa-download',
                elementAttr: { class: 'secondary-button-color' },
                onClick: () => {
                    this.sharedService.info('Descargar');
                }
            }
        },
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Eliminar',
                icon: 'fas fa-folder-minus',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.sharedService.info('Eliminar');
                }
            }
        },
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Cerrar',
                icon: 'far fa-window-close',
                elementAttr: { class: 'secondary-button-color' },
                onClick: () => {
                    this.showPopupAttach = false;
                }
            }
        }
    ];

    toolbarItemsDefValuesPopup = [
        {
            toolbar: 'bottom',
            location: 'center',
            widget: 'dxButton',
            visible: true,
            options: {
                text: 'Guardar',
                icon: 'far fa-save',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.setDefval();
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
                    this.showPopupDefaultValues = false;
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
                    this.listDefValues = [];
                    this.defval(true);
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

    menuItems: MenuItem[] = [
        { id: 'view', text: 'Consultar' },
        { id: 'add', text: 'Insertar' },
        { id: 'delete', text: 'Eliminar' },
        { id: 'refresh', text: 'Refrescar' }
    ];

    @Input() isWidget = false;
    @Input() recordId: string;

    listItemChangeLabelColor: any[] = [];
    showPopupAddForeignKey = false;
    formCodeForeignKey = '';
    @Input() addInForeignKey = false;
    @Output() saveSuccess = new EventEmitter<any>();
    validationGroupName = '';
    titlePopupAddForeignKey = '';
    searchTitle = '';
    baseDocTitle = '';
    listPermisions = [];
    cAplicando = 1;
    cEditando = 2;
    cRevertiendo = 3;
    cAnulando = 4;
    //#endregion

    //#region Builder
    constructor(
        private http: HttpClient,
        public router: Router,
        public sharedService: SharedService,
        private mainFormService: MainFormService,
        private commonFunctions: CommonFunctions,
        private dynamicProgramsService: DynamicProgramsService,
        private activatedRoute: ActivatedRoute,
        private securityService: SecuritySevenService,
        private configService: ConfigService,
        private sessionService: SessionService,
        private stylingService: StylingService
    ) {
        //this.attachForm = new Attach();
    }

    //#endregion

    //#region Events
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(async (params) => {
            if (params.formCode && !this.addInForeignKey) {
                this.formCode = params.formCode;
                this.visualizeForm = false;
            }

            const resultPermisions = await this.securityService.getPermisions(this.formCode).toPromise();
            if (resultPermisions.isSuccessful) {
                this.listPermisions = resultPermisions.result.actions;
            }

            this.validationGroupName = `dynamicForm${this.formCode}`;
            this.sharedService.showLoader(true);
            this.mainFormService.getMainFormByProgramCode(this.formCode).subscribe((response: ActionResult) => {
                if (response.IsSucessfull) {
                    this.mainForm = response.Result;
                    this.formTitle = response.Result.Title;
                    this.formSubTitle = response.Result.SubTitle;
                    this.icon = response.Result.Icon;
                    this.listItemsForm = JSON.parse(response.Result.MetadataForm);
                    this.formTabs = JSON.parse(this.mainForm.Tabs);
                    this.listParams = JSON.parse(this.mainForm.Params);
                    this.listFilters = JSON.parse(this.mainForm.Filters);
                    this.listFilters ? this.listFilters = this.listFilters.filter(x => x.Type === 'V' || x.Type === undefined) : this.listFilters;
                    this.listFiltersF = JSON.parse(this.mainForm.Filters);
                    this.listFiltersF ? this.listFiltersF = this.listFiltersF.filter(x => x.Type === 'F') : this.listFiltersF;
                    this.tempTable = JSON.parse(this.mainForm.Temptable);
                    this.listMultiReport = this.mainForm.MultiReport ? JSON.parse(this.mainForm.MultiReport) : [];
                    this.execProces = JSON.parse(this.mainForm.ExecProcess);
                    this.listItemsFormTmp = JSON.stringify([...this.listItemsForm]);
                    this.metadataGrid = JSON.parse(response.Result.MetadataGrid);
                    this.listVarsTransaction = this.mainForm.VarsTransaction ? JSON.parse(this.mainForm.VarsTransaction) : [];
                    this.baseDocConfig = this.mainForm.BaseDocConfig ? JSON.parse(this.mainForm.BaseDocConfig) : new BaseDocConfg();
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
                    }
                    this.listColumsGrid = this.metadataGrid.columns;
                    this.renderGridColumns();
                    // this.listAllData();
                    if (this.mainForm.UseMasterDetail) {
                        this.listMasterDetails();
                    }
                    //consumir servicio de nodos padre
                    if (this.mainForm.FuncEspec) {
                        const listFuncMember = this.mainForm.FuncEspec.split(';');
                        if (listFuncMember[0] === 'TREEVIEW') {
                            this.treeView = true;
                            this.tar_codi = parseInt(listFuncMember[1]);
                            this.cam_movi = listFuncMember[2];
                            this.tab_nive = listFuncMember[3];
                            this.listRootNodes();
                        }
                        else if (listFuncMember[0] === 'REPORT') {
                            this.visualizeForm = true;
                            this.reportView = true;
                        }
                        else if (listFuncMember[0] === 'PROCESS' || listFuncMember[0] === 'IMPORT') {
                            this.visualizeForm = true;
                            this.processView = true;
                        }
                    }
                    this.setListActionsMain();
                    // si tiene el parametro en la url es porque se esta usando como widget
                    if (params.recordId) {
                        this.isWidget = true;
                        this.recordId = params.recordId;
                        this.editData(null, this.recordId);
                    } else if (this.recordId) {
                        // se establece desde el input no desde la url
                        this.isWidget = true;
                        this.editData(null, this.recordId);
                    } else if (params.mode && params.mode === 'new') {
                        this.add();
                    } else if (this.addInForeignKey) {
                        this.add();
                    }
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
            this.afterAddingFile();
            this.completeItem();
        });
    }

    async onInitialized(e) {
        this.sharedService.showLoader(true);
        const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
        e.component.beginUpdate();
        e.component.option('items', []);
        let arrItemsWithTabs: any[] = [];
        for await (const item of this.listItemsForm) {
            if (item.cssClass) {
                this.listItemChangeLabelColor.push(item.cssClass);
            }
            if (!this.editMode) {
                //Se comentarea para que respete configuracion del diseño del formulario para campos PK
                // if (listKeyData.filter((x) => x.Name === item.dataField).length > 0) {
                //     if (!listKeyData.filter((x) => x.Name === item.dataField)[0].IsGuid && !listKeyData.filter((x) => x.Name === item.dataField)[0].IsIdentity) {
                //         item.editorOptions.readOnly = false;
                //     }
                // }
                if (item.validationRules !== undefined && listKeyData) {
                    if (listKeyData.filter((x) => x.Name === item.dataField).length === 0 && item.validationRules.filter((x) => x.type === 'required').length === 0) {
                        this.data[item.dataField.replace(/^FK/, '')] = null;
                    }
                }
            } else {
                if (listKeyData) {
                    if (listKeyData.filter((x) => x.Name === item.dataField).length > 0) {
                        item.editorOptions.readOnly = true;
                    }
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
            if (item.isForeignKey && (item.dataField !== 'FKEMP_CODI' || this.mainForm.TableName === 'GN_USUAR' || this.mainForm.TableName === 'GN_REMGU')
                && !item.tableNameForeignKey.includes('_BLOBS')) {
                item.editorOptions.onKeyDown = (el) => {
                    // si se presiona tab y tiene configuradas condiciones para un registro unico entonces se ejecuta la consulta
                    if (el.event.keyCode === 9) {
                        this.foreignKeyData = { ... this.listItemsForm.filter((x) => x.dataField === el.component.option('name'))[0] };
                        if (this.data[el.component.option('name').replace(/^FK/, '')]) {
                            return;
                        }
                        setTimeout(async () => {
                            this.data[el.component.option('name').replace(/^FK/, '')] = this.data[el.component.option('name')];
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
                            name: 'search',
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
                            name: 'times',
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
                                    this.data[dataField.replace(/^FK/, '')] = null;
                                    this.data[dataField] = null;
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
                if (item.editorType === 'dxTextBox' || item.editorType === 'dxNumberBox') {
                    item.editorOptions.onFocusIn = (el) => {
                        this.openPopupDataSource(el);
                    };
                }
            }
            //Ajustar lupa para doc base
            if (this.baseDocConfig.basefield === item.dataField) {
                delete item.editorOptions.mode;
                item.editorOptions.readOnly = true;
                // se agregan los botones para buscar y limpiar
                item.editorOptions.buttons = [
                    {
                        name: 'search',
                        location: 'before',
                        options: {
                            icon: 'dx-icon dx-icon-search icon-foreign-key',
                            type: 'normal',
                            stylingMode: 'text',
                            disabled: false,
                            visible: true,
                            name: `search_${item.dataField}`,
                            onClick: async () => {
                                this.baseDocTitle = 'Seleccionar documento base';
                                this.listSearchBasedocConditions = [];
                                this.itemRowClickBaseDoc = null;
                                await this.listBasedoc(' ');
                            }
                        }
                    },
                    {
                        name: 'times',
                        options: {
                            icon: 'dx-icon dx-icon-clear icon-foreign-key',
                            type: 'normal',
                            stylingMode: 'text',
                            disabled: false,
                            visible: false,
                            name: `clear_${item.dataField}`,
                            onClick: async (b: any) => {
                                const dataField = b.component.option('name').replace('clear_', '');
                                this.form.instance.getEditor(dataField).option('readOnly', false);
                                this.form.instance.getEditor(dataField).option('buttons[1].options.visible', false);
                                this.data[dataField.replace(/^FK/, '')] = null;
                                this.data[dataField] = null;
                                await this.deleteBasedoc();
                            }
                        }
                    },
                ];
            }
            //Ajustar campos de archivo de importacion
            if (this.mainForm.FuncEspec === 'IMPORT' && item.visible && item.dataField.includes('PPR_RUT')) {
                this.txtField = item.dataField;
                delete item.editorOptions.mode;
                item.editorOptions.readOnly = true;
                // se agregan los botones para buscar y limpiar
                item.editorOptions.buttons = [
                    {
                        name: 'search',
                        location: 'before',
                        options: {
                            icon: 'dx-icon dx-icon-file icon-foreign-key',
                            type: 'normal',
                            stylingMode: 'text',
                            disabled: false,
                            visible: true,
                            name: `search_${item.dataField}`,
                            onClick: () => {
                                this.txtImport.nativeElement.click();
                            }
                        }
                    },
                    {
                        name: 'times',
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
                                this.data[dataField.replace(/^FK/, '')] = null;
                                this.data[dataField] = null;
                                this.txtImport.nativeElement.value = '';
                            }
                        }
                    },
                ];
            }
            //Ajustar campo de plantilla
            if (item.isForeignKey && item.visible && item.tableNameForeignKey.includes('_BLOBS')) {
                this.docField = item.dataField;
                delete item.editorOptions.mode;
                item.editorOptions.readOnly = true;
                // se agregan los botones para buscar y limpiar
                item.editorOptions.buttons = [
                    {
                        name: 'search',
                        location: 'before',
                        options: {
                            icon: 'dx-icon dx-icon-link icon-foreign-key',
                            type: 'normal',
                            stylingMode: 'text',
                            tooltip: 'Asociar plantilla',
                            disabled: false,
                            visible: true,
                            name: `search_${item.dataField}`,
                            onClick: () => {
                                this.docImport.nativeElement.click();
                            }
                        }
                    },
                    {
                        name: 'open',
                        location: 'before',
                        options: {
                            icon: 'dx-icon dx-icon-docxfile icon-foreign-key',
                            type: 'normal',
                            stylingMode: 'text',
                            tooltip: 'Descargar plantilla',
                            disabled: false,
                            visible: true,
                            name: `open_${item.dataField}`,
                            onClick: () => {
                                this.downloadDocfile();
                            }
                        }
                    },
                    {
                        name: 'times',
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
                                this.form.instance.getEditor(dataField).option('buttons[2].options.visible', false);
                                this.data[dataField.replace(/^FK/, '')] = null;
                                this.data[dataField] = null;
                                this.docImport.nativeElement.value = '';
                            }
                        }
                    },
                ];
            }
            this.prepareEvent();
            this.prepareDateBoxItem(item);
            this.prepareNumberBoxItem(item);
            this.prepareDefaultValue(item);
            this.prepareCheckBoxValue(item);
            if (item.editorType === 'dxCheckBox') {
                delete item.validationRules;
            }
            await this.prepareSequence(item);
            await this.getValueForeignKey(item);
            arrItemsWithTabs.push({ ...item });

        }
        this.buildTabs();
        if (this.formTabItem[0].tabs !== undefined && this.formTabItem[0].tabs.length > 0) {
            // Recorre las pestañas creadas y les inyecta los items cuya propiedad tab sea igual al id
            for (const tab of this.formTabItem[0].tabs) {
                const itemsToAdd = arrItemsWithTabs.filter(f => f.tab === tab.id);
                tab.items = itemsToAdd;
            }
            // Busca los items que no tienen propiedad tab definida y los inyecta a la pestala por default
            const defaultTab = this.formTabItem[0].tabs.filter(t => t.id === 0)[0];
            defaultTab.items = arrItemsWithTabs.filter(f => (f.tab === undefined || f.tab === 0) && f.visible);
            // Si todos los items tienen propiedad tab asignada, elimina el tab por defecto
            if (defaultTab.items.length === 0) {
                this.formTabItem[0].tabs.splice(0, 1);
            }
            e.component.option('items', this.formTabItem);
        } else {
            e.component.option('items', arrItemsWithTabs);
        }

        this.runHideFields();
        this.setColorLabels();
        this.setTreeFields();

        if (this.mainForm.MetadataFormEvent) {
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

        e.component.repaint();
        e.component.endUpdate();

        setTimeout(() => {
            this.sharedService.showLoader(false);
        }, 3000);
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
                if (itemsByClass !== undefined) {
                    for (let i = 0; i < itemsByClass.length; i++) {
                        const element = itemsByClass[i];
                        const itemLabel: any = element.children[0].children[0].children[0];
                        itemLabel.style.color = item.replace('DG_', '');
                    }
                }
            }
        }, 100);
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

    onPageChange(e) {
        this.page = e;
        if (this.criteria.length > 0) {
            this.listAllDataWithLike();
        } else {
            this.listAllDataSearch(false);
        }
    }

    onPageChangeSearch(e) {
        this.pageSearch = e;
        if (this.criteriaSearch.length > 0) {
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

    onRowDblClickSearch(e) {
        this.itemRowClickSearch = { ...e.data };
        this.setForeignKey();
        this.form.instance.getEditor(this.foreignKeyData.dataField).option('readOnly', true);
        this.form.instance.getEditor(this.foreignKeyData.dataField).option('buttons[1].options.visible', true);
        this.itemRowClickSearch = null;
        this.cleanDependencyFields(this.foreignKeyData.dataField);
    }

    onRowDblClickBaseDoc(e) {
        this.ValModifDocu(this.cEditando, true, false);
        if (!this.errorValdocu) {
            this.itemRowClickBaseDoc = { ...e.data };
            this.data[this.baseDocConfig.basefield] = this.itemRowClickBaseDoc['bas_cont'];
            this.sharedService.info('Al guardar registro se cargaran los detalles');
            this.searchBaseDoc = false;
        }
        else {
            this.searchBaseDoc = false;
        }
    }

    onRowDblClick(e) {
        if (this.editMode) {
            return;
        }
        this.editData(e);
    }

    onCellClick(e) {
        this.itemColumnClick = { ...e.column };
    }

    onRowClick(e) {
        this.itemRowClick = { ...e.data };
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
        }
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
                        if (!this.listPermisions.find(x => x === EDIT_ACTION)) {
                            this.sharedService.warning('No tiene permiso para editar');
                            return;
                        }
                        setTimeout(() => {
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

    onToolbarPreparingSearch(e) {
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
            },
            {
                location: 'after',
                locateInMenu: 'auto',
                widget: 'dxTextBox',
                options: {
                    width: 200,
                    onValueChanged: (event) => {
                        this.criteriaSearch = event.value;
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
                    if (this.criteriaSearch.length > 0) {
                        this.searchDataForeignKeyWithLike();
                    } else {
                        this.searchDataForeignKey(false);
                    }
                }
            }
        },
            {
                location: 'after',
                locateInMenu: 'auto',
                widget: 'dxButton',
                showText: 'inMenu',
                options: {
                    icon: 'plus',
                    text: 'Agregar',
                    hint: 'Agregar',
                    onClick: (event) => {
                        this.openPopupAddRecordForeignKey();
                    }
                }
            });
    }

    onToolbarPreparingBaseDoc(e) {

    }

    onHidingAddForeignKey() {
        this.searchVisible = true;
        this.searchDataForeignKey(false);
    }

    onHidingSearch() {
        this.criteriaSearch = '';
        this.searchMethod = SearchMethod.StartWith;
    }

    onShowingPopupDocument() {
        this.listDocuments = [];
        if (this.data[this.itemUpload.dataField]) {
            if (this.data[`OPHFU_${this.itemUpload.dataField}`].split('_OPHFU_').length > 1) {
                this.dynamicProgramsService.getDocument(+this.sessionService.session.selectedCompany.code, this.libraryId, this.data[`OPHFU_${this.itemUpload.dataField}`].split('_OPHFU_')[1]).subscribe((responseDocument: ActionResult) => {
                    this.listDocuments.push(responseDocument.Result);
                }, () => {
                    this.sharedService.showLoader(false);
                });
            }
        }
    }

    onRowClickDataSource(e) {
        this.itemRowClickDataSource = { ...e.data };
    }

    onRowDblClickDataSource(e) {
        this.itemRowClickDataSource = { ...e.data };
        this.setDataSourceValue();
    }

    onContentReady(e: any) {
        setTimeout(() => {
            const gridEl = document.getElementById(this.gridId);
            const formEl = document.getElementById(this.formId);
            const gridForeignKeyEl = document.getElementById(this.gridForeignKeyId);
            const gridDataSourceEl = document.getElementById(this.gridDataSourceId);
            const gridFileEl = document.getElementById(this.gridFileId);
            const popUpForeignKeyEl = document.getElementById(this.popUpForeignKeyId);
            const popUpAddForeignKeyEl = document.getElementById(this.popUpAddForeignKeyId);
            const popUpDataSourceEl = document.getElementById(this.popUpDataSourceId);
            const popUpFileEl = document.getElementById(this.popUpFileId);
            const popUpSearchEl = document.getElementById(this.popUpSearchId);
            const popUpSearchFKEl = document.getElementById(this.popUpSearchFKId);
            const popUpGnDocinIdEl = document.getElementById(this.popUpGnDocinId);
            const popUpAuditIdEl = document.getElementById(this.popUpAuditId);
            const formAuditEl = document.getElementById(this.formAuditId);
            const gridSearchEl = document.getElementById(this.gridSearchId);
            const gridSearchFKEl = document.getElementById(this.gridSearchFKId);
            const gridGnDocinEl = document.getElementById(this.gridGnDocinId);
            const gridLogerEl = document.getElementById(this.gridLogerId);
            const popUpBaseDocEl = document.getElementById(this.popUpBaseDocId);
            const popUpSearchBaseDocEl = document.getElementById(this.popUpSearchBaseDocId);
            const gridSearchBasedocEl = document.getElementById(this.gridSearchBasedocId);
            const gridBaseDocEl = document.getElementById(this.gridBaseDocId);
            const popUpMovContEl = document.getElementById(this.popUpMovContId);
            const gridMovContEl = document.getElementById(this.gridMovContId);
            const popUpAttachEl = document.getElementById(this.popUpAttachId);
            const gridAttachEl = document.getElementById(this.gridAttachId);
            const formAttachEl = document.getElementById(this.formAttachId);
            const popUpDefValuesEl = document.getElementById(this.popUpDefValuesId);
            const popUpMessageEl = document.getElementById(this.popUpMessageId);
            const gridDefValuesEl = document.getElementById(this.gridDefValuesId);
            const gridMessageEl = document.getElementById(this.gridMessageId);
            if (formEl) {
                this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
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
            if (popUpSearchEl) {
                this.stylingService.setTitleColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpSearchFKEl) {
                this.stylingService.setTitleColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpGnDocinIdEl) {
                this.stylingService.setTitleColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpGnDocinIdEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpAuditIdEl) {
                this.stylingService.setTitleColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpAuditIdEl, this.sessionService.session.selectedCompany.theme);
            }
            if (formAuditEl) {
                this.stylingService.setLabelColorStyle(formAuditEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSubTitleColorStyle(formAuditEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridSearchEl) {
                this.stylingService.setGridHeaderColorStyle(gridSearchEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridSearchEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridSearchFKEl) {
                this.stylingService.setGridHeaderColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridGnDocinEl) {
                this.stylingService.setGridHeaderColorStyle(gridGnDocinEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridGnDocinEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridLogerEl) {
                this.stylingService.setGridHeaderColorStyle(gridLogerEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridLogerEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpBaseDocEl) {
                this.stylingService.setTitleColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpBaseDocEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpMovContEl) {
                this.stylingService.setTitleColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpMovContEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpSearchBaseDocEl) {
                this.stylingService.setTitleColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchBaseDocEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridSearchBasedocEl) {
                this.stylingService.setGridHeaderColorStyle(gridSearchBasedocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridSearchBasedocEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridBaseDocEl) {
                this.stylingService.setGridHeaderColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridMovContEl) {
                this.stylingService.setGridHeaderColorStyle(gridMovContEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridMovContEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpAttachEl) {
                this.stylingService.setTitleColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridAttachEl) {
                this.stylingService.setGridHeaderColorStyle(gridAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (formAttachEl) {
                this.stylingService.setLabelColorStyle(formAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSubTitleColorStyle(formAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpDefValuesEl) {
                this.stylingService.setTitleColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpDefValuesEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpMessageEl) {
                this.stylingService.setTitleColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpMessageEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridDefValuesEl) {
                this.stylingService.setGridHeaderColorStyle(gridDefValuesEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridDefValuesEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridMessageEl) {
                this.stylingService.setGridHeaderColorStyle(gridMessageEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridMessageEl, this.sessionService.session.selectedCompany.theme);
            }
        }, 1);
    }


    //#endregion

    //#region Methods

    itemClickToolbar(item: MenuGroupItem) {
        if (!item) {
            return;
        }
        switch (item.name) {
            case 'new':
                this.add();
                break;
            case 'search':
                //this.listSearchConditions = [];
                this.search();
                break;
            case 'defval':
                this.listDefValues = [];
                this.defval(false);
                break;
            case 'report':
                if (this.reportView) {
                    this.gprc_cont = -1;
                    this.preReport();
                }
                else if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onReport').length > 0) {
                    this.visualizeForm ? this.preReportEvent() : this.sharedService.error('Debe seleccionar un registro');
                }
                else {
                    this.report('');
                }
                break;
            case 'process':
                this.process();
                break;
            case 'count':
                this.count();
                break;
            case 'sum':
                if (this.itemColumnClick) {
                    this.sum();
                    break;
                }
                else {
                    this.sharedService.warning('Debe consultar registros');
                    break;
                }
            case 'audit':
                this.showPopupAudit = true;
                break;
            case 'save':
                if (!this.editMode) {
                    this.validateSave();
                    //this.save();

                } else {
                    this.validateEdit();
                }
                break;
            case 'apply':
                this.apply();
                break;
            case 'revert':
                this.revert();
                break;
            case 'annul':
                this.annul();
                break;
            case 'mcont':
                this.mcont();
                break;
            case 'attach':
                this.attach();
                break;
            case 'back':
                this.redirect();
                break;
        }
    }

    setListActionsMain() {
        this.listActions = [];
        const menu = new Menu();
        menu.id = 1;
        menu.name = 'start';
        menu.text = 'Inicio';

        const menuGroup = new MenuGroup();
        menuGroup.id = 10;
        menuGroup.name = 'main';
        menuGroup.text = 'Principal';

        if (!this.reportView && !this.processView) {
            const menuGroupItemNew = new MenuGroupItem();
            menuGroupItemNew.id = 102;
            menuGroupItemNew.name = 'new';
            menuGroupItemNew.text = 'Nuevo';
            menuGroupItemNew.tooltip = 'Nuevo';
            menuGroupItemNew.icon = NEW_ICON;
            menuGroup.items.push(menuGroupItemNew);

            const menuGroupItemSearch = new MenuGroupItem();
            menuGroupItemSearch.id = 104;
            menuGroupItemSearch.name = 'search';
            menuGroupItemSearch.text = 'QBE';
            menuGroupItemSearch.tooltip = 'QBE';
            menuGroupItemSearch.icon = SEARCH_ICON;
            menuGroup.items.push(menuGroupItemSearch);

            const menuGroupItemDefVal = new MenuGroupItem();
            menuGroupItemDefVal.id = 106;
            menuGroupItemDefVal.name = 'defval';
            menuGroupItemDefVal.text = 'Val. Def.';
            menuGroupItemDefVal.tooltip = 'Valores por defecto';
            menuGroupItemDefVal.icon = DEFVAL_ICON;
            menuGroup.items.push(menuGroupItemDefVal);
        }
        if ((this.mainForm.Transaccion === 'N' || this.reportView) && !this.processView) {
            const menuGroupItemReport = new MenuGroupItem();
            menuGroupItemReport.id = 108;
            menuGroupItemReport.name = 'report';
            menuGroupItemReport.text = 'Reporte';
            menuGroupItemReport.tooltip = 'Generar Reporte';
            menuGroupItemReport.icon = REPORT_ICON;
            menuGroup.items.push(menuGroupItemReport);
            menu.groups.push(menuGroup);
        }
        else if (this.processView) {
            const menuGroupItemProcess = new MenuGroupItem();
            menuGroupItemProcess.id = 110;
            menuGroupItemProcess.name = 'process';
            menuGroupItemProcess.text = 'Procesar';
            menuGroupItemProcess.tooltip = 'Ejecutar proceso';
            menuGroupItemProcess.icon = PROCESS_ICON;
            menuGroup.items.push(menuGroupItemProcess);
            menu.groups.push(menuGroup);
        }
        else {
            menu.groups.push(menuGroup);
        }

        if (!this.reportView && !this.processView) {
            const menuGroupUtil = new MenuGroup();
            menuGroupUtil.id = 20;
            menuGroupUtil.name = 'util';
            menuGroupUtil.text = 'Utilidades';

            const menuGroupItemCount = new MenuGroupItem();
            menuGroupItemCount.id = 202;
            menuGroupItemCount.name = 'count';
            menuGroupItemCount.text = 'Filas';
            menuGroupItemCount.tooltip = 'Contar filas';
            menuGroupItemCount.icon = COUNT_ICON;
            menuGroupUtil.items.push(menuGroupItemCount);

            const menuGroupItemSum = new MenuGroupItem();
            menuGroupItemSum.id = 204;
            menuGroupItemSum.name = 'sum';
            menuGroupItemSum.text = 'Sumar';
            menuGroupItemSum.tooltip = 'Sumar Columna';
            menuGroupItemSum.icon = SUM_ICON;
            menuGroupUtil.items.push(menuGroupItemSum);

            const menuGroupItemAudit = new MenuGroupItem();
            menuGroupItemAudit.id = 206;
            menuGroupItemAudit.name = 'audit';
            menuGroupItemAudit.text = 'Auditoria';
            menuGroupItemAudit.tooltip = 'Consultar por Fecha Auditoria';
            menuGroupItemAudit.icon = AUDIT_ICON;
            menuGroupUtil.items.push(menuGroupItemAudit);
            menu.groups.push(menuGroupUtil);
        }
        this.listActions.push(menu);
    }

    setListActionsForm() {
        this.listActions[0].groups.splice(1);
        this.listActions[0].groups[0].items = [{
            id: 102,
            name: 'save',
            text: 'Guardar',
            tooltip: 'Guardar',
            icon: SAVE_ICON,
            shortcut: ''
        }];
        this.listActions[0].groups[0].items.push({
            id: 104,
            name: 'back',
            icon: BACK_ICON,
            text: 'Regresar',
            tooltip: 'Regresar',
            shortcut: ''
        });
        this.listActions[0].groups[0].items.push({
            id: 104,
            name: 'report',
            icon: REPORT_ICON,
            text: 'Reporte',
            tooltip: 'Reporte',
            shortcut: ''
        });
        this.listActions[0].groups[0].items.push({
            id: 106,
            name: 'attach',
            icon: ATTACH_ICON,
            text: 'Adjuntos',
            tooltip: 'Adjuntos',
            shortcut: ''
        });
        if (this.mainForm.Transaccion === 'S') {
            this.listActions[0].groups[0].items.push({
                id: 108,
                name: 'apply',
                icon: APPLY_ICON,
                text: 'Aplicar',
                tooltip: 'Aplicar',
                shortcut: ''
            });
            this.listActions[0].groups[0].items.push({
                id: 110,
                name: 'revert',
                icon: REVERT_ICON,
                text: 'Revertir',
                tooltip: 'Revertir',
                shortcut: ''
            });
            this.listActions[0].groups[0].items.push({
                id: 112,
                name: 'annul',
                icon: ANNUL_ICON,
                text: 'Anular',
                tooltip: 'Anular',
                shortcut: ''
            });
            this.listActions[0].groups[0].items.push({
                id: 114,
                name: 'mcont',
                icon: MCONT_ICON,
                text: 'Contab.',
                tooltip: 'Documento contable',
                shortcut: ''
            });
        }
        if (this.mainForm.FuncEspec.split(';')[0] === 'MPROCESS') {
            this.listActions[0].groups[0].items.push({
                id: 116,
                name: 'process',
                icon: PROCESS_ICON,
                text: 'Procesar',
                tooltip: 'Ejecutar proceso',
                shortcut: ''
            });
        }
    }


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
        this.titlePopupAddForeignKey = `Agregar Registro - ${result.Result.Title}`;
        this.searchVisible = false;
        this.formCodeForeignKey = result.Result.ProgramCode;
        this.showPopupAddForeignKey = true;
    }

    validateForeignKeys() {
        let isValid = true;
        for (const item of this.listItemsForm.filter((x) => x.isForeignKey && x.validationRules.find((y: any) => y.type === 'required'))) {
            if (this.data[item.dataField.replace(/^FK/, '')] === null) {
                this.data[item.dataField] = null;
                isValid = false;
            }
        }
        return isValid;
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
            this.sharedService.error('Faltan datos por gestionar. Verifique por favor');
            isValid = false;
            return isValid;
        }
        this.formatDates();
        this.formatChecks();
        if (!this.form.instance.validate().isValid) {
            this.sharedService.error('Faltan datos por gestionar. Verifique por favor');
            isValid = false;
            return isValid;
        }
        this.sharedService.showLoader(false);
        return isValid;
    }

    save() {
        this.sharedService.showLoader(true);

        if (this.mainForm.Transaccion === 'S') {
            if (this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0].Value] === 0) {
                this.sharedService.error('Numero de documento no puede ser 0');
                this.sharedService.showLoader(false);
                return;
            }
        }

        // data que se envia al servicio
        const dataSend = { ...this.data };

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

        //campos año, mes, dia y fecha numerica
        if (this.mainForm.Transaccion === 'S') {
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_ANOP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CAnop')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_ANOP`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYY');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CAnop')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYY');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_MESP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CMesp')[0].Value);
            if (itemForm !== undefined) {
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CMesp')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('MM');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_DIAP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CDiap')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_DIAP`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('DD');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CDiap')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('DD');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_NECH`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CNech')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_NECH`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYYMMDD');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CNech')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYYMMDD');
            }
        }

        // se eliminan los campos de valor de llaves
        for (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
            delete dataSend[item.dataField];
        }
        for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
            dataSend[item.dataField] = dataSend[`OPHFU_${item.dataField}`];
            delete dataSend[`OPHFU_${item.dataField}`];
        }

        //remplazar valores campos con datasource query
        if (this.listitemRowClickDataSource) {
            for (const item of this.listitemRowClickDataSource) {
                const field = this.listItemsDataSource.filter(x => x.dataField === item.dataField)[0];
                dataSend[field.dataField] = item.row[field.valueMember];
                delete dataSend[`DsV${field.dataField}`];
            }
        }

        //Quitar horas, minutos y segundos de campos fecha
        for (const item of this.listItemsForm.filter(x => x.dataType === 'datetime' && x.visible && x.editorOptions.displayFormat === 'dd-MM-yyyy')) {
            if (dataSend[item.dataField]) {
                dataSend[item.dataField] = moment(dataSend[item.dataField]).format(`${this.configService.config.datetimeFormat}T00:00:00`);
            }
        }

        this.dynamicProgramsService.saveData({ ProjectId: this.mainForm.Id, Data: dataSend }).subscribe(async (response: ActionResult) => {
            if (response.IsSucessfull) {

                //this.data = { ...this.data, ...response.Result };

                // si tiene configuracion de eventos al guardar/editar
                await this.runOnSaveEvent(dataSend);

                if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
                    await this.completeTree('S');
                    if (this.errorValTree) {
                        this.sharedService.showLoader(false);
                        return;
                    }
                }

                this.sharedService.success('Registro guardado correctamente');
                this.saveSuccess.emit();
                if (this.mainForm.UseMasterDetail) {
                    this.showMasterDetail = true;
                    this.editMode = true;
                    this.toolBarButtons.redirect = true;
                    this.toolBarButtons.save = false;
                    this.toolBarButtons.edit = true;
                    this.toolBarButtons.add = false;
                    this.runHideFields();
                } else {
                    this.showMasterDetail = false;
                }
                for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                    const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
                    this.conditionsRecordKey.push(`${column.name}='${this.data[item.Name]}'`);
                }
                this.redirect();
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
        //this.formatChecks();
        if (!this.form.instance.validate().isValid) {
            return;
        }
        this.sharedService.showLoader(true);


        // data que se envia al servicio
        const dataSend = { ...this.data };

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

        //campos año, mes, dia y fecha numerica
        if (this.mainForm.Transaccion === 'S') {
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_ANOP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CAnop')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_ANOP`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYY');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CAnop')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYY');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_MESP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CMesp')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_MESP`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('MM');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CMesp')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('MM');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_DIAP`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CDiap')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_DIAP`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('DD');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CDiap')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('DD');
            }
            itemForm = undefined;
            //itemForm = this.listItemsForm.find(x => x.dataField === `${this.mainForm.TableName.slice(3, 6)}_NECH`);
            itemForm = this.listItemsForm.find(x => x.dataField === this.listVarsTransaction.filter(x => x.Name === 'P_CNech')[0].Value);
            if (itemForm !== undefined) {
                //dataSend[`${this.mainForm.TableName.slice(3, 6)}_NECH`] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYYMMDD');
                dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_CNech')[0].Value] = moment(dataSend[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value]).format('YYYYMMDD');
            }
        }
        // se eliminan los campos de valor de llaves
        for (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
            delete dataSend[item.dataField];
        }
        // se elimianan los campos temporales para almacenar el nombre del archivo
        for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
            dataSend[item.dataField] = dataSend[`OPHFU_${item.dataField}`];
            delete dataSend[`OPHFU_${item.dataField}`];
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

        this.dynamicProgramsService.updateData({ ProjectId: this.mainForm.Id, Data: dataSend, DataAnt: this.dataAnt }).subscribe(async (response: ActionResult) => {
            if (response.IsSucessfull) {
                if (!this.isWidget) {
                    for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                        const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
                        this.conditionsRecordKey.push(`${column.name}='${this.data[item.Name]}'`);
                    }

                    // si tiene configuracion de eventos al guardar/editar
                    await this.runOnSaveEvent(dataSend);

                    //this.listAllDataSearch(false);
                    if (this.baseDocConfig.basefield !== '0') {
                        await this.loadDetailsBaseDoc();
                        //this.itemRowClickBaseDoc = null;
                    }
                    if (!this.errorload && this.mainForm.Transaccion === 'N') {
                        this.redirect();
                    }
                } else {
                    this.editData(null, this.recordId);
                }
                if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
                    await this.completeTree('E');
                }
                if (!this.errorload) {
                    this.sharedService.success('Registro actualizado correctamente');
                }
                this.redirect();
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

    formatDates() {
        for (const date of this.listItemsForm.filter((x) => x.editorType === 'dxDateBox')) {
            if (this.data[date.dataField]) {
                this.data[date.dataField] = moment(this.data[date.dataField]).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
            }
        }
    }

    formatChecks() {
        for (const valor of this.listItemsForm.filter((x) => x.editorType === 'dxCheckBox')) {
            if (this.data[valor.dataField] === true) {
                this.data[valor.dataField] = 'S'
            }
            else {
                this.data[valor.dataField] = 'N'
            }
        }
    }
    async validateSave() {
        this.sharedService.showLoader(true);
        if (this.listPassFields.length > 0) {
            const lkeys: any[] = [];
            for await (const item of this.listPassFields) {
                if (item.data !== this.data[item.field]) {
                    lkeys.push({ field: item.field, key: this.data[item.field] });
                }
            }
            const dataRest = lkeys;
            const url = `${this.configService.config.urlWsGnGenerFuncs}EncrypKeys`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.error(resultEvent.ErrorMessage);
                this.sharedService.showLoader(false);
                return;
            }
            else {
                for await (const item of resultEvent.Result) {
                    this.data[item.field] = item.key;
                }
            }
        }
        if (this.docField.length > 0) {
            if (this.docBase64.length === 0) {
                this.sharedService.showLoader(false);
                this.sharedService.error('Debe seleccionar archivo para plantilla');
                return;
            }
            const dataRest: any = {};
            dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
            dataRest['mod_inic'] = this.mainForm.TableName.slice(0, 2);
            dataRest['blo_file'] = this.data[this.docField];
            dataRest['docFile'] = this.docBase64;
            dataRest['blo_ante'] = 0;
            const url = `${this.configService.config.urlWsGnGenerFuncs}AddBlobs`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.error(resultEvent.ErrorMessage);
                this.sharedService.showLoader(false);
                return;
            }
            else {
                this.data[this.docField.replace(/^FK/, '')] = resultEvent.Result;
            }
        }
        if (this.mainForm.Transaccion === 'S') {
            try {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnGetConse();
                await this.runOnGetDocnume();
                await this.runOnBeforeSaveEvent(this.data, null, 'I');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.save();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.TableName.slice(3, 8) === 'BLOME') { //Formularios bloqueo de meses
            try {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.listGnDocin = [];
                await this.ValidateBlome('S');
                if (this.errorValBlome) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, null, 'I');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.save();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') { //Validaciones formulario arbol
            try {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.ValidateTree('S');
                if (this.errorValTree) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, null, 'I');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.save();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.Transaccion === 'S') { //validaciones formulario transaccion
            //validacion modificacion documento
            try {
                this.sharedService.showLoader(true);
                await this.ValModifDocu(this.cEditando, true, false);
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
            if (!this.errorValdocu) {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, null, 'I');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.save();
                this.sharedService.showLoader(false);
            }
        }
        else {
            if (!this.validate()) {
                this.sharedService.showLoader(false);
                return;
            }
            await this.runOnBeforeSaveEvent(this.data, null, 'I');
            if (this.errorBeforeSave) {
                this.sharedService.showLoader(false);
                return;
            }
            this.save();
        }
        this.sharedService.showLoader(false);
    }

    async validateEdit() {
        this.sharedService.showLoader(true);
        for await (const item of this.listItemsDataSource.filter(x => x.dataSourceType === DataSourceType.Query)) {
            if (item.params) {
                this.setWhereListData(JSON.parse(item.params), false, false);
                this.searchData.where += ` AND ${item.valueMember} = ${this.dataAnt[item.dataField]}`;
            } else {
                this.searchData.where = null;
                this.searchData.where += ` WHERE ${item.valueMember} = ${this.dataAnt[item.dataField]}`;
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
            this.data[item.dataField] = lresult[item.valueMember];
        }
        if (this.listPassFields.length > 0) {
            const lkeys: any[] = [];
            for await (const item of this.listPassFields) {
                if (item.data !== this.data[item.field]) {
                    lkeys.push({ field: item.field, key: this.data[item.field] });
                }
            }
            const dataRest = lkeys;
            const url = `${this.configService.config.urlWsGnGenerFuncs}EncrypKeys`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.error(resultEvent.ErrorMessage);
                this.sharedService.showLoader(false);
                return;
            }
            else {
                for await (const item of resultEvent.Result) {
                    this.data[item.field] = item.key;
                }
            }
        }
        if ((this.docField.length > 0) && this.data[this.docField.replace(/^FK/, '')] !== this.dataAnt[this.docField.replace(/^FK/, '')]) {
            if (this.docBase64.length === 0) {
                this.sharedService.showLoader(false);
                this.sharedService.error('Debe seleccionar archivo para plantilla');
                return;
            }
            const dataRest: any = {};
            dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
            dataRest['mod_inic'] = this.mainForm.TableName.slice(0, 2);
            dataRest['blo_file'] = this.data[this.docField];
            dataRest['docFile'] = this.docBase64;
            dataRest['blo_ante'] = this.dataAnt[this.docField.replace(/^FK/, '')];
            const url = `${this.configService.config.urlWsGnGenerFuncs}AddBlobs`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.error(resultEvent.ErrorMessage);
                this.sharedService.showLoader(false);
                return;
            }
            else {
                this.data[this.docField.replace(/^FK/, '')] = resultEvent.Result;
            }
        }
        if (this.mainForm.TableName.slice(3, 8) === 'BLOME') { //Formularios bloqueo de meses
            try {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.listGnDocin = [];
                await this.ValidateBlome('E');
                if (this.errorValBlome) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.edit();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') { //Validaciones formulario arbol
            try {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.ValidateTree('E');
                if (this.errorValTree) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.edit();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.Transaccion === 'S') { //validaciones formulario transaccion
            //validacion modificacion documento
            try {
                this.sharedService.showLoader(true);
                await this.ValModifDocu(this.cEditando, true, false);
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
            if (!this.errorValdocu) {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                if (this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0].Value] === 0 &&
                    this.listVarsTransaction.filter(x => x.Name === 'P_AsigEd')[0].Value === 'S') {
                    await this.runOnGetDocnume();
                    await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
                    if (this.errorBeforeSave) {
                        this.sharedService.showLoader(false);
                        return;
                    }
                    this.edit();
                }
                else {
                    await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
                    if (this.errorBeforeSave) {
                        this.sharedService.showLoader(false);
                        return;
                    }
                    this.edit();
                }

                this.sharedService.showLoader(false);
            }
        }
        else if (this.mainForm.FuncEspec.split(';')[0] === 'MPROCESS') {
            //validacion modificacion registro maestro proceso
            try {
                this.sharedService.showLoader(true);
                await this.ValModifProcess();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
                return;
            }
            if (!this.errorProcess) {
                if (!this.validate()) {
                    this.sharedService.showLoader(false);
                    return;
                }
                await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
                if (this.errorBeforeSave) {
                    this.sharedService.showLoader(false);
                    return;
                }
                this.edit();
                this.sharedService.showLoader(false);
            }
        }
        else {
            if (!this.validate()) {
                this.sharedService.showLoader(false);
                return;
            }
            await this.runOnBeforeSaveEvent(this.data, this.dataAnt, 'E');
            if (this.errorBeforeSave) {
                this.sharedService.showLoader(false);
                return;
            }
            this.edit();
        }
        this.sharedService.showLoader(false);
    }

    async apply() {
        if (!this.listPermisions.find(x => x === APPLY_ACTION)) {
            this.sharedService.warning('No tiene permiso para aplicar');
            return;
        }
        //validacion modificacion documento
        try {
            this.sharedService.showLoader(true);
            await this.ValModifDocu(this.cAplicando, true, false);
            this.sharedService.showLoader(false);
        }
        catch {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
        }
        // si tiene configuracion de eventos al aplicar
        if (!this.errorValdocu) {
            try {
                this.sharedService.showLoader(true);
                await this.runOnApplyEvent();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
    }

    async revert() {
        if (!this.listPermisions.find(x => x === REVERT_ACTION)) {
            this.sharedService.warning('No tiene permiso para revertir');
            return;
        }
        //validacion modificacion documento
        try {
            this.sharedService.showLoader(true);
            await this.ValModifDocu(this.cRevertiendo, true, false);
            this.sharedService.showLoader(false);
        }
        catch {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
        }
        // si tiene configuracion de eventos al revertir        
        if (!this.errorValdocu) {
            try {
                this.sharedService.showLoader(true);
                await this.runOnRevertEvent();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
    }

    async annul() {
        if (!this.listPermisions.find(x => x === ANNUL_ACTION)) {
            this.sharedService.warning('No tiene permiso para anular');
            return;
        }
        //validacion modificacion documento
        try {
            this.sharedService.showLoader(true);
            await this.ValModifDocu(this.cAnulando, true, false);
            this.sharedService.showLoader(false);
        }
        catch {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
        }
        // si tiene configuracion de eventos al anular        
        if (!this.errorValdocu) {
            try {
                this.sharedService.showLoader(true);
                await this.runOnAnnulEvent();
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            }
        }
    }

    async button(pSequence: number) {
        //validacion modificacion documento
        // if (this.mainForm.Transaccion === 'S') {
        //     try {
        //         this.sharedService.showLoader(true);
        //         await this.ValModifDocu(this.cEditando, true, false);
        //         this.sharedService.showLoader(false);
        //     }
        //     catch {
        //         this.sharedService.error('Ocurrio un error inesperado');
        //         this.sharedService.showLoader(false);
        //     }
        // }
        // si tiene configuracion de eventos de boton
        //if (!this.errorValdocu) { //No se realiza validacion de edicion de documento, debe ser responsabilidad del back
        try {
            this.sharedService.showLoader(true);
            await this.runOnButtonEvent(pSequence);
            this.sharedService.showLoader(false);
        }
        catch {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
        }
        //}
    }

    mcont() {
        this.listMovCont();
    }

    attach() {
        this.showPopupAttach = true;
    }

    async editData(row: any, recordId: any = null) {
        try {
            this.sharedService.showLoader(true);
            const listConditionsKey = [];
            // se establece la llave primaria para consultar, puede ser compuesta
            if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
                for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                    if (item.Name === 'EMP_CODI') {
                        listConditionsKey.push(`EMP_CODI = ${this.sessionService.session.selectedCompany.code}`);
                    }
                    else {
                        listConditionsKey.push(`${item.Name} = ${row.cont}`);
                    }
                }
                if (this.tar_codi > 0) {
                    listConditionsKey.push(`TAR_CODI = ${this.tar_codi}`);
                }
            }
            else {
                for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                    const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
                    if (!recordId) {
                        listConditionsKey.push(`${item.Name}='${row.data[column.dataField]}'`);
                    } else {
                        listConditionsKey.push(`${item.Name}='${recordId}'`);
                    }
                }
            }
            this.searchData.tableName = this.mainForm.TableName;
            this.searchData.where = ` WHERE ${listConditionsKey.join(' AND ')}`;
            const resultData: ActionResult = await this.dynamicProgramsService.getByPrimaryKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
            this.setListActionsForm();
            this.editMode = true;
            setTimeout(async () => {
                this.showMasterDetail = this.mainForm.UseMasterDetail;
                this.data = resultData.Result;
                this.dataAnt = Object.assign({}, this.data);
                this.visualizeForm = true;
                if (this.mainForm.Transaccion === 'S') {
                    this.gcon_disp = this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
                }
                this.treeView ? this.totalRecords = 1 : '';
                this.treeView = false;
                this.setDisplayFileUpload();
                for await (const item of this.listItemsForm.filter((x) => x.isForeignKey === true)) {
                    if (item.dataField === 'FKEMP_CODI') {
                        this.data[item.dataField] = this.data[item.dataField.replace(/^FK/, '')];
                    } else {
                        if (this.data[item.dataField.replace(/^FK/, '')] === null) {
                            continue;
                        }
                        const listConditions = [];
                        const listValueMember = item.valueMemberForeignKey.split(';');
                        const listValueMemberParent = item.valueMemberParentKey.split(';');
                        const lalias = item.joinsForeignKey !== '[]' ? JSON.parse(item.joinsForeignKey)[0].tableAlias : '';

                        for (let i = 0; i < listValueMember.length; i++) {
                            const element = listValueMember[i];
                            if (element.length > 0) {
                                listConditions.push(`${lalias}.${element}='${this.data[listValueMemberParent[i]]}'`);
                            }
                        }
                        this.searchData.select = item.displayMemberForeignKey ? item.displayMemberForeignKey.replace(/;/g, ',') : '';
                        item.joinsForeignKey ? this.setJoinsListData(JSON.parse(item.joinsForeignKey)) : this.searchData.joins = '';
                        this.searchData.where = listConditions.join(' AND ');
                        this.searchData.tableName = item.tableNameForeignKey;
                        const response: ActionResult = await this.dynamicProgramsService.getItemDataForeignKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
                        if (!response.IsSucessfull) {
                            continue;
                        }
                        if (!response.Result) {
                            continue;
                        }
                        if (item.displayMemberForeignKey) {
                            const displayMember = [];
                            for (let itemDisplay of item.displayMemberForeignKey.split(';')) {
                                itemDisplay = itemDisplay.substring(itemDisplay.indexOf('.') + 1, itemDisplay.length);
                                displayMember.push(response.Result[itemDisplay]);
                            }
                            this.data[`${item.dataField}`] = displayMember.join(' | '); //se modifica separador
                        } else {
                            this.data[`${item.dataField}`] = response.Result[item.valueMemberForeignKey.split(';')[0]];
                        }
                        const fieldTmp = this.form.instance.getEditor(item.dataField);
                        if (fieldTmp) {
                            if (this.data[item.dataField] && !item.editorOptions.readOnly) {
                                fieldTmp.option('readOnly', true);
                                fieldTmp.option('buttons[1].options.visible', true);
                            }
                            if (this.mainForm.Transaccion === 'S' && item.dataField === 'FKTOP_CODI' && !item.editorOptions.readOnly) {
                                fieldTmp.option('buttons[0].options.visible', false);
                                fieldTmp.option('buttons[1].options.visible', false);
                            }
                        }
                    }
                }
                //validaciones para tipo de operacion en edicion
                if (this.mainForm.Transaccion === 'S') {
                    this.sharedService.showLoader(true);
                    const ltop_codi = this.listVarsTransaction.filter(x => x.Name === 'P_CToper')[0].Value ?
                        this.listVarsTransaction.filter(x => x.Name === 'P_CToper')[0].Value : 'TOP_CODI';
                    //consumir servicio
                    if (this.data[ltop_codi]) {
                        const lmodulo = this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0] ? this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0].Value : this.mainForm.TableName.slice(0, 2);
                        this.mainFormService.getValTipOpe(this.sessionService.session.selectedCompany.code,
                            this.data[ltop_codi], lmodulo,
                            this.sessionService.session.accountCode, this.mainForm.SubTitle).subscribe((response: ActionResult) => {
                                if (!response.IsSucessfull) {
                                    this.sharedService.error(response.ErrorMessage);
                                    this.sharedService.showLoader(false);
                                    return;
                                }
                                else {
                                    //Fecha automatica
                                    if (response.Result.lGnToper.top_feau === 'S') {
                                        //this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value] = moment().locale('es-CO').format('YYYY-MM-DDTHH:mm:ss');
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
                                    this.sharedService.showLoader(false);
                                }
                            });
                    }
                }
                for await (const item of this.listItemsForm.filter((x) => x.editorOptions.mode === 'password')) {
                    this.listPassFields.push({ field: item.dataField, data: this.data[item.dataField] });
                }
                //modificar campos datasource query
                for await (const itemD of this.listItemsDataSource.filter(x => x.dataSourceType === DataSourceType.Query)) {
                    if (itemD.params) {
                        this.setWhereListData(JSON.parse(itemD.params), false, false);
                        this.searchData.where += ` AND ${itemD.valueMember} = ${this.data[itemD.dataField]}`;
                    } else {
                        this.searchData.where = null;
                        this.searchData.where += ` WHERE ${itemD.valueMember} = ${this.data[itemD.dataField]}`;
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
                    this.data[`DsV${itemD.dataField}`] = this.data[itemD.dataField];
                    this.data[itemD.dataField] = lresult[itemD.valueShow];
                }
                if (!this.isWidget) {
                    this.toolBarButtons.redirect = true;
                }
                this.toolBarButtons.save = false;
                this.toolBarButtons.edit = true;
                this.toolBarButtons.add = false;
            }, 500);
        } catch {
            this.sharedService.showLoader(false);
        }
    }

    async deleteData(row: any) {
        if (!this.listPermisions.find(x => x === DELETE_ACTION)) {
            this.sharedService.warning('No tiene permiso para eliminar');
            return;
        }
        if (this.mainForm.Transaccion === 'S') { //validaciones formulario transaccion
            //validacion modificacion documento
            try {
                if (!this.itemRowClick) {
                    this.sharedService.error('Debe seleccionar un registro');
                    return;
                }
                this.sharedService.showLoader(true);
                await this.ValModifDocu(this.cEditando, true, true);
                this.sharedService.showLoader(false);
            }
            catch {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
                return;
            }
        }
        if (!this.errorValdocu) {
            this.editMode = true;
            if (await this.sharedService.confirm()) {
                this.sharedService.showLoader(true);
                const listConditionsKey = [];
                if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
                    for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                        if (item.Name === 'EMP_CODI') {
                            listConditionsKey.push(`EMP_CODI = ${this.sessionService.session.selectedCompany.code}`);
                        }
                        else {
                            listConditionsKey.push(`${item.Name} = ${row.cont}`);
                        }
                    }
                    if (this.tar_codi > 0) {
                        listConditionsKey.push(`TAR_CODI = ${this.tar_codi}`);
                    }
                }
                else {
                    for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                        const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
                        listConditionsKey.push(`${item.Name}='${row[column.dataField]}'`);
                    }
                }
                this.searchData.tableName = this.mainForm.TableName;
                this.searchData.where = ` WHERE ${listConditionsKey.join(' AND ')}`;
                const resultData: ActionResult = await this.dynamicProgramsService.getByPrimaryKey({ ProjectId: this.mainForm.Id, Data: this.searchData }).toPromise();
                this.data = resultData.Result;
                if (this.mainForm.TableName.slice(3, 8) === 'BLOME') { //Formularios bloqueo de meses                    
                    await this.ValidateBlome('D');
                    if (this.errorValBlome) {
                        this.sharedService.showLoader(false);
                        return;
                    }
                }
                //Validar borrado de tablas dependientes
                await this.BeforeDelete();
                if (!this.errorDelete) {
                    this.dynamicProgramsService.deleteData({ ProjectId: this.mainForm.Id, Data: resultData.Result }).subscribe((response: ActionResult) => {
                        if (response.IsSucessfull) {
                            this.sharedService.success('Registro eliminado correctamente');
                            if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
                                const index = this.TreeListData.indexOf(row);
                                this.TreeListData.splice(index, 1)
                            }
                            this.redirect();
                        } else if (response.ErrorMessage) {
                            this.sharedService.error(response.ErrorMessage);
                        } else {
                            this.sharedService.error(response.Messages);
                        }
                        this.editMode = false;
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
    }

    async runOnBeforeSaveEvent(pData: any, pDataAnt: any, pEstado: string) {
        debugger;
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
                                                for (const item of Object.entries(this.dataOut)){
                                                    const field = item[0].toUpperCase();
                                                    this.data[field] = item[1];
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

    async runOnSaveEvent(pData: any) {
        if (!this.listMetadataFormEvent) {
            return;
        }
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onSave').length > 0) {
            const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onSave')[0];
            for (const action of event.actions) {
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
                                        if (pData[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(pData[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else if (param.value.startsWith('?')) {
                                }
                                else if (param.value === '[ESTADO]') {
                                    this.editMode ? dataRest[param.key] = 'U' : dataRest[param.key] = 'I';
                                }
                                else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                //condicionar para formularios transaccion que lo requieran
                                if (this.mainForm.Transaccion === 'S') {
                                    if (this.listVarsTransaction.filter(x => x.Name === 'P_Auth')[0].Value === 'N') {
                                        const httpOptions = {
                                            headers: new HttpHeaders({
                                                Authorization: ''
                                            })
                                        };
                                        const resultEvent: ActionResultT<any[]> = await this.http.post<ActionResultT<any[]>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest, httpOptions).toPromise();
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
                                        }
                                        else {
                                            this.sharedService.error(resultEvent.ErrorMessage);
                                        }
                                    }
                                    else {
                                        const resultEvent: ActionResultT<any[]> = await this.http.post<ActionResultT<any[]>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
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
                                        }
                                        else {
                                            this.sharedService.error(resultEvent.ErrorMessage);
                                        }
                                    }
                                }
                                else {
                                    const resultEvent: ActionResultT<any[]> = await this.http.post<ActionResultT<any[]>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
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
                                    }
                                    else {
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                }
                            } catch (error) {
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

    async runOnGetConse() {
        if (this.listMetadataControlEvent.filter((x) => x.eventName === 'onGetConse').length > 0) {
            const event = this.listMetadataControlEvent.filter((x) => x.eventName === 'onGetConse')[0];
            for (const action of event.actions) {
                switch (action.type) {
                    case EventActionType.rest:
                        const actionRest: RestForm = action.config;
                        // metodo post
                        if (actionRest.method === 1) {
                            const dataRest: any = {};
                            for (const param of actionRest.params) {
                                if (isNaN(param.value)) {
                                    if (param.value.startsWith('{')) {
                                        const listValues = [];
                                        for (const item of param.value.split(';')) {
                                            if (this.data[item.replace('{', '').replace('}', '')]) {
                                                listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                            }
                                        }
                                        dataRest[param.code] = listValues.join(' ');
                                    }
                                    else {
                                        dataRest[param.code] = param.value;
                                    }
                                }
                                else {
                                    dataRest[param.code] = param.value;
                                }
                            }
                            try {
                                const url = `${this.configService.config.urlWsConseTransaction}GetConse`;
                                const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
                                if (resultEvent.IsSucessfull) {
                                    if (this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value] === 0) {
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value] = resultEvent.Result.con_disp;
                                        this.gcon_disp = resultEvent.Result.con_disp;
                                    }
                                    // if (actionRest.responseMessage) {
                                    //     this.sharedService.hide();
                                    //     setTimeout(() => {
                                    //         this.sharedService.success(actionRest.responseMessage);
                                    //     }, 500);
                                    // }
                                }
                            } catch (error) {

                            }
                        }
                        break;
                }
            }
        }
        else {
            this.sharedService.warning('No hay configuración establecida para obtener el consecutivo');
        }
    }

    async runOnGetDocnume() {
        if (this.listMetadataControlEvent.filter((x) => x.eventName === 'onGetDocnume').length > 0) {
            const event = this.listMetadataControlEvent.filter((x) => x.eventName === 'onGetDocnume')[0];
            for (const action of event.actions) {
                switch (action.type) {
                    case EventActionType.rest:
                        const actionRest: RestForm = action.config;
                        // metodo post
                        if (actionRest.method === 1) {
                            const dataRest: any = {};
                            for (const param of actionRest.params) {
                                if (isNaN(param.value)) {
                                    if (param.value.startsWith('{')) {
                                        const listValues = [];
                                        for (const item of param.value.split(';')) {
                                            if (this.data[item.replace('{', '').replace('}', '')]) {
                                                listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                            }
                                        }
                                        dataRest[param.code] = listValues.join(' ');
                                    }
                                }
                                else {
                                    dataRest[param.code] = param.value;
                                }
                            }
                            try {
                                const url = `${this.configService.config.urlWsConseTransaction}GetDocnume`;
                                const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
                                if (resultEvent.IsSucessfull) {
                                    if (resultEvent.Result.top_auto === 'S') {
                                        //this.data[`${this.mainForm.TableName.slice(3, 6)}_NUME`] = resultEvent.Result.con_disp;
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0].Value] = resultEvent.Result.con_disp;
                                    }
                                }
                                else {
                                    this.sharedService.hide();
                                    setTimeout(() => {
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }, 200);
                                }
                            } catch (error) {

                            }
                        }
                        break;
                }
            }
        }
        else {
            this.sharedService.warning('No hay configuración establecida para obtener el numero de documento');
        }
    }

    async ValModifDocu(pAccion: number, pMensaje: boolean, pGrid: boolean) {
        if (this.listVarsTransaction.toString().length === 0) {
            this.sharedService.showLoader(false);
            this.sharedService.error('Pendiente definir variables formulario transacción');
            this.errorValdocu = true;
            return;
        }
        this.errorValdocu = false;
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        //dataRest['top_codi'] = this.data['TOP_CODI'];
        if (pGrid) {
            dataRest['top_codi'] = this.itemRowClick['Tipo de Operación'];
            dataRest['val_cons'] = this.itemRowClick['Consecutivo'];
        }
        else {
            dataRest['top_codi'] = this.listVarsTransaction.filter(x => x.Name === 'P_CToper')[0].Value ?
                this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CToper')[0].Value] : this.data['TOP_CODI'];
            dataRest['val_cons'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`];
        }
        dataRest['usu_codi'] = this.sessionService.session.accountCode;
        dataRest['pro_codi'] = this.mainForm.SubTitle;
        dataRest['tab_prin'] = this.mainForm.TableName;
        dataRest['cam_cons'] = `${this.mainForm.TableName.slice(3, 6)}_CONT`;
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
            this.errorValdocu = true;
            setTimeout(() => {
                this.sharedService.error('Error al realizar validaciones modificacion de documento.');
                return;
            }, 1000);
        }
    }

    async runOnApplyEvent() {
        if (!this.listMetadataFormEvent) {
            return;
        }
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onApply').length > 0) {
            const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onApply')[0];
            for (const action of event.actions) {
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
                                        if (this.data[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else if (param.value.startsWith('?')) {
                                }
                                else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                //condicionar para formularios que lo requieran
                                if (this.listVarsTransaction.filter(x => x.Name === 'P_Auth')[0].Value === 'N') {
                                    const httpOptions = {
                                        headers: new HttpHeaders({
                                            Authorization: ''
                                        })
                                    };
                                    const resultEvent: ActionResultT<any[]> = await this.http.post<ActionResultT<any[]>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest, httpOptions).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] =
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0].Value;
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
                                }
                                else {
                                    const resultEvent: ActionResultT<any[]> = await this.http.post<ActionResultT<any[]>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] =
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0].Value;
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
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
            this.sharedService.warning('No hay configuración establecida para el evento Aplicar');
        }
    }

    async runOnRevertEvent() {
        if (!this.listMetadataFormEvent) {
            return;
        }
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onRevert').length > 0) {
            const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onRevert')[0];
            for (const action of event.actions) {
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
                                        if (this.data[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                //condicionar para formularios que lo requieran
                                if (this.listVarsTransaction.filter(x => x.Name === 'P_Auth')[0].Value === 'N') {
                                    const httpOptions = {
                                        headers: new HttpHeaders({
                                            Authorization: ''
                                        })
                                    };
                                    const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest, httpOptions).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] =
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAp')[0].Value;
                                        //Actualizar MCO_CONT si existe el campo
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] ?
                                            this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] = 0 : '';
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
                                }
                                else {
                                    const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] =
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAp')[0].Value;
                                        //Actualizar MCO_CONT si existe el campo
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] ?
                                            this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] = 0 : '';
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
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
            this.sharedService.warning('No hay configuración establecida para el evento Revertir');
        }
    }

    async runOnAnnulEvent() {
        if (!this.listMetadataFormEvent) {
            return;
        }
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onAnnul').length > 0) {
            const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onAnnul')[0];
            for (const action of event.actions) {
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
                                        if (this.data[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                //condicionar para formularios que lo requieran
                                if (this.listVarsTransaction.filter(x => x.Name === 'P_Auth')[0].Value === 'N') {
                                    const httpOptions = {
                                        headers: new HttpHeaders({
                                            Authorization: ''
                                        })
                                    };
                                    const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest, httpOptions).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        const lestado = this.listVarsTransaction.filter(x => x.Name === 'P_VEstn')[0].Value ?
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstn')[0].Value : 'N';
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] = lestado;
                                        //Actualizar MCO_CONT si existe el campo
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] ?
                                            this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] = 0 : '';
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
                                }
                                else {
                                    const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                                    if (resultEvent.IsSucessfull) {
                                        const lestado = this.listVarsTransaction.filter(x => x.Name === 'P_VEstn')[0].Value ?
                                            this.listVarsTransaction.filter(x => x.Name === 'P_VEstn')[0].Value : 'N';
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0].Value] = lestado;
                                        //Actualizar MCO_CONT si existe el campo
                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] ?
                                            this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] = 0 : '';
                                        if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                            this.sharedService.showLoader(false);
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
                                        this.sharedService.error(resultEvent.ErrorMessage);
                                    }
                                    this.redirect();
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
            this.sharedService.warning('No hay configuración establecida para el evento Anular');
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
                                        if (this.data[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                const resultEvent: ActionResult = await this.http.post<ActionResult>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                                if (resultEvent.IsSucessfull) {
                                    if (actionRest.messages !== undefined && actionRest.messages.length > 0) {
                                        this.sharedService.showLoader(false);
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
                                }
                                else {
                                    this.sharedService.error(resultEvent.ErrorMessage);
                                }
                                this.redirect();
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

    async completeTree(pAccion: String) {
        this.sharedService.showLoader(true);
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['tar_codi'] = this.tar_codi;
        dataRest['table'] = this.mainForm.TableName;
        dataRest['cam_movi'] = this.cam_movi;
        dataRest['tab_nive'] = this.tab_nive;
        dataRest['val_nive'] = this.data[`${this.tab_nive.slice(3, 6)}_CODI`];
        dataRest['val_codi'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CODI`];
        //tablas que no cumplen nemotecnia
        if (this.mainForm.TableName === 'IN_PRODU' || this.mainForm.TableName === 'PG_RUBRO') {
            dataRest['val_padr'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CPAD`]
        }
        else {
            dataRest['val_padr'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_PADR`];
        }
        dataRest['val_cont'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`];
        dataRest['accion'] = pAccion;
        try {
            const url = `${this.configService.config.urlWsGnGenerFuncs}CompleteTree`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                this.errorValTree = true;
                return;
            }
            else {
                //consultar registro creado en data del arbol
                if (pAccion === 'S') {
                    const lwhere = `${this.mainForm.TableName}.EMP_CODI = ${this.sessionService.session.selectedCompany.code} AND ${this.mainForm.TableName}.${this.mainForm.TableName.slice(3, 6)}_CONT = ${this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`]}`;
                    this.mainFormService.getSearchNodes(this.sessionService.session.selectedCompany.code, this.tar_codi,
                        this.mainForm.TableName, this.metadataGrid.queryCount, lwhere, this.cam_movi, this.tab_nive).subscribe((response: ActionResult) => {
                            if (response.IsError) {
                                this.sharedService.showLoader(false);
                                this.sharedService.error(response.ErrorMessage);
                                return;
                            }
                            else {
                                this.TreeListData = response.Result.lGnArbol.sort((a, b) => {
                                    if (a.code > b.code) {
                                        return 1;
                                    }
                                    if (a.code < b.code) {
                                        return -1;
                                    }
                                    return 0;
                                });
                                //this.TreeListData = response.Result.lGnArbol;
                            }
                            this.sharedService.showLoader(false);
                        });
                }
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.errorValTree = true;
                this.sharedService.error('Error al completar información para registro tipo arbol.');
            }, 1000);
        }
    }

    async ValidateTree(pAccion: String) {
        this.sharedService.showLoader(true);
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['tar_codi'] = this.tar_codi;
        dataRest['table'] = this.mainForm.TableName;
        dataRest['cam_movi'] = this.cam_movi;
        dataRest['tab_nive'] = this.tab_nive;
        dataRest['val_nive'] = this.data[`${this.tab_nive.slice(3, 6)}_CODI`];
        dataRest['val_codi'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CODI`];
        //tablas que no cumplen nemotecnia
        if (this.mainForm.TableName === 'IN_PRODU' || this.mainForm.TableName === 'PG_RUBRO') {
            dataRest['val_padr'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CPAD`]
        }
        else {
            dataRest['val_padr'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_PADR`];
        }
        if (this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`] !== undefined) {
            dataRest['val_cont'] = this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`]
        }
        else {
            dataRest['val_cont'] = 0;
        }
        dataRest['accion'] = pAccion;
        dataRest['val_movi'] = this.data[this.cam_movi];
        try {
            const url = `${this.configService.config.urlWsGnGenerFuncs}ValidateTree`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                this.errorValTree = true;
                return;
            }
            else {
                this.errorValTree = false;
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.errorValTree = true;
                this.sharedService.error('Error al realizar validaciones para registro tipo arbol.');
            }, 1000);
        }
    }

    async ValidateBlome(pAccion: String) {
        this.errorValBlome = false;
        const dataRest: any = {};
        dataRest['mod_inic'] = this.mainForm.TableName.slice(0, 2);
        dataRest['emp_codi'] = this.data['EMP_CODI'];
        dataRest['blo_anop'] = this.data['BLO_ANOP'];
        dataRest['blo_mesp'] = this.data['BLO_MESP'];
        dataRest['blo_acti'] = this.data['BLO_ACTI'];
        if (pAccion === 'E') {
            if (this.data['BLO_ANOP'] !== this.dataAnt['BLO_ANOP'] || this.data['BLO_MESP'] !== this.dataAnt['BLO_MESP']) {
                dataRest['blo_acci'] = pAccion;
                dataRest['ano_ante'] = this.dataAnt['BLO_ANOP'];
                dataRest['mes_ante'] = this.dataAnt['BLO_MESP'];
            }
            else {
                dataRest['blo_acci'] = 'S';
                dataRest['ano_ante'] = 0;
                dataRest['mes_ante'] = 0;
            }
        }
        else if (pAccion === 'D') {
            dataRest['blo_acci'] = pAccion;
            dataRest['ano_ante'] = 0;
            dataRest['mes_ante'] = 0;
        }
        else {
            dataRest['blo_acci'] = 'S';
            dataRest['ano_ante'] = 0;
            dataRest['mes_ante'] = 0;
        }
        try {
            const url = `${this.configService.config.urlWsGnGenerFuncs}ValidateBlome`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (resultEvent.IsError) { //mostrar inconsistencias
                this.errorValBlome = true;
                this.sharedService.error(resultEvent.ErrorMessage);
                this.listGnDocin = resultEvent.Result.lGnDocin;
                if (this.listGnDocin !== null) {
                    this.docinTitle = 'Documentos Inconsistentes';
                    this.showPopupGnDocin = true;
                }
                return;
            }
            else {
                this.errorValBlome = false;
                this.showPopupGnDocin = false;
            }
        }
        catch (error) {
            //this.data['BLO_ACTI'] = 'N';
            setTimeout(() => {
                this.sharedService.error('Error al realizar validaciones para bloqueo. Mes no bloqueado');
                this.showPopupGnDocin = false;
                this.errorValBlome = true;
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
                                                if (this.data[item.replace('{', '').replace('}', '')]) {
                                                    listValues.push(this.data[item.replace('{', '').replace('}', '')]);
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
                                        this.sharedService.error(error);
                                        this.sharedService.showLoader(false);
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

    async execProcess() {
        this.errorProcess = false;
        const dataRest: any = {};
        const lcampos = [];
        dataRest['program'] = this.execProces.program;
        dataRest['method'] = this.execProces.method;
        if (this.mainForm.FuncEspec.split(';')[0] === 'PROCESS') {
            //dataRest['type'] = 'P';
            const ltype = this.mainForm.FuncEspec.split(';')[1] ? this.mainForm.FuncEspec.split(';')[1] : '';
            dataRest['type'] = `P${ltype}`;
        }
        else if (this.mainForm.FuncEspec.split(';')[0] === 'MPROCESS') {
            let keyvalue = '';
            let keyfield = '';
            const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
            for (const item of listKeyData) {
                keyfield += `${item.Name},`;
                keyvalue += this.data[item.Name];
            }
            keyfield = keyfield.substring(0, keyfield.length - 1);
            dataRest['keyfield'] = keyfield;
            dataRest['keyvalue'] = keyvalue;
            //dataRest['type'] = 'M';
            const ltype = this.mainForm.FuncEspec.split(';')[1] ? this.mainForm.FuncEspec.split(';')[1] : '';
            dataRest['type'] = `M${ltype}`;
        }
        else {
            if (this.data[this.txtField] === null) {
                this.sharedService.error('Debe seleccionar un archivo');
                return;
            }
            dataRest['txtFile'] = this.fileBase64;
            dataRest['type'] = 'I'
        }
        dataRest['EMP_CODI'] = this.sessionService.session.selectedCompany.code;
        lcampos.push('EMP_CODI');
        if (this.mainForm.FuncEspec.split(';')[0] === 'MPROCESS') {
            for (const item of this.execProces.fields) {
                lcampos.push(item.fieldp.replace(/^FK/, ''));
                if (item.field.startsWith('FK')) {
                    const lvalor = this.data[item.field] ? this.data[item.field] : '';
                    dataRest[item.fieldp.replace(/^FK/, '')] = lvalor.substr(0, lvalor.indexOf('|') - 1);
                }
                else {
                    const itemForm = this.listItemsForm.find(x => x.dataField === item.field);
                    itemForm.dataType === 'datetime' ? dataRest[item.fieldp] = moment(this.data[item.field]).format('DD/MM/YYYY') :
                        dataRest[item.fieldp] = this.data[item.field];
                }
            }
        }
        else {
            for (const item of this.execProces.fields) {
                lcampos.push(item.field.replace(/^FK/, ''));
                if (item.field.startsWith('FK')) {
                    const lvalor = this.data[item.field] ? this.data[item.field] : '';
                    dataRest[item.field.replace(/^FK/, '')] = lvalor.substr(0, lvalor.indexOf('|') - 1);
                }
                else {
                    const itemForm = this.listItemsForm.find(x => x.dataField === item.field);
                    itemForm.dataType === 'datetime' ? dataRest[item.field] = moment(this.data[item.field]).format('DD/MM/YYYY') :
                        dataRest[item.field] = this.data[item.field];
                }
            }
        }
        dataRest['fields'] = lcampos.join(',');
        try {
            let url = '';
            if (this.mainForm.TableName.slice(3, 8) === 'PPROM') {
                url = `${this.configService.config.urlProcessExec}R${this.mainForm.TableName.slice(0, 2)}Pprom/api/R${this.mainForm.TableName.slice(0, 2)}Pprom/EjecutarProceso`
            }
            else {
                url = `${this.configService.config.urlProcessExec}R${this.mainForm.TableName.slice(0, 2)}Pproc/api/R${this.mainForm.TableName.slice(0, 2)}Pproc/EjecutarProceso`;
            }
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.errorProcess = true;
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.errorProcess = false;
                this.gprc_cont = resultEvent.Result.cpr_cont;
                if (resultEvent.Result.cpr_esta === 'F') {
                    this.sharedService.error(resultEvent.Result.cpr_mens);
                    this.docinTitle = 'Inconsistencias proceso';
                    this.listLoger = resultEvent.Result.listLoger;
                    this.showPopupGnDocin = true;
                }
                else if (resultEvent.Result.cpr_esta === 'T') {
                    const mensaje = resultEvent.Result.cpr_mens +
                        ' Inicio: ' + resultEvent.Result.cpr_fini +
                        ' Fin: ' + resultEvent.Result.cpr_ffin;
                    this.sharedService.info(mensaje);
                    //generar reporte(s) si aplica
                    if (this.mainForm.FuncEspec.split(';')[1] === 'E') {
                        const lreports = resultEvent.Result.cpr_reps.split('|');
                        const lselectformula = resultEvent.Result.cpr_sele.split('|');
                        let lurl = '';
                        let i = 0;
                        for (const item of lreports) {
                            lurl = `promptex0=${this.sessionService.session.selectedCompany.code}&promptex1=` +
                                `${this.sessionService.session.selectedCompany.name}&promptex2=${this.sessionService.session.accountCode}&promptex3=dd/mm/yyyy`
                                + `&sf=${lselectformula[i]}`;
                            const key = CryptoJS.enc.Utf8.parse('5388198671491268');
                            const iv = CryptoJS.enc.Utf8.parse('5388198671491268');
                            let lurlEncr = CryptoJS.AES.encrypt(lurl.trim(), key, {
                                keySize: 128 / 8,
                                iv: iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            }).toString();
                            //remplazar caracteres especiales
                            lurlEncr = lurlEncr.replace(/=/g, '%3D');
                            lurlEncr = lurlEncr.replace(/>/g, '%3E');
                            lurlEncr = lurlEncr.replace(/</g, '%3C');
                            lurlEncr = lurlEncr.replace(/[+]/g, '%2B');
                            lurlEncr = lurlEncr.replace(/[/]/g, '%2F');
                            setTimeout(() => {
                                window.open(`${this.configService.config.urlReportServer}${item}&${lurlEncr}`, "_blank");
                            }, 1000);
                            i += 1;
                        }
                    } //descargar archivo(s) si aplica
                    else if (this.mainForm.FuncEspec.split(';')[1] === 'A') {
                        for (const item of resultEvent.Result.txtFiles) {
                            //const source = `data:text/plain;base64,${item}`;
                            const source = item.split('|')[1]; //ya trae el tipo
                            const link = document.createElement("a");
                            link.href = source;
                            link.download = item.split('|')[0];
                            // source.Contains('text/plain') ? link.download = `${this.mainForm.SubTitle}.txt` :
                            //     link.download = `${this.mainForm.SubTitle}.docx`;
                            setTimeout(() => {
                                link.click();
                            }, 1000);
                        }
                    }
                }
                else {
                    this.sharedService.info(resultEvent.Result.cpr_mens);
                }
            }
        }
        catch (error) {
            this.errorProcess = true;
            setTimeout(() => {
                this.sharedService.error('Error en la ejecución del proceso');
            }, 1000);
        }
    }

    async ValModifProcess() {
        this.errorProcess = false;
        const dataRest: any = {};
        dataRest['program'] = this.execProces.program;
        let keyvalue = '';
        let keyfield = '';
        const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
        for (const item of listKeyData) {
            keyfield += `${item.Name},`;
            keyvalue += this.data[item.Name];
        }
        keyfield = keyfield.substring(0, keyfield.length - 1);
        dataRest['keyfield'] = keyfield;
        dataRest['keyvalue'] = keyvalue;
        try {
            const url = `${this.configService.config.urlProcessExec}R${this.mainForm.TableName.slice(0, 2)}Pproc/api/R${this.mainForm.TableName.slice(0, 2)}Pproc/ValidarEdicion`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                this.errorProcess = true;
                return;
            }
            else {
                this.errorProcess = false;
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            this.errorProcess = true;
            setTimeout(() => {
                this.sharedService.error('Error al realizar validaciones maestro proceso.');
                return;
            }, 1000);
        }
    }

    async fillTemptable() {
        this.errorTemptable = false;
        const dataRest: any = {};
        const lcampos = [];
        dataRest['program'] = this.tempTable.program;
        dataRest['method'] = this.tempTable.method;
        dataRest['EMP_CODI'] = this.sessionService.session.selectedCompany.code;
        lcampos.push('EMP_CODI');
        for (const item of this.tempTable.fields) {
            lcampos.push(item.field.replace(/^FK/, ''));
            if (item.field.startsWith('FK')) {
                const lvalor = this.data[item.field];
                dataRest[item.field.replace(/^FK/, '')] = lvalor.substr(0, lvalor.indexOf('|') - 1);
            }
            else {
                dataRest[item.field] = this.data[item.field];
            }
        }
        dataRest['fields'] = lcampos.join(',');
        try {
            let url = '';
            if (this.mainForm.TableName.slice(3, 8) === 'PREPM') {
                url = `${this.configService.config.urlReportTables}R${this.mainForm.TableName.slice(0, 2)}Prepm/api/R${this.mainForm.TableName.slice(0, 2)}Prepm/GenerarReporte`
            }
            else {
                url = `${this.configService.config.urlReportTables}R${this.mainForm.TableName.slice(0, 2)}Prepo/api/R${this.mainForm.TableName.slice(0, 2)}Prepo/GenerarReporte`;
            }
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.errorTemptable = true;
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.errorTemptable = false;
                //this.listFilters.push({Id: -1, Field:`${this.mainForm.FuncEspec.split(';')[1]}.PRC_CONT`, Datatype: 'N', Operator: '=', Value: resultEvent.Result.prc_cont})
                this.gprc_cont = resultEvent.Result.prc_cont;
                this.report('');
            }
        }
        catch (error) {
            this.errorTemptable = true;
            setTimeout(() => {
                this.sharedService.error('Error al llenar tabla temporal');
            }, 1000);
        }
    }

    hideField(dataField: string, eventName: string) {
        // se establece esta variable para que sea valida en el eval
        const data = this.data;
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
                case EventActionType.otherField:
                    break;
                case EventActionType.hideField:
                    const hideField: HideField = action.config;
                    const values = hideField.value.split(';');
                    const listEpresionValues: any[] = [];
                    for (const value of values) {
                        if (value.startsWith('{')) {
                            if (!this.data[value.replace('{', '').replace('}', '')]) {
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
                        let ltitle = '';
                        for (const field of hideField.hideFields) {
                            // se valida si es un item del formulario o un detalle
                            if (!new RegExp(/^\d+$/).test(field)) {
                                for (const ltab of this.formTabItem[0].tabs) {
                                    for (const item of ltab.items) {
                                        if (item.dataField === field) {
                                            ltitle = ltab.title;
                                            break;
                                        }
                                    }
                                    if (ltitle.length > 0) {
                                        break;
                                    }
                                }
                                if (this.form.instance.itemOption(`${ltitle}.${field}`)) {
                                    this.form.instance.itemOption(`${ltitle}.${field}`, 'visible', hideField.visible);
                                    //this.form.instance.itemOption(`${ltitle}.${field}`, 'colspan', 4);
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
                        if (this.data[param.value.replace(/^FK/, '')] === null || this.data[param.value.replace(/^FK/, '')] === undefined) {
                            this.sharedService.warning(`El campo ${itemTmp.label.text} no tiene valor establecido`);
                            rule = null;
                            break;
                        }
                        const paramSend = { ...param };
                        paramSend.value = this.data[param.value.replace(/^FK/, '')];
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
                        this.data[ruleAction.setValueField] = response.result.result;
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
        if (this.data[`DsV${dataField}`]) {
            if (this.data[`DsV${dataField}`] === this.dataAnt[dataField.replace(/^FK/, '')]) {
                return;
            }
        }
        else {
            if (this.data[dataField.replace(/^FK/, '')] === this.dataAnt[dataField.replace(/^FK/, '')]) {
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
                        this.data[otherField.field] = otherField.valuefunc;
                    }
                    else if (otherField.type === 2) { //funcion
                        //validar en listado de funciones                        
                        const lfunction = this.listFunctions.filter(x => `${x.FunctionCode}()` === otherField.valuefunc)[0];
                        // Se agrega editMode a la condición para que solo valide este estado en edición y no cuando el registro es nuevo, pendiente de aprobación por JEL , quién conoce la lógica
                        if (this.mainForm.Transaccion === 'S' && this.editMode) {
                            await this.ValModifDocu(this.cEditando, false, false);
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
                                this.data[`DsV${lfield.replace(/^FK/, '')}`] ? lvalor = this.data[`DsV${lfield.replace(/^FK/, '')}`] :
                                    lvalor = this.data[lfield.replace(/^FK/, '')];
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
                                        this.dataAnt[dataField.replace(/^FK/, '')] = this.data[dataField.replace(/^FK/, '')];
                                        this.dataAnt[dataField] = this.data[dataField];
                                        ltipoOut === 'N' ? this.data[otherField.field] = response.Result.lGnFuncOut.show_result :
                                            ltipoOut === 'D' ? this.data[otherField.field] = response.Result.lGnFuncOut.dtm_result :
                                                ltipoOut === 'S' ? this.data[otherField.field] = response.Result.lGnFuncOut.show_result : '';
                                        //remplazar valores internos en caso de ser asignacion a FK
                                        ltipoOut === 'N' ? this.data[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.num_result :
                                            ltipoOut === 'D' ? this.data[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.dtm_result :
                                                ltipoOut === 'S' ? this.data[otherField.field.replace(/^FK/, '')] = response.Result.lGnFuncOut.str_result : '';
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
                                    this.data[otherField.field] = moment(this.data[dataField]).format('YYYY');
                                    break;
                                case "MONTH()":
                                    this.data[otherField.field] = moment(this.data[dataField]).format('MM');
                                    break;
                                case "DAY()":
                                    this.data[otherField.field] = moment(this.data[dataField]).format('DD');
                                    break;
                                case "NDATE()":
                                    this.data[otherField.field] = moment(this.data[dataField]).format('YYYYMMDD');
                                    break;
                                case "DTOVER()":
                                    if (this.data['TIP_CODI'] === undefined) {
                                        this.sharedService.error('No hay valor para tipo de documento');
                                        return;
                                    }
                                    //consumir servicio
                                    this.mainFormService.getDtoVer(this.data['TIP_CODI'], this.data[dataField]).subscribe((response: ActionResult) => {
                                        if (response.IsError) {
                                            this.sharedService.error(lfunction.FunctionCode + response.ErrorMessage);
                                            return;
                                        }
                                        else {
                                            this.data[otherField.field] = response.Result.val_dive;
                                        }
                                    });
                                    break;
                                case "VALBLOMES()":
                                    //consumir servicio
                                    if (this.data[dataField]) {
                                        this.mainFormService.getValBloMes(this.sessionService.session.selectedCompany.code, this.mainForm.TableName.slice(0, 2), moment(this.data[dataField]).format('DD/MM/YYYY')).subscribe((response: ActionResult) => {
                                            if (!response.IsSucessfull) {
                                                this.sharedService.error(response.ErrorMessage);
                                                this.data[dataField] = null;
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
                                    if (this.data[dataField]) {
                                        const lmodulo = this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0] ? this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0].Value : this.mainForm.TableName.slice(0, 2);
                                        this.mainFormService.getValTipOpe(this.sessionService.session.selectedCompany.code,
                                            this.data[dataField.replace(/^FK/, '')], lmodulo,
                                            this.sessionService.session.accountCode, this.mainForm.SubTitle).subscribe((response: ActionResult) => {
                                                if (!response.IsSucessfull) {
                                                    this.sharedService.error(response.ErrorMessage);
                                                    this.data[dataField] = null;
                                                    return;
                                                }
                                                else {
                                                    //Fecha automatica
                                                    if (response.Result.lGnToper.top_feau === 'S') {
                                                        this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0].Value] = moment().locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
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
                        if (this.mainForm.Transaccion === 'S') {
                            await this.ValModifDocu(this.cEditando, false, false);
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
                                    lvalues.push(moment(this.data[item.field]).format('DD/MM/YYYY'));
                                }
                                else if (item.field.startsWith('FK')) {
                                    const valor = this.data[item.field];
                                    isNaN(valor) ? lvalues.push(this.data[item.field].substr(0, this.data[item.field].indexOf('|') - 1)) : lvalues.push(this.data[item.field]);
                                }
                                else {
                                    lvalues.push(this.data[item.field]);
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
                                                this.data[item.field] = new Date(dt.slice(6, 10), dt.slice(3, 5) - 1, dt.slice(0, 2), 0, 0, 0, 0);
                                            }
                                            else {
                                                this.data[item.field] = lresult.filter(x => x.param === item.param)[0].value;
                                                lresult.filter(x => x.param === item.param)[0].intvalue !== -1 ?
                                                    this.data[item.field.replace(/^FK/, '')] = lresult.filter(x => x.param === item.param)[0].intvalue :
                                                    this.data[item.field.replace(/^FK/, '')] = lresult.filter(x => x.param === item.param)[0].value;
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

    configSearchDataForeignKey(conditions: string) {
        let resultSetWhereListData = true;
        if (conditions) {
            resultSetWhereListData = this.setWhereListData(JSON.parse(conditions), false, false);
        }
        else {
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
                        listFields.push(` ${lalias}.${column.dataField} `);
                    } else {
                        listFields.push(` ${ltable}.${column.dataField} `);
                    }
                } else {
                    column.caption ? listFields.push(` ${column.dataField} '${column.caption}'`) : listFields.push(` ${column.dataField}`);
                }
            }
        }
        // se agregan los campos que forman la llave primaria
        for (const item of this.foreignKeyData.displayMemberForeignKey.split(';')) {
            /*             if (this.foreignKeyData.tableNameAliasForeignKey) {
                            listFields.push(` ${this.foreignKeyData.tableNameAliasForeignKey}.${item} `);
                        } else {
                            listFields.push(` ${this.foreignKeyData.tableNameForeignKey}.${item} `);
                        } */
            listFields.push(item);

        }
        if (this.foreignKeyData.tableNameAliasForeignKey) {
            this.searchData.tableName = `${ltable} ${lalias}`;
            // (this.foreignKeyData.valueMemberForeignKey.split(';')[1] !== this.foreignKeyData.valueMemberForeignKey.split(';')[0])
            //     && (this.foreignKeyData.valueMemberForeignKey.split(';')[1].length > 0) ?
            //     this.searchData.orderBy = ` ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]} ,
            // ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[1]}` :
            //     this.searchData.orderBy = ` ${lalias}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]}`;
            this.searchData.orderBy = '';
            const lfields = this.foreignKeyData.valueMemberForeignKey.split(';').filter((item, index) => { return this.foreignKeyData.valueMemberForeignKey.split(';').indexOf(item) === index; });
            for (const item of lfields) {
                item.length > 0 ? this.searchData.orderBy += ` ${lalias}.${item} ,` : '';
            }
            this.searchData.orderBy = this.searchData.orderBy.substring(0, this.searchData.orderBy.length - 1);
        } else {
            this.searchData.tableName = ltable;
            // (this.foreignKeyData.valueMemberForeignKey.split(';')[1] !== this.foreignKeyData.valueMemberForeignKey.split(';')[0])
            //     && (this.foreignKeyData.valueMemberForeignKey.split(';')[1].length > 0) ?
            //     this.searchData.orderBy = ` ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]} ,
            // ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[1]}` :
            //     this.searchData.orderBy = ` ${ltable}.${this.foreignKeyData.valueMemberForeignKey.split(';')[0]}`;
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
            if (lcadena.includes('getUserCode()')){
                lcadena = lcadena.replace('getUserCode()', `'${this.sessionService.session.accountCode}'`);
            }            
            if (lcadena.includes('{')) { // tiene parametros
                let lpos1 = lcadena.indexOf('{');
                let lpos2 = lcadena.indexOf('}');
                while (lpos1 !== -1) {
                    const lvar = lcadena.substring(lpos1, lpos2 + 1);
                    const lfield = lcadena.substring(lpos1 + 1, lpos2);
                    let lvalor = this.data[lfield.replace(/^FK/, '')];
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
        this.searchData.querySum = null;
        this.searchData.like = null;
        this.searchData.pageSize = 10;
        this.listDataForeignKey = null;
        if (!this.foreignKeyData.whereForeignKeyOnlyRecord) {
            return;
        }
        if (!this.configSearchDataForeignKey(this.foreignKeyData.whereForeignKeyOnlyRecord)) {
            this.sharedService.showLoader(false);
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
                this.data[this.foreignKeyData.dataField] = null;
                this.data[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
                this.sharedService.error('Valor no encontrado');
            }
        } else if (response.IsError) {
            this.sharedService.error(response.ErrorMessage);
            this.data[this.foreignKeyData.dataField] = null;
            this.data[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
        } else {
            this.sharedService.warning(response.Messages);
            this.data[this.foreignKeyData.dataField] = null;
            this.data[this.foreignKeyData.dataField.replace(/^FK/, '')] = null;
        }
    }

    cleanDependencyFields(foreignKey: string) {
        for (const item of this.listItemsForm.filter(x => x.dataField !== foreignKey && x.isForeignKey)) {
            if (item.whereForeignKey) {
                for (const itemCondition of JSON.parse(item.whereForeignKey).filter((x: any) => x.value.startsWith('{'))) {
                    const fieldTmp = itemCondition.value.replace('{', '').replace('}', '');

                    if (fieldTmp === foreignKey.replace(/^FK/, '')) {
                        delete this.data[item.dataField];
                        delete this.data[item.dataField.replace(/^FK/, '')];
                        if (item.visible) {
                            this.form.instance.getEditor(item.dataField).option('readOnly', false);
                            this.form.instance.getEditor(item.dataField).option('buttons[1].options.visible', false);
                        }
                    }

                    if (item.propsConfigSearch) {
                        const cache = JSON.parse(item.propsConfigSearch).find(x => x.id === 'Cache');
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
                        delete this.data[item.dataField];
                        delete this.data[item.dataField.replace(/^FK/, '')];
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
                this.sharedService.warning(response.Messages);
            }
            this.sharedService.showLoader(false);
        });
    }

    searchDataForeignKeyWithLike() {
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
                    conditions.push(`${dataField} LIKE '%${this.criteriaSearch}%'`);
                    break;
                case SearchMethod.EndWith:
                    conditions.push(`${dataField} LIKE '%${this.criteriaSearch}'`);
                    break;
                case SearchMethod.Equals:
                    conditions.push(`${dataField} LIKE '${this.criteriaSearch}'`);
                    break;
                default:
                    conditions.push(`${dataField} LIKE '${this.criteriaSearch}%'`);
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
                this.sharedService.warning(response.Messages);
            }
            this.sharedService.showLoader(false);
        });
    }

    listAllData() {
        setTimeout(() => {
            this.searchData.where = null;
            this.searchData.tableName = this.mainForm.TableName;
            this.searchData.pageNumber = this.page;
            this.searchData.orderBy = this.listColumsGrid[0].name;
            this.searchData.like = null;
            this.searchData.query = this.metadataGrid.query;
            this.searchData.queryCount = this.metadataGrid.queryCount;
            this.searchData.querySum = this.metadataGrid.queryCount;
            if (this.metadataGrid.pageSize) {
                this.searchData.pageSize = this.metadataGrid.pageSize;
            }
            if (this.metadataGrid.conditions) {
                // se establece si tiene un where inicial
                this.setWhereListData(JSON.parse(this.metadataGrid.conditions), false, false);
            }
            this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
                if (responseList.IsSucessfull) {
                    this.listData = responseList.Result.Data;
                    this.totalRecords = responseList.Result.TotalRecords;
                } else if (responseList.IsError) {
                    this.sharedService.error(responseList.ErrorMessage);
                } else {
                    this.sharedService.warning(responseList.Messages);
                }
                this.sharedService.showLoader(false);
            }, () => {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            });
        }, 300);
    }

    listAllDataWithLike() {
        this.searchData.where = null;
        this.searchData.tableName = this.mainForm.TableName;
        this.searchData.pageNumber = this.page;
        this.searchData.orderBy = this.listColumsGrid[0].name;
        if (this.metadataGrid.pageSize) {
            this.searchData.pageSize = this.metadataGrid.pageSize;
        }
        if (this.metadataGrid.conditions) {
            // se establece si tiene un where inicial
            this.setWhereListData(JSON.parse(this.metadataGrid.conditions), false, false);
        }
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

    listAllDataSearch(redirect: boolean) {
        setTimeout(() => {
            this.searchData.where = null;
            this.searchData.tableName = this.mainForm.TableName;
            this.searchData.pageNumber = this.page;
            this.searchData.orderBy = this.listColumsGrid[0].name;
            this.searchData.like = null;
            this.searchData.query = this.metadataGrid.query;
            this.searchData.queryCount = this.metadataGrid.queryCount;
            this.searchData.querySum = this.metadataGrid.queryCount;
            if (this.metadataGrid.pageSize) {
                this.searchData.pageSize = this.metadataGrid.pageSize;
            }
            // incluir condiciones de grilla
            if (this.metadataGrid.conditions) {
                const gridconds = JSON.parse(this.metadataGrid.conditions).map((x) => {
                    return {
                        field: x.field,
                        label: 'label',
                        operator: x.operator,
                        operatorUnion: x.operatorUnion,
                        type: this.listDataType.filter(y => y.value === this.listItemsForm.filter(z => z.dataField.replace(/^FK/, '') === x.field.split('.')[1])[0].dataType)[0].text,
                        value: x.value
                    }
                });
                for (const item of gridconds) {
                    this.listSearchConditions.push(item);
                }
            }
            if (this.listSearchConditions) {
                this.setWhereListData(this.listSearchConditions, true, redirect);
                // eliminar condiciones de grilla para no dejarlas visible en el QBE
                if (this.metadataGrid.conditions) {
                    const gridconds = JSON.parse(this.metadataGrid.conditions).map((x) => {
                        return {
                            field: x.field,
                            label: 'label',
                            operator: x.operator,
                            operatorUnion: x.operatorUnion,
                            type: this.listDataType.filter(y => y.value === this.listItemsForm.filter(z => z.dataField.replace(/^FK/, '') === x.field.split('.')[1])[0].dataType)[0].text,
                            value: x.value
                        }
                    });
                    for (const item of gridconds) {
                        const index = this.listSearchConditions.indexOf(item);
                        this.listSearchConditions.splice(index, 1);
                    }
                }
            }
            if (this.treeView) {
                if (redirect) {
                    //this.listRootNodes();
                }
                else {
                    this.sharedService.showLoader(true);
                    if (this.tar_codi > 0) {
                        this.searchData.where += ` AND ${this.mainForm.TableName}.TAR_CODI = ${this.tar_codi}`;
                    }
                    this.mainFormService.getSearchNodes(this.sessionService.session.selectedCompany.code, this.tar_codi,
                        this.mainForm.TableName, this.searchData.queryCount, this.searchData.where, this.cam_movi, this.tab_nive).subscribe((response: ActionResult) => {
                            if (response.IsError) {
                                this.sharedService.showLoader(false);
                                this.sharedService.error(response.ErrorMessage);
                                return;
                            }
                            else {
                                this.TreeListData = response.Result.lGnArbol.sort((a, b) => {
                                    if (a.code > b.code) {
                                        return 1;
                                    }
                                    if (a.code < b.code) {
                                        return -1;
                                    }
                                    return 0;
                                });
                                this.totalRecords = response.Result.tot_docu;
                                //this.TreeListData = response.Result.lGnArbol;
                            }
                            this.sharedService.showLoader(false);
                        });
                }
            }
            else {
                this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
                    if (responseList.IsSucessfull) {
                        this.listData = responseList.Result.Data;
                        this.totalRecords = responseList.Result.TotalRecords;
                    } else if (responseList.IsError) {
                        this.sharedService.error(responseList.ErrorMessage);
                    } else {
                        this.sharedService.warning(responseList.Messages);
                    }
                    this.conditionsRecordKey = [];
                    this.sharedService.showLoader(false);
                }, () => {
                    this.sharedService.error('Ocurrio un error inesperado');
                    this.sharedService.showLoader(false);
                });
            }
        }, 200);
    }

    sumDataNew() {
        setTimeout(() => {
            this.searchData.where = null;
            this.searchData.tableName = this.mainForm.TableName;
            this.searchData.pageNumber = this.page;
            this.searchData.orderBy = this.listColumsGrid[0].name;
            this.searchData.like = null;
            this.searchData.query = this.metadataGrid.query;
            this.searchData.queryCount = this.metadataGrid.queryCount;
            this.searchData.querySum = this.metadataGrid.queryCount.replace('SELECT COUNT(1) AS Count', `SELECT SUM(${this.itemColumnClick.name}) as Total`);
            if (this.metadataGrid.pageSize) {
                this.searchData.pageSize = this.metadataGrid.pageSize;
            }
            if (this.listSumAuditConditions) {
                this.setWhereListData(this.listSumAuditConditions, true, false);
            }
            this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
                if (responseList.IsSucessfull) {
                    //this.listData = responseList.Result.Data;
                    //this.totalRecords = responseList.Result.TotalRecords;
                    this.sumRecords = responseList.Result.SumRecords;
                    this.sharedService.info(`Total "${this.itemColumnClick.caption}":  ${this.sumRecords.toLocaleString('es-CO')}`);
                } else if (responseList.IsError) {
                    this.sharedService.error(responseList.ErrorMessage);
                } else {
                    this.sharedService.warning(responseList.Messages);
                }
                this.sharedService.showLoader(false);
            }, () => {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            });
        }, 200);
    }

    sumData() {
        let total = 0;
        for (const item of this.listData) {
            for (const [field, value] of Object.entries(item)) {
                if (field === this.itemColumnClick.caption) {
                    total += Number(value);
                }
            }
            this.sharedService.info(`Total "${this.itemColumnClick.caption}":  ${total.toLocaleString('es-CO')}`);
        }
    }

    async add() {
        if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
            this.sharedService.warning('No tiene permiso para crear');
            return;
        }
        this.setListActionsForm();
        this.visualizeForm = true;
        if (!this.addInForeignKey) {
            this.toolBarButtons.redirect = true;
        } else {
            this.toolBarButtons.redirect = false;
        }
        this.toolBarButtons.save = true;
        this.toolBarButtons.edit = false;
        this.toolBarButtons.add = false;
        this.data = {};
        this.dataAnt = {}; //correccion F116
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['vad_tabl'] = this.mainForm.TableName;
        dataRest['vad_orig'] = this.sessionService.session.accountCode;
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}GetGnVadep`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.listGnVadep = resultEvent.Result;
                setTimeout(async () => {
                    if (this.listGnVadep) {
                        for (const item of this.listItemsForm.filter(x => x.visible)) {
                            let lvalor = '';
                            this.listGnVadep.filter(y => y.vad_camp === item.dataField.replace(/^FK/, ''))[0] ?
                                lvalor = this.listGnVadep.filter(y => y.vad_camp === item.dataField.replace(/^FK/, ''))[0].vad_valo : lvalor = '';
                            if (lvalor.length > 0) {
                                this.data[item.dataField.replace(/^FK/, '')] = lvalor;
                                if (item.isForeignKey) {
                                    this.foreignKeyData = { ... this.listItemsForm.find((x) => x.dataField === item.dataField) };
                                    await this.searchDataForeignKeyOnlyRecord();
                                }
                            }
                        }
                    }
                }, 200);
            }
            for await (const item of this.listItemsForm.filter((x) => x.editorOptions.mode === 'password')) {
                this.listPassFields.push({ field: item.dataField, data: this.data[item.dataField] });
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al consultar valores por defecto.');
                this.sharedService.showLoader(false);
            }, 1000);
        }
    }

    setTreeFields() {
        if (this.treeView && this.newTree) {
            this.data[`${this.mainForm.TableName.slice(3, 6)}_CODI`] = this.currentTreeItem.code;
            this.data[`${this.mainForm.TableName.slice(3, 6)}_PADR`] = this.currentTreeItem.code;
            this.data[`${this.tab_nive.slice(3, 6)}_CODI`] = this.currentTreeItem.level + 1;
            this.data[`FK${this.tab_nive.slice(3, 6)}_CODI`] = this.currentTreeItem.level + 1;
        }
    }

    search() {
        //Armar QBE
        if (this.listSearchConditions.length === 0) {
            for (const item of this.listColumsGrid) {
                if (item.visible) {
                    const itemForm = this.listItemsForm.find(x => x.dataField.replace(/^FK/, '') === item.name.split('.')[1]);
                    let ltipo = '';
                    if (itemForm !== undefined) {
                        switch (itemForm.dataType) {
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
                        this.listSearchConditions.push({ field: item.name, label: item.caption, type: ltipo, operator: '=', value: '', operatorUnion: 'AND' });
                    }
                    else {
                        this.listSearchConditions.push({ field: item.name, label: item.caption, type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                    }
                }
            }
        }
        this.showPopupSearchConditions = true;
    }

    async defval(pClear: boolean) {
        //Armar listado valores
        if (this.listDefValues.length === 0) {
            //asignar valores para usuario y tabla
            const dataRest: any = {};
            dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
            dataRest['vad_tabl'] = this.mainForm.TableName;
            dataRest['vad_orig'] = this.sessionService.session.accountCode;
            try {
                this.sharedService.showLoader(true);
                const url = `${this.configService.config.urlWsGnGenerFuncs}GetGnVadep`;
                const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
                if (!resultEvent.IsSucessfull) {
                    this.sharedService.showLoader(false);
                    this.sharedService.error(resultEvent.ErrorMessage);
                    return;
                }
                else {
                    this.listGnVadep = resultEvent.Result;
                    setTimeout(() => {
                        for (const item of this.listItemsForm.filter(x => x.visible)) {
                            let ltipo = '';
                            switch (item.dataType) {
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
                            let lvalor = '';
                            if (!pClear && this.listGnVadep) {
                                this.listGnVadep.filter(y => y.vad_camp === item.dataField.replace(/^FK/, ''))[0] ?
                                    lvalor = this.listGnVadep.filter(y => y.vad_camp === item.dataField.replace(/^FK/, ''))[0].vad_valo :
                                    lvalor = ''
                            }
                            this.listDefValues.push({ label: item.label.text, value: lvalor, type: ltipo, field: item.dataField.replace(/^FK/, '') });
                        }
                    }, 200);
                }
                this.sharedService.showLoader(false);
            }
            catch (error) {
                setTimeout(() => {
                    this.sharedService.error('Error al consultar valores por defecto.');
                    this.sharedService.showLoader(false);
                }, 1000);
            }
        }
        this.showPopupDefaultValues = true;
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

    async process() {
        this.formatDates();
        this.formatChecks();
        if (!this.form.instance.validate().isValid) {
            return;
        }
        this.sharedService.showLoader(true);
        await this.execProcess();
        if (this.errorProcess) {
            this.sharedService.showLoader(false);
            return;
        }
        this.sharedService.showLoader(false);
    }

    async preReport() {
        this.formatDates();
        this.formatChecks();
        if (!this.form.instance.validate().isValid) {
            return;
        }
        this.sharedService.showLoader(true);
        //Verificar si se debe primero llenar tabla temporal
        if (this.tempTable.program) {
            await this.fillTemptable();
            if (this.errorTemptable) {
                this.sharedService.showLoader(false);
                return;
            }
        }
        else {
            //Validacion de rangos
            if (this.listFilters) {
                const lfilters = this.listFilters.filter(x => x.Range > 0);
                for (const item of lfilters) {
                    //lvalor = item.Value.startsWith('FK') ? lvalor.substr(0, lvalor.indexOf('|') - 1) : lvalor;
                    let inicial: any;
                    let final: any;
                    this.data[this.listFilters.filter(y => y.Id === item.Range)[0].Value] ?
                        inicial = this.listFilters.filter(y => y.Id === item.Range)[0].Value.startsWith('FK') ?
                            this.data[this.listFilters.filter(y => y.Id === item.Range)[0].Value].substr(0, this.data[this.listFilters.filter(y => y.Id === item.Range)[0].Value].indexOf('|') - 1) :
                            this.data[this.listFilters.filter(y => y.Id === item.Range)[0].Value] :
                        inicial = 0;
                    this.data[item.Value] ?
                        final = item.Value.startsWith('FK') ?
                            this.data[item.Value].substr(0, this.data[item.Value].indexOf('|') - 1) : this.data[item.Value] :
                        final = 0;
                    if (isNaN(inicial) || isNaN(final)) { //Validar como cadenas de caracteres
                        if (inicial > final) {
                            this.sharedService.showLoader(false);
                            const ltxtini = this.listItemsForm.filter(i => i.dataField === this.listFilters.filter(y => y.Id === item.Range)[0].Value)[0];
                            const ltxtfin = this.listItemsForm.filter(i => i.dataField === item.Value)[0];
                            this.sharedService.error(`[${ltxtini.label.text}] debe ser menor que [${ltxtfin.label.text}]`);
                            return;
                        }
                    }
                    else { //Validar como numeros
                        if (Number(inicial) > Number(final)) {
                            this.sharedService.showLoader(false);
                            const ltxtini = this.listItemsForm.filter(i => i.dataField === this.listFilters.filter(y => y.Id === item.Range)[0].Value)[0];
                            const ltxtfin = this.listItemsForm.filter(i => i.dataField === item.Value)[0];
                            this.sharedService.error(`[${ltxtini.label.text}] debe ser menor que [${ltxtfin.label.text}]`);
                            return;
                        }
                    }
                }
            }
            this.report('');
        }
        this.sharedService.showLoader(false);
    }

    async preReportEvent() {
        if (!this.listMetadataFormEvent) {
            return;
        }
        if (this.listMetadataFormEvent.filter((x) => x.eventName === 'onReport').length > 0) {
            const event = this.listMetadataFormEvent.filter((x) => x.eventName === 'onReport')[0];
            for (const action of event.actions) {
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
                                        if (this.data[item.replace('{', '').replace('}', '')]) {
                                            listValues.push(this.data[item.replace('{', '').replace('}', '')]);
                                        }
                                    }
                                    dataRest[param.key] = listValues.join(' ');
                                } else if (param.value.startsWith('?')) {
                                }
                                else {
                                    dataRest[param.key] = param.value;
                                }
                            }
                            try {
                                const resultEvent: ActionResultT<string> = await this.http.post<ActionResultT<string>>(`${this.configService.config.urlBaseWsTransaction}${actionRest.url}`, dataRest).toPromise();
                                if (resultEvent.IsSucessfull) {
                                    const lreporte = resultEvent.Result;
                                    lreporte.length > 0 ? this.report(lreporte) : this.report('');
                                    if (actionRest.responseMessage) {
                                        this.sharedService.hide();
                                        setTimeout(() => {
                                            this.sharedService.success(actionRest.responseMessage);
                                        }, 500);
                                    }
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
            this.sharedService.warning('No hay configuración establecida para el evento Reporte');
        }
    }

    report(pName: string) {
        let itemEmpcodi = this.listItemsForm.find(x => x.dataField.replace(/^FK/, '') === 'EMP_CODI');
        let lparams = '';
        let lselectformula = '';
        let loperador = '';
        let lvalor = '';
        let lurl = '';
        let i = 0;
        let j = 4; //inicia en 4 por los parametros "estandar"
        if (this.totalRecords === 0 && !this.reportView && !this.treeView) {
            this.sharedService.error('Debe realizar consulta de registros');
            return;
        }
        //armar parametros
        if (this.listParams) {
            for (const item of this.listParams) {
                if (item.Value.startsWith('{')) {
                    if (this.editMode || this.reportView) {
                        if (this.data[item.Value.replace('{', '').replace('}', '')].length !== 0) {
                            //lparams += `&promptex${j}%3D${this.data[item.Value.replace('{', '').replace('}', '')]}`;
                            item.Value.startsWith('{FK') ?
                                lparams += `&promptex${j}=${this.data[item.Value.replace('{', '').replace('}', '')].substr(0, this.data[item.Value.replace('{', '').replace('}', '')].indexOf('|') - 1)}` :
                                lparams += `&promptex${j}=${this.data[item.Value.replace('{', '').replace('}', '')]}`;
                        }
                    }
                    else {
                        this.sharedService.error('Parametros de reporte tipo variable. Debe ingresar a un registro');
                        return;
                    }
                }
                else {
                    //lparams += `&promptex${j}%3D${item.Value}`;
                    lparams += `&promptex${j}=${item.Value}`;
                }
                j += 1;
            }
        }
        //armar filtros formularios reporte
        if (this.reportView) {
            itemEmpcodi = undefined;
            if (this.listFilters) { //filtros de pantalla del formulario
                for (const item of this.listFilters.filter(x => x.Operator !== 'IN')) {
                    if (this.data[item.Value]) {
                        switch (item.Operator) {
                            case '=':
                                loperador = '%3D';
                                break;
                            case '<>':
                                //loperador = '%E2%89%A0';
                                loperador = '%3C%3E';
                                break;
                            case '<':
                                loperador = '%3C';
                                break;
                            case '<=':
                                //loperador = '%E2%89%A4';
                                loperador = '%3C%3D';
                                break;
                            case '>':
                                loperador = '%3E';
                                break;
                            case '>=':
                                //loperador = '%E2%89%A5';
                                loperador = '%3E%3D';
                                break;
                        }
                        loperador = item.Operator;
                        lvalor = this.data[item.Value];
                        lvalor = item.Value.startsWith('FK') ? lvalor.substr(0, lvalor.indexOf('|') - 1) : lvalor;
                        switch (item.Datatype) {
                            case 'D':
                            case 'F':
                                lvalor = `'${moment(lvalor).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'`;
                                break;
                            case 'N':
                                lvalor = `${lvalor}`
                                break;
                            default:
                                lvalor = `'${lvalor}'`;
                                break;
                        }
                        if (i === 0) {
                            //lselectformula += `&sf%3D${item.Field}${loperador}${lvalor}`
                            lselectformula += `&sf=${item.Field}${loperador}${lvalor}`
                        }
                        else {
                            lselectformula += ` AND ${item.Field}${loperador}${lvalor}`
                        }
                        i += 1;
                    }
                }
                //primer campo con IN
                let fieldant = '';
                this.listFilters.filter(x => x.Operator === 'IN')[0] ?
                    fieldant = this.listFilters.filter(x => x.Operator === 'IN')[0].Field : fieldant = '';
                let filterIn = '';
                let filterLast = '';
                for (const item of this.listFilters.filter(x => x.Operator === 'IN')) {
                    if (item.Field === fieldant) {
                        item.Datatype === 'D' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                            item.Datatype === 'F' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                                item.Datatype === 'N' ? lvalor = `${item.Value}` : lvalor = `'${item.Value}'`;
                        filterIn.length === 0 ? filterIn = `IN(${lvalor},` : filterIn += `${lvalor},`;
                        //filterLast = `${item.Field}%20${filterIn.substr(0, filterIn.length - 1)})`;
                        filterLast = `${item.Field} ${filterIn.substr(0, filterIn.length - 1)})`;
                    }
                    else {
                        // i === 0 ? lselectformula += `&sf%3D${filterLast}` :
                        //     lselectformula += `AND${filterLast}`;
                        i === 0 ? lselectformula += `&sf=${filterLast}` :
                            lselectformula += ` AND ${filterLast}`;
                        i += 1;
                        filterIn = '';
                        item.Datatype === 'D' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                        item.Datatype === 'F' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                            item.Datatype === 'N' ? lvalor = `${item.Value}` : lvalor = `'${item.Value}'`;
                        filterIn.length === 0 ? filterIn = `IN(${lvalor},` : filterIn += `${lvalor},`;
                        //filterLast = `${item.Field}%20${filterIn.substr(0, filterIn.length - 1)})`;
                        filterLast = `${item.Field} ${filterIn.substr(0, filterIn.length - 1)})`;
                    }
                    fieldant = item.Field;
                }
                if (filterLast.length > 0) {
                    // i === 0 ? lselectformula += `&sf%3D${filterLast}` :
                    //     lselectformula += `AND${filterLast}`;
                    i === 0 ? lselectformula += `&sf=${filterLast}` :
                        lselectformula += ` AND ${filterLast}`;
                    i += 1;
                }
            }
            if (this.listFiltersF) { //filtros de valores fijos
                for (const item of this.listFiltersF.filter(x => x.Operator !== 'IN')) {
                    switch (item.Operator) {
                        case '=':
                            loperador = '%3D';
                            break;
                        case '<>':
                            //loperador = '%E2%89%A0';
                            loperador = '%3C%3E';
                            break;
                        case '<':
                            loperador = '%3C';
                            break;
                        case '<=':
                            //loperador = '%E2%89%A4';
                            loperador = '%3C%3D';
                            break;
                        case '>':
                            loperador = '%3E';
                            break;
                        case '>=':
                            //loperador = '%E2%89%A5';
                            loperador = '%3E%3D';
                            break;
                    }
                    loperador = item.Operator;
                    lvalor = item.Value;
                    switch (item.Datatype) {
                        case 'D':
                        case 'F':
                            lvalor = `'${moment(lvalor).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'`;
                            break;
                        case 'N':
                            lvalor = `${lvalor}`
                            break;
                        default:
                            lvalor = `'${lvalor}'`;
                            break;
                    }
                    if (i === 0) {
                        //lselectformula += `&sf%3D${item.Field}${loperador}${lvalor}`
                        lselectformula += `&sf=${item.Field}${loperador}${lvalor}`
                    }
                    else {
                        lselectformula += ` AND ${item.Field}${loperador}${lvalor}`
                    }
                    i += 1;
                }
                //primer campo con IN
                let fieldant = '';
                this.listFiltersF.filter(x => x.Operator === 'IN')[0] ?
                    fieldant = this.listFiltersF.filter(x => x.Operator === 'IN')[0].Field : fieldant = '';
                let filterIn = '';
                let filterLast = '';
                for (const item of this.listFiltersF.filter(x => x.Operator === 'IN')) {
                    if (item.Field === fieldant) {
                        item.Datatype === 'D' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                            item.Datatype === 'F' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                                item.Datatype === 'N' ? lvalor = `${item.Value}` : lvalor = `'${item.Value}'`;
                        filterIn.length === 0 ? filterIn = `IN(${lvalor},` : filterIn += `${lvalor},`;
                        //filterLast = `${item.Field}%20${filterIn.substr(0, filterIn.length - 1)})`;
                        filterLast = `${item.Field} ${filterIn.substr(0, filterIn.length - 1)})`;
                    }
                    else {
                        // i === 0 ? lselectformula += `&sf%3D${filterLast}` :
                        //     lselectformula += `AND${filterLast}`;
                        i === 0 ? lselectformula += `&sf=${filterLast}` :
                            lselectformula += ` AND ${filterLast}`;
                        i += 1;
                        filterIn = '';
                        item.Datatype === 'D' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                            item.Datatype === 'F' ? lvalor = `'${moment(item.Value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'` :
                                item.Datatype === 'N' ? lvalor = `${item.Value}` : lvalor = `'${item.Value}'`;
                        filterIn.length === 0 ? filterIn = `IN(${lvalor},` : filterIn += `${lvalor},`;
                        //filterLast = `${item.Field}%20${filterIn.substr(0, filterIn.length - 1)})`;
                        filterLast = `${item.Field} ${filterIn.substr(0, filterIn.length - 1)})`;
                    }
                    fieldant = item.Field;
                }
                if (filterLast.length > 0) {
                    // i === 0 ? lselectformula += `&sf%3D${filterLast}` :
                    //     lselectformula += `AND${filterLast}`;
                    i === 0 ? lselectformula += `&sf=${filterLast}` :
                        lselectformula += ` AND ${filterLast}`;
                    i += 1;
                }
            }
            //filtro prc_cont
            if (this.gprc_cont !== -1) {
                const lprc_cont = this.tempTable.consec.length > 0 ? this.tempTable.consec : 'PRC_CONT';
                if (i === 0) {
                    //lselectformula += `&sf%3D${this.mainForm.FuncEspec.split(';')[1]}.${lprc_cont}%3D${this.gprc_cont}`
                    lselectformula += `&sf=${this.mainForm.FuncEspec.split(';')[1]}.${lprc_cont}=${this.gprc_cont}`
                }
                else {
                    //lselectformula += `AND${this.mainForm.FuncEspec.split(';')[1]}.${lprc_cont}%3D${this.gprc_cont}`;
                    lselectformula += ` AND ${this.mainForm.FuncEspec.split(';')[1]}.${lprc_cont}=${this.gprc_cont}`;
                }
                i += 1;
            }
            //filtro empresa
            if (i === 0) {
                //lselectformula += `&sf%3D${this.mainForm.FuncEspec.split(';')[1]}.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}`;
                lselectformula += `&sf=${this.mainForm.FuncEspec.split(';')[1]}.EMP_CODI=${this.sessionService.session.selectedCompany.code}`;
            }
            else {
                //lselectformula += `AND${this.mainForm.FuncEspec.split(';')[1]}.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}`;
                lselectformula += ` AND ${this.mainForm.FuncEspec.split(';')[1]}.EMP_CODI=${this.sessionService.session.selectedCompany.code}`;
            }
        }
        else { //filtros formularios maestro/transaccion
            for (const item of this.listSearchConditions) {
                if (item.value.length !== 0) {
                    switch (item.operator) {
                        case '=':
                            loperador = '%3D';
                            break;
                        case '<>':
                            //loperador = '%E2%89%A0';
                            loperador = '%3C%3E';
                            break;
                        case '<':
                            loperador = '%3C';
                            break;
                        case '<=':
                            //loperador = '%E2%89%A4';
                            loperador = '%3C%3D';
                            break;
                        case '>':
                            loperador = '%3E';
                            break;
                        case '>=':
                            //loperador = '%E2%89%A5';
                            loperador = '%3E%3D';
                            break;
                    }
                    loperador = item.operator;
                    switch (item.type) {
                        case 'D':
                        case 'F':
                            lvalor = `'${moment(item.value).format(`${this.configService.config.datetimeFormat}T00:00:00`)}'`;
                            break;
                        case 'N':
                            lvalor = `${item.value}`
                            break;
                        default:
                            lvalor = `'${item.value}'`;
                            break;
                    }
                    if (itemEmpcodi !== undefined) {
                        lselectformula += ` AND ${item.field}${loperador}${lvalor}`
                    }
                    else {
                        if (i === 0) {
                            //lselectformula += `&sf%3D${item.field}${loperador}${lvalor}`
                            lselectformula += `&sf=${item.field}${loperador}${lvalor}`
                        }
                        else {
                            lselectformula += ` AND ${item.field}${loperador}${lvalor}`
                        }
                    }
                    i += 1;
                }
            }
        }
        if (this.mainForm.FuncEspec.split(';')[0] === 'TREEVIEW') {
            if (i === 0) {
                if (this.tar_codi > 0) {
                    //lselectformula += `&sf=${this.mainForm.TableName}.EMP_CODI=${this.sessionService.session.selectedCompany.code} AND ${this.mainForm.TableName}.TAR_CODI=${this.tar_codi}`;
                    lselectformula += ` AND ${this.mainForm.TableName}.TAR_CODI=${this.tar_codi}`;
                    i += 1;
                }
            }
            else {
                if (this.tar_codi > 0) {
                    //lselectformula += ` AND ${this.mainForm.TableName}.EMP_CODI=${this.sessionService.session.selectedCompany.code} AND ${this.mainForm.TableName}.TAR_CODI=${this.tar_codi}`;
                    lselectformula += ` AND ${this.mainForm.TableName}.TAR_CODI=${this.tar_codi}`;
                    i += 1;
                }
            }
            if (!this.treeView) {
                for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
                    if (item.Name !== 'EMP_CODI') {
                        lselectformula += ` AND ${this.mainForm.TableName}.${item.Name}=${this.currentTreeItem.cont}`;
                        i += 1;
                    }
                }
            }
        }
        //obtener el nombre del reporte
        const data = this.data;
        let reportName = '';
        let reportant = ''
        let expresion = '';
        if (this.listMultiReport) {
            for (const item of this.listMultiReport) {
                if (item.report !== reportant) {
                    expresion = '';
                    const conds = this.listMultiReport.filter(x => x.report === item.report);
                    for (const cond of conds) {
                        cond.field.startsWith('FK') ? expresion += ` data.${cond.field}.substr(0, data.${cond.field}.indexOf('|') - 1) == '${cond.value}' ${cond.operator}` :
                            expresion += ` data.${cond.field} == ${cond.value} ${cond.operator}`;
                    }
                    expresion = expresion.substring(0, expresion.length - 2);
                    if (eval(expresion)) {
                        reportName = item.report.toLowerCase();
                        break;
                    }
                }
                reportant = item.report;
            }
            if (reportName.length === 0) {
                reportName = this.mainForm.SubTitle.toLowerCase();
            }
        }
        else {
            reportName = this.mainForm.SubTitle.toLowerCase();
        }
        pName.length > 0 ? reportName = pName : '';
        //incluir filtro de empresa o no        
        if (itemEmpcodi !== undefined) {
            //incluir filtro de consecutivo para transacciones
            if (this.mainForm.Transaccion === 'S') {
                const lconsec = this.data[`${this.mainForm.TableName.slice(3, 6)}_CONT`];
                // window.open(`${this.configService.config.urlReportServer}${reportName}&promptex0%3D${this.sessionService.session.selectedCompany.code}&promptex1%3D` +
                //     `${this.sessionService.session.selectedCompany.name}&promptex2%3D${this.sessionService.session.accountCode}&promptex3%3Ddd%2Fmm%2Fyyyy${lparams}` +
                //     `&sf%3D${this.mainForm.TableName}.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}` +
                //     `AND${this.mainForm.TableName}.${this.mainForm.TableName.slice(3, 6)}_CONT%3D${lconsec}${lselectformula}`, "_blank");
                lurl = `promptex0=${this.sessionService.session.selectedCompany.code}&promptex1=` +
                    `${this.sessionService.session.selectedCompany.name}&promptex2=${this.sessionService.session.accountCode}&promptex3=dd/mm/yyyy${lparams}` +
                    `&sf=${this.mainForm.TableName}.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}` +
                    ` AND ${this.mainForm.TableName}.${this.mainForm.TableName.slice(3, 6)}_CONT=${lconsec}${lselectformula}`;
            }
            else {
                // window.open(`${this.configService.config.urlReportServer}${reportName}&promptex0%3D${this.sessionService.session.selectedCompany.code}&promptex1%3D` +
                //     `${this.sessionService.session.selectedCompany.name}&promptex2%3D${this.sessionService.session.accountCode}&promptex3%3Ddd%2Fmm%2Fyyyy${lparams}` +
                //     `&sf%3D${this.mainForm.TableName}.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}${lselectformula}`, "_blank");
                lurl = `promptex0=${this.sessionService.session.selectedCompany.code}&promptex1=` +
                    `${this.sessionService.session.selectedCompany.name}&promptex2=${this.sessionService.session.accountCode}&promptex3=dd/mm/yyyy${lparams}` +
                    `&sf=${this.mainForm.TableName}.EMP_CODI=${this.sessionService.session.selectedCompany.code}${lselectformula}`;
            }
        }
        else {
            // window.open(`${this.configService.config.urlReportServer}${reportName}&promptex0%3D${this.sessionService.session.selectedCompany.code}&promptex1%3D` +
            //     `${this.sessionService.session.selectedCompany.name}&promptex2%3D${this.sessionService.session.accountCode}&promptex3%3Ddd%2Fmm%2Fyyyy${lparams}` +
            //     lselectformula, "_blank");
            lurl = `promptex0=${this.sessionService.session.selectedCompany.code}&promptex1%=` +
                `${this.sessionService.session.selectedCompany.name}&promptex2=${this.sessionService.session.accountCode}&promptex3=dd/mm/yyyy${lparams}` +
                lselectformula;
        }
        // const key = CryptoJS.enc.Utf8.parse(this.configService.config.keyReportServer);
        // const iv = CryptoJS.enc.Utf8.parse(this.configService.config.ivReportServer);
        const key = CryptoJS.enc.Utf8.parse('5388198671491268');
        const iv = CryptoJS.enc.Utf8.parse('5388198671491268');
        let lurlEncr = CryptoJS.AES.encrypt(lurl.trim(), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        //remplazar caracteres especiales
        lurlEncr = lurlEncr.replace(/=/g, '%3D');
        lurlEncr = lurlEncr.replace(/>/g, '%3E');
        lurlEncr = lurlEncr.replace(/</g, '%3C');
        lurlEncr = lurlEncr.replace(/[+]/g, '%2B');
        lurlEncr = lurlEncr.replace(/[/]/g, '%2F');
        window.open(`${this.configService.config.urlReportServer}${reportName}&${lurlEncr}`, "_blank");
    }

    docinReport() {
        let reportName = '';
        let lurl = '';
        if (this.mainForm.FuncEspec.split(';')[0] !== 'PROCESS' && this.mainForm.FuncEspec.split(';')[0] !== 'IMPORT' && this.mainForm.FuncEspec.split(';')[0] !== 'MPROCESS') {
            // const lselectformula = `&sf%3DGN_DOCIN.EMP_CODI%3D${this.sessionService.session.selectedCompany.code}AND` +
            //     `GN_DOCIN.DOC_ANOP%3D${this.data['BLO_ANOP']}ANDGN_DOCIN.DOC_MESP%3D${this.data['BLO_MESP']}ANDGN_MODUL.MOD_INIC%3D'${this.mainForm.TableName.slice(0, 2)}'`;
            reportName = 'sgndocin';
            const lselectformula = `&sf=GN_DOCIN.EMP_CODI=${this.sessionService.session.selectedCompany.code} AND ` +
                `GN_DOCIN.DOC_ANOP=${this.data['BLO_ANOP']} AND GN_DOCIN.DOC_MESP=${this.data['BLO_MESP']} AND GN_MODUL.MOD_INIC='${this.mainForm.TableName.slice(0, 2)}'`;

            lurl = `promptex0=${this.sessionService.session.selectedCompany.code}&promptex1=` +
                `${this.sessionService.session.selectedCompany.name}&promptex2=${this.sessionService.session.accountCode}&promptex3=dd/mm/yyyy` +
                lselectformula;

            // window.open(`${this.configService.config.urlReportServer}sgndocin&promptex0%3D${this.sessionService.session.selectedCompany.code}&promptex1%3D` +
            //     `${this.sessionService.session.selectedCompany.name}&promptex2%3D${this.sessionService.session.accountCode}&promptex3%3Ddd%2Fmm%2Fyyyy` +
            //     lselectformula, "_blank");            
        }
        else {
            const ltable = this.mainForm.TableName.slice(0, 2) + '_LOGER';
            const report = this.mainForm.TableName.slice(0, 2) + 'LOGER';
            reportName = `s${report.toLowerCase()}`;
            //const lselectformula = `&sf=${ltable}.EMP_CODI=${this.sessionService.session.selectedCompany.code} AND ${ltable}.PRC_CONT=${this.gprc_cont}`;
            const lselectformula = `&sf=${ltable}.PRC_CONT=${this.gprc_cont}`;
            lurl = `promptex0=${this.sessionService.session.accountCode}` + lselectformula;

            // window.open(`${this.configService.config.urlReportServer}s${report.toLowerCase()}&promptex0%3D${this.sessionService.session.accountCode}` +
            //     lselectformula, "_blank");            
        }

        const key = CryptoJS.enc.Utf8.parse('5388198671491268');
        const iv = CryptoJS.enc.Utf8.parse('5388198671491268');
        let lurlEncr = CryptoJS.AES.encrypt(lurl.trim(), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        //remplazar caracteres especiales
        lurlEncr = lurlEncr.replace(/=/g, '%3D');
        lurlEncr = lurlEncr.replace(/>/g, '%3E');
        lurlEncr = lurlEncr.replace(/</g, '%3C');
        lurlEncr = lurlEncr.replace(/[+]/g, '%2B');
        lurlEncr = lurlEncr.replace(/[/]/g, '%2F');
        window.open(`${this.configService.config.urlReportServer}${reportName}&${lurlEncr}`, "_blank");
    }

    count() {
        this.sharedService.info(`El No de filas es: ${this.totalRecords}`);
    }

    sum() {
        if (this.itemColumnClick.dataType === undefined) {
            this.sharedService.warning('Debe consultar registros');
            return;
        }
        switch (this.itemColumnClick.dataType) {
            case 'int':
            case 'decimal':
            case 'smallint':
            case 'numeric':
            case 'tinyint':
            case 'bigint':
            case 'number':
                this.sumDataNew();
                break;
            default:
                this.sharedService.error(`La columna "${this.itemColumnClick.caption}" no se puede sumar.`)
                break;
        }
    }

    audit() {
        //validar fechas
        if (this.auditData.dateini > this.auditData.datefin) {
            this.sharedService.error('Fecha Inicial debe ser menor que Fecha Final');
            return;
        }
        setTimeout(() => {
            this.searchData.where = null;
            this.searchData.tableName = this.mainForm.TableName;
            this.searchData.pageNumber = this.page;
            this.searchData.orderBy = this.listColumsGrid[0].name;
            this.searchData.like = null;
            this.searchData.query = this.metadataGrid.query;
            this.searchData.queryCount = this.metadataGrid.queryCount;
            this.searchData.querySum = this.metadataGrid.queryCount;
            if (this.metadataGrid.pageSize) {
                this.searchData.pageSize = this.metadataGrid.pageSize;
            }
            //this.listSearchConditions = [];
            //modificar filtros
            this.listSumAuditConditions = [];
            this.listSumAuditConditions.push({ field: `${this.mainForm.TableName}.AUD_UFAC`, label: 'AUD_UFAC', type: 'S', operator: '>=', value: moment(this.auditData.dateini).format('DD/MM/YYYY'), operatorUnion: 'AND' });
            this.listSumAuditConditions.push({ field: `${this.mainForm.TableName}.AUD_UFAC`, label: 'AUD_UFAC', type: 'S', operator: '<=', value: moment(this.auditData.datefin).format('DD/MM/YYYY'), operatorUnion: 'AND' });
            if (this.auditData.user.length > 0) {
                this.listSumAuditConditions.push({ field: `${this.mainForm.TableName}.AUD_USUA`, label: 'AUD_USUA', type: 'S', operator: '=', value: this.auditData.user, operatorUnion: 'AND' });
            }
            if (this.listSumAuditConditions) {
                this.setWhereListData(this.listSumAuditConditions, true, false);
            }
            this.dynamicProgramsService.listData({ ProjectId: this.mainForm.Id, Data: this.searchData }).subscribe((responseList: ActionResult) => {
                if (responseList.IsSucessfull) {
                    this.listData = responseList.Result.Data;
                    this.totalRecords = responseList.Result.TotalRecords;
                    this.showPopupAudit = false;
                } else if (responseList.IsError) {
                    this.sharedService.error(responseList.ErrorMessage);
                } else {
                    this.sharedService.warning(responseList.Messages);
                }
                this.sharedService.showLoader(false);
            }, () => {
                this.sharedService.error('Ocurrio un error inesperado');
                this.sharedService.showLoader(false);
            });
        }, 200);
    }

    async listMovCont() {
        const dataRest: any = {};
        dataRest['program'] = 'SGnCtrlo';
        dataRest['method'] = 'ConsultarMovContableWs';
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        const lmco_cont = this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0] ?
            this.data[this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0].Value] :
            this.data['MCO_CONT'] ? this.data['MCO_CONT'] : 0;
        if (lmco_cont === 0) {
            this.sharedService.info('Transacción no tiene documento contable asociado');
            this.sharedService.showLoader(false);
            return;
        }
        dataRest['tra_cont'] = lmco_cont;
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnCtrlo}RGnCtrlo/ConsultMovContable`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //asignar resultado
                this.listDataMovCont = resultEvent.Result;
                this.showPopupMcont = true;
                setTimeout(() => {
                    this.movContGrid.instance.option('columns', []);
                    this.movContGrid.instance.addColumn({ caption: 'Cuenta', dataField: 'cue_codi' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre cuenta', dataField: 'cue_nomb' });
                    this.movContGrid.instance.addColumn({ caption: 'Valor débito', dataField: 'dmc_vadb', format: '$ #,##0.##' });
                    this.movContGrid.instance.addColumn({ caption: 'Valor crédito', dataField: 'dmc_vacr', format: '$ #,##0.##' });
                    this.movContGrid.instance.addColumn({ caption: 'Valor base', dataField: 'dmc_vaba', format: '$ #,##0.##' });
                    this.movContGrid.instance.addColumn({ caption: 'Descripción', dataField: 'dmc_desc' });
                    this.movContGrid.instance.addColumn({ caption: 'Referencia', dataField: 'dmc_refe' });
                    this.movContGrid.instance.addColumn({ caption: 'Tercero', dataField: 'ter_coda' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre Tercero', dataField: 'ter_noco' });
                    this.movContGrid.instance.addColumn({ caption: 'Centro costo', dataField: 'arb_codc' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre centro costo', dataField: 'arb_nomc' });
                    this.movContGrid.instance.addColumn({ caption: 'Proyecto', dataField: 'arb_codp' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre proyecto', dataField: 'arb_nomp' });
                    this.movContGrid.instance.addColumn({ caption: 'Area', dataField: 'arb_coda' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre area', dataField: 'arb_noma' });
                    this.movContGrid.instance.addColumn({ caption: 'Sucursal', dataField: 'arb_cods' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre sucursal', dataField: 'arb_noms' });
                    this.movContGrid.instance.addColumn({ caption: 'Tercero mandante', dataField: 'ter_codm' });
                    this.movContGrid.instance.addColumn({ caption: 'Nombre tercero mandante', dataField: 'ter_nocm' });
                }, 200);
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al consultar documento contable.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    async listBasedoc(pWhere: string) {
        if (this.editMode) {
            const item = this.baseDocConfig.origins.filter(x => x.value === this.data[this.baseDocConfig.field])[0];
            if (item !== undefined) {
                const dataRest: any = {};
                dataRest['program'] = this.baseDocConfig.program;
                dataRest['origin'] = item.value;
                dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
                dataRest['tra_cont'] = this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
                dataRest['where'] = pWhere;
                try {
                    this.sharedService.showLoader(true);
                    const url = `${this.configService.config.urlWsGnCtrlo}/RGnCtrlo/ListBaseDoc`;
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
                            this.baseDocGrid.instance.addColumn({ caption: 'Fecha', dataField: 'bas_fech', format: 'dd/MM/yyyy' });
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
        else {
            this.sharedService.warning('Debe guardar primero el encabezado para relacionar documento base');
            return;
        }
    }

    async deleteBasedoc() {
        //if (await this.sharedService.confirm()) {
        const item = this.baseDocConfig.origins.filter(x => x.value === this.data[this.baseDocConfig.field])[0];
        if (item !== undefined) {
            const dataRest: any = {};
            dataRest['program'] = this.baseDocConfig.program;
            dataRest['origin'] = item.value;
            dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
            dataRest['tra_cont'] = this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
            // const listConditionsKey = [];
            // for (const item of JSON.parse(this.mainForm.MetadataPrimaryKey)) {
            //   const column = this.listColumsGrid.filter((x) => x.name === `${this.mainForm.TableName}.${item.Name}`)[0];
            //   listConditionsKey.push(`${item.Name}='${row[column.dataField]}'`);
            // }
            // dataRest['where'] = ` WHERE ${listConditionsKey.join(' AND ')}`;
            try {
                this.sharedService.showLoader(true);
                const url = `${this.configService.config.urlWsGnCtrlo}/RGnCtrlo/DeleteBaseDoc`;
                const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
                if (!resultEvent.IsSucessfull) {
                    this.sharedService.showLoader(false);
                    this.sharedService.error(resultEvent.ErrorMessage);
                    return;
                }
                else {
                    //this.listAllData(); //reconsulta detalle
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
        //}
    }

    async loadDetailsBaseDoc() {
        const item = this.baseDocConfig.origins.filter(x => x.value === this.data[this.baseDocConfig.field])[0];
        if (item !== undefined && this.itemRowClickBaseDoc) {
            const dataRest: any = {};
            dataRest['program'] = this.baseDocConfig.program;
            dataRest['method'] = item.method;
            dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
            dataRest['tra_cont'] = this.data[this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value];
            dataRest['bas_cont'] = this.itemRowClickBaseDoc['bas_cont'];
            try {
                this.sharedService.showLoader(true);
                const url = `${this.configService.config.urlWsGnCtrlo}/RGnCtrlo/LoadDetails`;
                const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
                if (!resultEvent.IsSucessfull) {
                    this.sharedService.showLoader(false);
                    this.sharedService.error(resultEvent.ErrorMessage);
                    this.errorload = true;
                    return;
                }
                else {
                    //this.listAllData(); //reconsulta detalle
                    this.errorload = false;
                    this.itemRowClickBaseDoc = null;
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

    redirect() {
        this.setListActionsMain();
        this.showMasterDetail = false;
        this.editMode = false;
        //this.data = {};
        this.visualizeForm = false;
        const listFuncMember = this.mainForm.FuncEspec.split(';');
        if (listFuncMember[0] === 'TREEVIEW') {
            this.treeView = true;
        }
        this.listItemsForm = JSON.parse(this.listItemsFormTmp);
        this.toolBarButtons.redirect = false;
        this.toolBarButtons.save = false;
        this.toolBarButtons.edit = false;
        this.toolBarButtons.add = true;
        this.listAllDataSearch(true);
        setTimeout(() => {
            this.renderGridColumns();
        }, 100);
    }

    renderGridColumns() {
        setTimeout(() => {
            this.grid.instance.beginUpdate();
            this.grid.instance.option('columns', []);
            for (const item of this.listColumsGrid.filter(x => x.visible === true)) {
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
                this.grid.instance.addColumn(item);
            }
            if (this.listPermisions.find(x => x === DELETE_ACTION)) {
                this.grid.instance.addColumn({
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
                        onClick: (e: any) => {
                            this.deleteData(e.row.data);
                        }
                    }]
                });
            }

            this.grid.instance.endUpdate();
        }, 100);
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

    prepareCheckBoxValue(item: Property) {
        if (item.editorType === 'dxCheckBox') {
            if (this.data[item.dataField] === 'S') {
                this.data[item.dataField] = true
            }
            else {
                this.data[item.dataField] = false
            }
        }
    }

    prepareDefaultValue(item: Property) {
        // si es llave foranea no se hace nada
        // if (item.isForeignKey && item.dataField !== 'FKEMP_CODI') {
        //     return;
        // }
        // si el editor es un numero y el registro es nuevo se establcece 0
        if (!this.editMode && item.editorType === 'dxNumberBox') {
            this.data[item.dataField] = 0;
        }
        // si no tiene modos de aplicacion del valor no se hace nada
        if (!item.editorOptions.defaultValueModes) {
            if (!this.editMode && item.dataType === 'bit') {
                this.data[item.dataField] = false;
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
        delete item.editorOptions.value;
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
                            this.data[item.dataField] = response.Result.con_disp;
                            this.data[item.dataField.replace(/^FK/, '')] = response.Result.con_disp;
                        }
                    });
            }
            else {
                const value = this.commonFunctions[item.editorOptions.defaultValueFunc]();
                this.data[item.dataField] = value;
                this.data[item.dataField.replace(/^FK/, '')] = value;
            }
            delete item.editorOptions.value;
        }
        // si tiene valor por defecto y no funcion
        if (item.editorOptions.value !== undefined) {
            this.data[item.dataField] = item.editorOptions.value;
            this.data[item.dataField.replace(/^FK/, '')] = item.editorOptions.value;
            delete item.editorOptions.value;
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
                this.data[item.dataField] = item.editorOptions.value;
            } else {
                // si tiene el modo de guardar
                if (!this.editMode) {
                    const result: ActionResult = await this.dynamicProgramsService.getNumericSequence(item.sequenceId).toPromise();
                    item.editorOptions.value = result.Result;
                    this.data[item.dataField] = item.editorOptions.value;
                } else {
                    item.editorOptions.value = this.data[item.dataField];
                }
            }

        }
    }

    async getValueForeignKey(item: Property) {
        if (this.editMode) {
            delete item.editorOptions.value;
            return;
        }
        if (!item.isForeignKey || item.dataField === 'FKEMP_CODI') {
            return;
        }
        if (!item.editorOptions.value) {
            return;
        }
        const listConditions = [];
        const listValueMember = item.valueMemberForeignKey.split(';');

        for (let i = 0; i < listValueMember.length; i++) {
            const element = listValueMember[i];
            listConditions.push(`${item.tableNameAliasForeignKey}.${element} = '${item.editorOptions.value}'`);
        }
        this.searchData.select = item.dataField.replace(/^FK/, '');
        this.searchData.joins = `${item.tableNameForeignKey} AS ${item.tableNameAliasForeignKey}`
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
            this.data[`${item.dataField}`] = displayMember.join(' | '); //se modifica separador
        } else {
            this.data[`${item.dataField}`] = response.Result[item.valueMemberForeignKey.split(';')[0]];
        }
        this.data[item.dataField.replace(/^FK/, '')] = item.editorOptions.value;
        setTimeout(() => {
            if (item.visible) {
                this.form.instance.getEditor(item.dataField).option('readOnly', true);
                this.form.instance.getEditor(item.dataField).option('buttons[1].options.visible', true);
            }
        }, 200);
        delete item.editorOptions.value;

    }

    popupHeight = () => {
        return Math.round(window.innerHeight / 1.4);
    }

    gridHeight = () => {
        return window.innerHeight - 275;
    }

    gridHeightBasedoc = () => {
        return window.innerHeight - 370;
    }

    gridSearchBasedocHeight = () => {
        return window.innerHeight / 2.8;
    }

    gridSearchHeight = () => {
        if (this.listSearchConditions.length > 10) {
            return window.innerHeight / 1.5;
        }
        else {
            return this.listSearchConditions.length * 48;
        }

    }
    gridSearchFKHeight = () => {
        if (this.listSearchFKConditions.length > 10) {
            return window.innerHeight / 1.5;
        }
        else {
            return this.listSearchFKConditions.length * 50;
        }

    }

    heightScroll = () => {
        return Math.round(window.innerHeight / 1.3);
    }

    setForeignKey() {
        if (!this.itemRowClickSearch) {
            return;
        }
        if (this.foreignKeyData.displayMemberForeignKey) {
            const displayMember = [];
            for (let item of this.foreignKeyData.displayMemberForeignKey.split(';')) {
                item = item.substr(item.indexOf('.') + 1, item.length);
                displayMember.push(this.itemRowClickSearch[item]);
            }
            this.data[`${this.foreignKeyData.dataField}`] = displayMember.join(' | '); //se modifica separador
        } else {
            this.data[`${this.foreignKeyData.dataField}`] = this.itemRowClickSearch[this.foreignKeyData.valueMemberForeignKey.split(';')[0]];
        }

        const listValueMember = this.foreignKeyData.valueMemberForeignKey.split(';');
        const listValueMemberParent = this.foreignKeyData.valueMemberParentKey.split(';');

        for (let i = 0; i < listValueMember.length; i++) {
            const element = listValueMember[i];
            this.itemRowClickSearch[element] !== undefined ? this.data[listValueMemberParent[i]] = this.itemRowClickSearch[element] : '';
        }

        this.searchVisible = false;
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

    closePopupFileUpload() {
        this.fileUploadVisible = false;
        this.listDocuments = [];
    }

    setDisplayFileUpload() {
        for (const item of this.listItemsForm.filter((x) => x.isFileUpload === true)) {
            if (!this.data[item.dataField]) {
                continue;
            }
            this.data[`OPHFU_${item.dataField}`] = this.data[item.dataField];
            this.data[item.dataField] = this.data[item.dataField].split('_OPHFU_')[0];
        }
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
                this.data[this.itemUpload.dataField] = `${this.sessionService.session.selectedCompany.code}_${item.file.name}`;
                this.data[`OPHFU_${this.itemUpload.dataField}`] = `${this.sessionService.session.selectedCompany.code}_${item.file.name}_OPHFU_${result[0].RMT_BLAR}`;
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
                    this.setWhereListData(JSON.parse(this.fieldDataSource.params), false, false);
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

    listMasterDetails() {
        const listMainFormMasterDetailTmp: any[] = JSON.parse(this.mainForm.MetadataMasterDetail).sort((a, b) => {
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
                let projectTmp = response.Result.find((x: any) => x.Id === item.ProjectId);
                projectTmp = {
                    ...projectTmp,
                    Visible: true
                };
                this.listMainFormMasterDetail.push(projectTmp);
            }
        }, () => {
            this.listMainFormMasterDetail = [];
        });
    }

    listRootNodes() {
        this.sharedService.showLoader(true);
        this.mainFormService.getRootNodes(this.sessionService.session.selectedCompany.code, this.tar_codi, this.mainForm.TableName, this.cam_movi, this.tab_nive).subscribe((response: ActionResult) => {
            if (response.IsError) {
                this.sharedService.showLoader(false);
                this.sharedService.error(response.ErrorMessage);
                return;
            }
            else {
                this.TreeListData = response.Result.lGnArbol;
            }
            this.sharedService.showLoader(false);
        });
    }

    getChildren(e) {
        this.currentTreeItem = e.itemData;
        if (!this.currentTreeItem.isLoad) {
            //consumir servicio hijos
            this.sharedService.showLoader(true);
            this.mainFormService.getChildrenNodes(this.sessionService.session.selectedCompany.code, this.tar_codi,
                this.currentTreeItem.code, this.mainForm.TableName, this.cam_movi, this.tab_nive).subscribe((response: ActionResult) => {
                    if (response.IsError) {
                        this.sharedService.showLoader(false);
                        this.sharedService.error(response.ErrorMessage);
                        return;
                    }
                    else {
                        this.currentTreeItem.isLoad = true;
                        if (response.Result.lGnArbol.length > 0) {
                            this.treeViewId.instance.expandItem(this.currentTreeItem.code);
                            this.currentTreeItem.expanded = true;
                        }
                        for (const item of response.Result.lGnArbol) {
                            if (!this.TreeListData.find(x => x.code == item.code)) {
                                this.TreeListData.push(item);
                            }
                        }
                        if (this.currentTreeItem.move === 'S' || this.currentTreeItem.move === 'M') {
                            for (const item of this.TreeListData) {
                                if (item.code !== this.currentTreeItem.code) {
                                    item.expanded = false;
                                }
                            }
                        }
                        this.TreeListData = this.TreeListData.sort((a, b) => {
                            if (a.code > b.code) {
                                return 1;
                            }
                            if (a.code < b.code) {
                                return -1;
                            }
                            return 0;
                        });
                    }
                    this.sharedService.showLoader(false);
                });
        }
        else {
            this.currentTreeItem.expanded = true;
            this.treeViewId.instance.expandItem(this.currentTreeItem.code);
            this.TreeListData = this.TreeListData.sort((a, b) => {
                if (a.code > b.code) {
                    return 1;
                }
                if (a.code < b.code) {
                    return -1;
                }
                return 0;
            });
        }
    }

    getDisplayExpr(item) {
        if (!item) {
            return "";
        }
        else if (item.code === '-1') {
            return item.name
        }
        else {
            return item.code + " - " + item.name;
        }
    }

    treeViewItemContextMenu(e) {
        this.currentTreeItem = e.itemData;
    }

    contextMenuItemClick(e) {
        const treeView = this.treeViewId.instance;
        switch (e.itemData.id) {
            case 'view': {
                this.editData(this.currentTreeItem);
                this.newTree = false;
                break;
            }
            case 'add': {
                if (this.currentTreeItem.move === 'S' || this.currentTreeItem.move === 'A') {
                    this.sharedService.error('El código admite movimiento. No es posible insertar hijos.');
                    return;
                }
                this.newTree = true;
                this.add();
                break;
            }
            case 'delete': {
                if (this.currentTreeItem.move === 'N' || this.currentTreeItem.move === 'M') {
                    this.sharedService.error('El código no admite movimiento. No es posible eliminar.');
                    return;
                }
                this.newTree = false;
                this.deleteData(this.currentTreeItem);
                break;
            }
            case 'refresh': {
                this.listRootNodes();
                break;
            }
        }
    }

    setDataSourceValue() {
        if (!this.itemRowClickDataSource) {
            return;
        }
        if (!this.itemRowClickDataSource[this.fieldDataSource.valueMember]) {
            this.sharedService.warning(`El campo (${this.fieldDataSource.valueMember}) no existe en el item seleccionado`);
        } else {
            this.data[this.fieldDataSource.dataField] = this.itemRowClickDataSource[this.fieldDataSource.valueMember];
            if (this.fieldDataSource.valueShow) {
                this.data[`DsV${this.fieldDataSource.dataField}`] = this.data[this.fieldDataSource.dataField];
                this.data[this.fieldDataSource.dataField] = this.itemRowClickDataSource[this.fieldDataSource.valueShow];
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

    buildTabs() {
        // Inicializa las pestañas
        this.formTabItem[0].tabs = [];
        // Crea la pestaña por defecto
        this.formTabItem[0].tabs.push({ title: this.mainForm.Title, alignItemLabels: true, id: 0, items: [], colCount: 4, icon: 'activefolder' });
        if (this.formTabs !== null && this.formTabs.length > 0) {
            // Crea las pestañas parametrizadas
            for (const tab of this.formTabs) {
                this.formTabItem[0].tabs.push({ title: tab.Name, alignItemLabels: true, id: Number(tab.Id), items: [], colCount: 4, icon: 'activefolder' });
            }
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
                if (!this.data[dataFieldTmp]) {
                    this.dataSourceVisible = false;
                    this.sharedService.warning(`El parametro ${fieldTmp.label.text} no tiene valor establecido`);
                    return;
                }

                let value = this.data[dataFieldTmp];
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

    setWhereListData(listConditions: any[], isQBE: boolean, redirect: boolean): boolean {
        let where = '';
        for (let i = 0; i < listConditions.length; i++) {
            const element = listConditions[i];
            if (element.value.length > 0) {
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
                        if (!this.data[dataFieldTmp]) {
                            this.sharedService.warning(`El parametro ${fieldTmp.label.text} no tiene valor establecido`);
                            this.searchVisible = false;
                            this.dataSourceVisible = false;
                            return false;
                        }
                        let value = this.data[dataFieldTmp];
                        // si se debe obtener desde un control de fecha
                        if (value instanceof Date) {
                            value = moment(value).locale('es-CO').format(`${this.configService.config.datetimeFormat}THH:mm:ss`);
                        }
                        where += `${element.field}${element.operator}'${value}' ${element.operatorUnion} `;
                    } else if (this.data[dataFieldTmp] === undefined || this.data[dataFieldTmp] === null) {
                        if (element.operator === '=') {
                            where += `${element.field} IS NULL ${element.operatorUnion} `;
                        } else {
                            where += `${element.field} IS NOT NULL ${element.operatorUnion} `;
                        }
                    } else {
                        // si tiene valor
                        let value = this.data[dataFieldTmp];
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
                            where += `${element.field}${element.operator} ${this.sessionService.session.selectedCompany.code} ${element.operatorUnion} `;
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
                            }
                            else {
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
                                            //if (element.value.search(/\./) < 0 && !isQBE) {
                                            if (element.type === 'S' || element.type === undefined) {
                                                where = where.replace(`${element.field} IN (`, `${element.field} IN ('${element.value}',`)
                                            }
                                            else if (element.type === 'D') {
                                                const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                                                const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                                                where = where.replace(`${lfield} IN (`, `${lfield} IN ('${lvalue}',`);
                                            }
                                            else {
                                                where = where.replace(`${element.field} IN (`, `${element.field} IN (${element.value},`)
                                            }

                                        }
                                        else {
                                            //if (element.value.search(/\./) < 0 && !isQBE) {
                                            if (element.type === 'S' || element.type === undefined) {
                                                where += `${element.field} IN ('${element.value}') ${element.operatorUnion} `
                                            } else if (element.type === 'D') {
                                                const lfield = ` CONVERT(CHAR(8),${element.field},112)`; //pendiente validacion motor
                                                const lvalue = `${element.value.substr(6, 4)}${element.value.substr(3, 2)}${element.value.substr(0, 2)}`;
                                                where += `${lfield} IN ('${lvalue}') ${element.operatorUnion} `;
                                            }
                                            else {
                                                where += `${element.field} IN (${element.value}) ${element.operatorUnion} `;
                                            }
                                        }
                                    }
                                    else if (element.operator === 'LIKE' || element.operator === 'NOT LIKE') {
                                        // si tiene un punto se entiende que es un campo de los joins
                                        //if (element.value.search(/\./) < 0) {
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
                                where += `${lfield} IN ('${lvalue}') ${element.operatorUnion} `
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
        //agregar filtro de empresa
        if (isQBE) {
            //si es transaccion y en este punto no hay filtros, adicionar un 1 = 0
            if (this.mainForm.Transaccion === 'S' && where.length === 0) {
                where += '1 = 0';
            }
            else if (this.mainForm.Transaccion === 'S' && redirect) {
                this.gcon_disp > 0 ? where += ` AND ${this.mainForm.TableName}.${this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value} = 
                    ${this.gcon_disp}` : where += ` AND ${this.mainForm.TableName}.${this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0].Value} = 
                    ${this.gcon_disp} AND 1 = 0`; //evitar mostrar registro nulo
            }
            else if (redirect) {
                if (this.conditionsRecordKey.length > 0) {
                    this.searchData.where = this.conditionsRecordKey.join(' AND ');
                    return;
                }
            }
            //si en este punto no hay filtros y llamado es desde redirect
            if (where.length === 0 && redirect) {
                if (this.conditionsRecordKey.length > 0) {
                    this.searchData.where = this.conditionsRecordKey.join(' AND ');
                    return;
                }
                else {
                    where += '1 = 0';
                }
            }
            const itemForm = this.listItemsForm.find(x => x.dataField.replace(/^FK/, '') === 'EMP_CODI');
            if (itemForm !== undefined && (this.mainForm.TableName !== 'GN_EMPRE' && this.mainForm.TableName !== 'GN_DIGFL')) {
                if (where.length !== 0) {
                    where += ` AND ${this.mainForm.TableName}.EMP_CODI = ${this.sessionService.session.selectedCompany.code}`;
                }
                else {
                    where += `${this.mainForm.TableName}.EMP_CODI = ${this.sessionService.session.selectedCompany.code}`;
                }
            }
        }
        else {
            if (this.empcodiFilter.length > 0) {
                if (where.length !== 0) {
                    where += ` AND ${this.empcodiFilter}`;
                }
                else {
                    where += `${this.empcodiFilter}`;
                }
            }
        }
        if (where.length === 0) {
            this.searchData.where = null;
        } else {
            this.searchData.where = where;
        }

        return true;
    }

    runHideFields() {
        // se ocultan los campos que tengan el evento
        if (this.listMetadataControlEvent) {
            for (const item of this.listMetadataControlEvent.filter((x) => x.actions.filter((y) => y.type === EventActionType.hideField))) {
                this.hideField(item.dataField, item.eventName);
            }
        }
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

    responseAttach(e: boolean) {
        this.showPopupAttach = false;
    }

    responseRefresh(e: boolean) {
        e ? this.redirect() : '';
    }

    setConditions() {
        let lcampos = 0;
        let lfilter = 0;
        if (this.mainForm.Transaccion === 'S') {
            for (const item of this.listSearchConditions) {
                lcampos += 1;
                if (item.value.length === 0) {
                    lfilter += 1;
                }
            }
            if (lcampos === lfilter) {
                this.sharedService.error('Debe definir por lo menos un filtro para la consulta');
                return;
            }
            else {
                //this.listSumAuditConditions = Object.assign({}, this.listSearchConditions);
                this.listSumAuditConditions = JSON.parse(JSON.stringify(this.listSearchConditions));
                this.listAllDataSearch(false);
                this.showPopupSearchConditions = false;
            }
        }
        else {
            //this.listSumAuditConditions = Object.assign({}, this.listSearchConditions);
            this.listSumAuditConditions = JSON.parse(JSON.stringify(this.listSearchConditions));
            this.listAllDataSearch(false);
            this.showPopupSearchConditions = false;
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
            this.itemRowClickBaseDoc = null;
            await this.listBasedoc(' ');
            this.showPopupSearchBasedocConditions = false;
        }
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

    async setDefval() {
        //guardar valores para usuario y tabla
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['vad_tabl'] = this.mainForm.TableName;
        dataRest['vad_camp'] = this.listDefValues.map(x => x.field).join(',');
        dataRest['vad_orig'] = this.sessionService.session.accountCode;
        dataRest['vad_valo'] = this.listDefValues.map(x => x.value).join(',');
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}SetGnVadep`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.showPopupDefaultValues = false;
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error guardando valores por defecto.');
                this.sharedService.showLoader(false);
            }, 1000);
        }
    }

    tabFocus(e: any) {
        if (this.mainForm.Transaccion === 'S') {
            // foco en el form base pasa al form detalle
            if (+e.nextId === this.baseDocConfig.projectBaseId && +e.activeId === this.baseDocConfig.projectDetailId) {
                this.refresh = true;
            }
            else {
                this.refresh = false;
            }
        }
        else {
            this.refresh = false;
        }
    }

    changeFileTxt(e: any) {
        if (e.target.files && e.target.files.length > 0) {
            this.data[this.txtField] = e.target.files[0].name;
            this.form.instance.getEditor(this.txtField).option('buttons[1].options.visible', true);
            let file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (r) => {
                this.fileBase64 = (r as any).target.result;
                //console.log(this.fileBase64);
            };
            reader.onerror = function (error) {
                //console.log('Error: ', error);
            };
        }
    }

    changeFileDoc(e: any) {
        if (e.target.files && e.target.files.length > 0) {
            this.data[this.docField] = e.target.files[0].name;
            this.data[this.docField.replace(/^FK/, '')] = -1;
            this.form.instance.getEditor(this.docField).option('buttons[2].options.visible', true);
            let file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (r) => {
                this.docBase64 = (r as any).target.result;
                //console.log(this.docBase64);
            };
            reader.onerror = function (error) {
                //console.log('Error: ', error);
            };
        }
    }

    itemClick(e) {
        this.button(e.itemData.sequence);
    }

    async downloadDocfile() {
        if (this.data[this.docField.replace(/^FK/, '')] === '0' || this.data[this.docField.replace(/^FK/, '')] === 0) {
            this.sharedService.info('No hay archivo asociado');
            return;
        }
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['mod_inic'] = this.mainForm.TableName.slice(0, 2);
        dataRest['blo_ante'] = this.data[this.docField.replace(/^FK/, '')];
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}DownloadBlobs`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //descargar archivo
                const dataURI = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + resultEvent.Result;
                FileSaver.saveAs(dataURI, this.data[this.docField]);
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al descargar archivo.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    //#endregion
}

enum SearchMethod {
    Equals = 1,
    StartWith,
    Contains,
    EndWith
}

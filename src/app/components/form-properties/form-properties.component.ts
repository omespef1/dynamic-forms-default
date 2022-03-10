import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { MainForm, ActionResult, EventProperty, Property } from '../../models';
import { DxDataGridComponent, DxDropDownBoxComponent, DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';
import { SharedService } from '../../services/shared.service';
import { MainFormService } from '../../services/main-form.service';
import { SessionService } from 'src/app/services/session.service';
import DataSource from 'devextreme/data/data_source';
import { IconsFontAwesome } from 'src/app/utils/const';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { MainFormTab } from '../../models/main-form-tab';
import { MicroappCategoryMenuModeEnums } from "src/app/enums/microapp-category-menu-mode.enum";
import { SecurityService } from '../../services/security.service';
import { RequestResult } from "src/app/models/request-result";
import { MainMenuService } from '../../services/main-menu.service';
import { MultiReport, ReportFilters, ReportParams, ReportTemptable } from 'src/app/models/report-config';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { MainModel } from 'src/app/models/main-model';
import { MicroapplicationsService } from '../../services/microapplications.service';
import { BaseDocConfg } from 'src/app/models/basedoc-config';
import { ExecProcess } from 'src/app/models/process-config';
import { AssignConsUbica } from 'src/app/models/ubica-config';
import { SpecialDetConfg } from 'src/app/models/specialdet-config';

@Component({
  selector: 'app-form-properties',
  templateUrl: './form-properties.component.html',
  styleUrls: ['./form-properties.component.scss']
})
export class FormPropertiesComponent implements OnInit {
  formId = uuid();
  formEventsId = uuid();
  formTemptableId = uuid();
  formExecProcessId = uuid();
  formUbicaId = uuid();
  formBaseDocId = uuid();
  formSpecialDetId = uuid();
  popUpId = uuid();
  gridId = uuid();
  gridVarsTransactionId = uuid();
  gridExceptDetId = uuid();
  gridTabsId = uuid();
  gridParamsId = uuid();
  gridFiltersId = uuid();
  gridFiltersFId = uuid();
  gridTemptableId = uuid();
  gridMultiReportId = uuid();
  gridExecProcessId = uuid();
  gridUbicaId = uuid();
  gridBaseDocId = uuid();
  gridSpecialDetId = uuid();
  popUpTabsId = uuid();
  popUpTransactionId = uuid();
  popUpExceptDetId = uuid();
  popUpParamsId = uuid();
  popUpProcessId = uuid();
  popUpUbicaId = uuid();
  BtnConfigTabsId = uuid();
  BtnConfigParamsId = uuid();
  BtnConfigProcessId = uuid();
  BtnConfigUbicaId = uuid();
  listItems: any[] = [
    { value: 1, text: 'Propiedades del Formulario' }
  ];
  @ViewChild('form') form: DxFormComponent;
  @ViewChild('tabsReport') tabsReport: NgbTabset;
  @ViewChild('tabsTransac') tabsTransac: NgbTabset;
  @ViewChild('formTemptable') formTemptable: DxFormComponent;
  @ViewChild('formExecProcess') formExecProcess: DxFormComponent;
  @ViewChild('formBasDoc') formBasDoc: DxFormComponent;
  @ViewChild('formSpeDet') formSpeDet: DxFormComponent;
  @ViewChild('formAssignConsUbica') formAssignConsUbica: DxFormComponent;
  @Input() mainForm: MainForm;
  listTabs: MainFormTab[] = [];
  listParams: ReportParams[] = [];
  listFilters: ReportFilters[] = [];
  listFiltersF: ReportFilters[] = [];
  listMultiReport: MultiReport[] = [];
  listMasterDetail: any[] = [];
  listMasterDetailBasedoc: any[] = [];
  listMasterDetailSpecialDet: any[] = [];
  listMasterDetailExcept: any[] = [];
  listVarsTransaction: any[] = [];
  listExceptDetail: any[] = [];
  listUbicaFields: any[] = [];
  listFields: any[] = [];
  listpFields: any[] = [];
  listOriginField: any[] = [];
  listSpecialDetColumn: any[] = [];
  listBaseDocField: any[] = [];
  temptableForm: ReportTemptable;
  execprocessForm: ExecProcess;
  assignConsUbicaForm: AssignConsUbica;
  baseDocForm: BaseDocConfg;
  specialDetForm: SpecialDetConfg;
  showFilters = false;
  showPopupMasterDetail = false;
  showPopupisTransaction = false;
  showPopupExceptDet = false;
  showPopUpTabs = false;
  showPopUpParams = false;
  showPopUpProcess = false;
  showPopUpUbica = false;
  useMasterDetail = false;
  isTransaction = 'N';
  masterDetailCount = '0 Detalles';
  @Input() loadControls = false;
  listOptionsVisible: any[] = [{ value: 'S', text: 'Si' }, { value: 'N', text: 'No' }];
  listOptions: any[] = [{ value: true, text: 'Si' }, { value: false, text: 'No' }];
  listOptionsTransaction: any[] = [{ value: 'S', text: 'Si' }, { value: 'N', text: 'No' }];
  listParamType: any[] = [{ value: 'N', text: 'Numerico' }, { value: 'C', text: 'Cadena' }, { value: 'F', text: 'Fecha' }];
  listFilterType: any[] = [{ value: 'N', text: 'Numerico' }, { value: 'C', text: 'Cadena' }, { value: 'F', text: 'Fecha' }];
  listOperatorType: any[] = [
    { value: '=', text: 'Igual' },
    { value: '<>', text: 'Diferente' },
    { value: '<', text: 'Menor' },
    { value: '<=', text: 'Menor o Igual' },
    { value: '>', text: 'Mayor' },
    { value: '>=', text: 'Mayor o Igual' },
    { value: 'IN', text: 'Entre' }
  ];
  listOperatorUnion: any[] = [
    { value: '&&', text: 'Y' },
    { value: '||', text: 'O' }
  ];
  listTableUbica: any[] = [{ value: 'AB_HIUBI', text: 'AB_HIUBI' }, { value: 'AB_THIUB', text: 'AB_THIUB' }];
  configuredOnBeforeSave: string;
  configuredOnSave: string;
  configuredOnBeforeDelete: string;
  configuredOnOpen: string;
  configuredOnButton: string;
  configuredOnReport: string;
  configuredOnApply: string;
  configuredOnRevert: string;
  configuredOnAnnul: string;
  showPopupEvents = false;
  eventName: string;
  event: string;
  selectedIndex = 0;
  menuType: MicroappCategoryMenuModeEnums = MicroappCategoryMenuModeEnums.standard;
  menuTreeListCategories: any[] = [];
  createChildren: any;
  metadataGrid: any;
  listColumsGrid: any[] = [];
  @Input() listFormEventData: EventProperty[] = [];
  @ViewChild(DxTreeViewComponent) treeView: DxTreeViewComponent;
  @ViewChild('dropDownTreeView', { static: false }) dropDownTreeView: DxDropDownBoxComponent;
  isSearchingMenu = true;
  mainDataSearch: MainModel[] = [];
  listSubMenu = [
    {
      MEN_CODI: 49,
      MEN_NOMB: 'Programas dinámicos'
    }
  ];
  @Input() set listItemsForm(items: Property[]) {
    this.listFields = items.filter((x) => x.visible);
    this.listOriginField = items.filter((x) => x.visible && x.dataType === 'char').map((y) => {
      return {
        value: y.dataField,
        text: y.label.text,
        options: y.editorOptions.dataSource
      };
    });
    this.listBaseDocField = items.filter((x) => !x.isForeignKey && x.visible && (x.dataType === 'numeric' || x.dataType === 'int' ||
      x.dataType === 'smallint')).map((y) => {
        return {
          value: y.dataField,
          text: y.label.text,
          id: items.indexOf(y)
        };
      });
    this.listBaseDocField.push({ value: "0", text: "N/A (No aplica)", id: -1 });
    this.listBaseDocField = this.listBaseDocField.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
  }
  showPopupAddSubMenu = false;

  toolbarItemsMasterDetailPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setMasterDetail();
        }
      }
    }
  ];

  toolbarItemsIsTransactionPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setIsTransaction();
          this.setDocBaseConfig();
          this.setSpecialDetConfig();
          this.setExceptDetail();
          this.showPopupisTransaction = false;
        }
      }
    }
  ];

  toolbarItemsExceptDetPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setExceptDetail();
          this.showPopupExceptDet = false;
        }
      }
    }
  ];  

  icons = new DataSource({
    store: {
      type: 'array',
      key: 'value',
      data: IconsFontAwesome.map(i => {
        return { value: i, name: i };
      })
    }
  });


  subMenu: any = {};
  @ViewChild('gridMasterDetail') gridMasterDetail: DxDataGridComponent;
  @ViewChild('gridVarsTransaction') gridVarsTransaction: DxDataGridComponent;
  @ViewChild('gridExceptDet') gridExceptDet: DxDataGridComponent;



  masterDetailButton = {
    icon: 'fas fa-plus',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.onFocusInMasterDetail();
    }
  };

  isTransactionButton = {
    icon: 'fas fa-plus',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.onFocusInTransaction();
    }
  };

  buttonSetBeforeSave = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onBeforeSave', 'Antes de guardar');
    }
  };

  buttonSetSave = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onSave', 'Guardar');
    }
  };

  buttonSetBeforeDelete = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onBeforeDelete', 'Antes de borrar');
    }
  };  

  buttonSetOpen = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onOpen', 'Abrir formulario');
    }
  };

  buttonSetButton = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onButton', 'Botón funcionalidad');
    }
  };

  buttonSetReport = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onReport', 'Generación reporte');
    }
  };

  buttonSetApply = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onApply', 'Aplicar');
    }
  };

  buttonSetRevert = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onRevert', 'Revertir');
    }
  };

  buttonSetAnnul = {
    icon: 'fas fa-cog',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Configurar Evento',
    onClick: () => {
      this.setDataPopupEvent('onAnnul', 'Anular');
    }
  };

  buttonRemoveBeforeSave = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onBeforeSave');
    }
  };

  buttonRemoveSave = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onSave');
    }
  };

  buttonRemoveBeforeDelete = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onBeforeDelete');
    }
  };  

  buttonRemoveOpen = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onOpen');
    }
  };

  buttonRemoveButton = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onButton');
    }
  };

  buttonRemoveReport = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onReport');
    }
  };

  buttonRemoveApply = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onApply');
    }
  };

  buttonRemoveRevert = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onRevert');
    }
  };

  buttonRemoveAnnul = {
    icon: 'fas fa-unlink',
    type: 'normal',
    stylingMode: 'text',
    disabled: false,
    hint: 'Remover Evento',
    onClick: () => {
      this.removeEvent('onAnnul');
    }
  };

  toolbarTabsButtonPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setTabs();
          this.showPopUpTabs = false;
        }
      }
    }
  ];

  toolbarReportButtonPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setParams();
          this.setFilters();
          this.setTemptable();
          this.setMultiReport();
          this.showPopUpParams = false;
        }
      }
    }
  ];

  toolbarProcessButtonPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setExecProcess();
          this.showPopUpProcess = false;
        }
      }
    }
  ];

  toolbarUbicaButtonPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setAssignConsUbica();
          this.showPopUpUbica = false;
        }
      }
    }
  ];

  itemsTempTableToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
          this.addTemptable();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Borrar', icon: 'far fa-trash-alt', onClick: () => {
          this.deleteTemptable();
        }
      }
    }
  ];

  itemsExecProcessToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
          this.addExecProcess();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Borrar', icon: 'far fa-trash-alt', onClick: () => {
          this.deleteExecProcess();
        }
      }
    }
  ];

  itemsUbicaToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
          this.addAssignConsUbica();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Borrar', icon: 'far fa-trash-alt', onClick: () => {
          this.deleteAssignConsUbica();
        }
      }
    }
  ];

  itemsBaseDocToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
          this.addBasedocConfig();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Borrar', icon: 'far fa-trash-alt', onClick: () => {
          this.deleteBasedocConfig();
        }
      }
    }
  ];

  itemsSpecialDetToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
          this.addSpecialDetConfig();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Borrar', icon: 'far fa-trash-alt', onClick: () => {
          this.deleteSpecialDetConfig();
        }
      }
    }
  ];

  itemsExceptDetToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Formularios excepción', icon: 'fas fa-exclamation-triangle', onClick: () => {
          this.showPopupExceptDet = true;
        }
      }
    }
  ];  


  constructor(
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private sessionService: SessionService,
    private stylingService: StylingService,
    private securityService: SecurityService,
    public mainMenuService: MainMenuService,
    private changeDetectorRef: ChangeDetectorRef,
    private microApplicationsService: MicroapplicationsService
  ) {
    this.mainForm = new MainForm();
    this.temptableForm = new ReportTemptable();
    this.execprocessForm = new ExecProcess();
    this.baseDocForm = new BaseDocConfg();
    this.specialDetForm = new SpecialDetConfg();
    this.assignConsUbicaForm = new AssignConsUbica();
    this.getFilteredOrigins = this.getFilteredOrigins.bind(this);
    this.getFilteredColumns = this.getFilteredColumns.bind(this);
  }

  ngOnInit() {
    this.getListTablesMasterDetail(this.mainForm.TableName);
    if (this.mainForm.MetadataMasterDetail) {
      this.masterDetailCount = `${JSON.parse(this.mainForm.MetadataMasterDetail).length} Detalles`;
    }
    this.useMasterDetail = this.mainForm.UseMasterDetail;
    setTimeout(() => {
      if (!this.form) {
        return;
      }
      this.useMasterDetail = this.mainForm.UseMasterDetail;
      this.form.instance.repaint();
      this.loadControls = false;
      this.selectedIndex = -1;
      this.listTabs = this.mainForm.Tabs ? JSON.parse(this.mainForm.Tabs) : [];
      this.listParams = this.mainForm.Params ? JSON.parse(this.mainForm.Params) : [];
      this.listFilters = this.mainForm.Filters ? JSON.parse(this.mainForm.Filters) : [];
      this.listFilters = this.listFilters.filter(x => x.Type === 'V' || x.Type === undefined);
      this.listFiltersF = this.mainForm.Filters ? JSON.parse(this.mainForm.Filters) : [];
      this.listFiltersF = this.listFiltersF.filter(x => x.Type === 'F');
      this.temptableForm = this.mainForm.Temptable ? JSON.parse(this.mainForm.Temptable) : new ReportTemptable();
      this.listMultiReport = this.mainForm.MultiReport ? JSON.parse(this.mainForm.MultiReport) : [];
      this.showFilters = this.mainForm.FuncEspec.split(';')[0] === 'REPORT' ? true : false;
      this.listVarsTransaction = this.mainForm.VarsTransaction ? JSON.parse(this.mainForm.VarsTransaction) : [];
      this.listExceptDetail = this.mainForm.ExceptDetail ? JSON.parse(this.mainForm.ExceptDetail) : [];
      this.baseDocForm = this.mainForm.BaseDocConfig ? JSON.parse(this.mainForm.BaseDocConfig) : new BaseDocConfg();
      this.specialDetForm = this.mainForm.SpecialDetConfig ? JSON.parse(this.mainForm.SpecialDetConfig) : new SpecialDetConfg();
      this.execprocessForm = this.mainForm.ExecProcess ? JSON.parse(this.mainForm.ExecProcess) : new ExecProcess();
      this.assignConsUbicaForm = this.mainForm.AssignConsUbica ? JSON.parse(this.mainForm.AssignConsUbica) : new AssignConsUbica();
      this.listMasterDetailExcept = this.mainForm.MetadataMasterDetail ? JSON.parse(this.mainForm.MetadataMasterDetail) : [];
      this.listMasterDetailBasedoc = this.mainForm.MetadataMasterDetail ? JSON.parse(this.mainForm.MetadataMasterDetail) : [];
      this.listMasterDetailBasedoc.push({ ProjectId: 0, ProjectName: "N/A (No aplica)", ProjectCode: "FRMD0000", MastersDetails: [], Order: 0 });
      this.listMasterDetailBasedoc = this.listMasterDetailBasedoc.sort((a, b) => {
        if (a.Order > b.Order) {
          return 1;
        }
        if (a.Order < b.Order) {
          return -1;
        }
        return 0;
      });
      this.listMasterDetailSpecialDet = this.mainForm.MetadataMasterDetail ? JSON.parse(this.mainForm.MetadataMasterDetail) : [];
      this.listMasterDetailSpecialDet.push({ ProjectId: 0, ProjectName: "N/A (No aplica)", ProjectCode: "FRMD0000", MastersDetails: [], Order: 0 });
      this.listMasterDetailSpecialDet = this.listMasterDetailSpecialDet.sort((a, b) => {
        if (a.Order > b.Order) {
          return 1;
        }
        if (a.Order < b.Order) {
          return -1;
        }
        return 0;
      });
      if (this.mainForm.FuncEspec === 'UBICA') {
        this.getListColumns(this.mainForm.TableName);
      }
      if (this.mainForm.FuncEspec === 'MPROCESS') {
        this.getListpColumns(`${this.mainForm.TableName.slice(0, 2)}_PPROC`);
      }
      this.setIsConfiguredEventForm();
      this.initMainObserver();
      this.getMainInformation();
      //this.getGridInformation(this.specialDetForm.projectDetailId);

    }, 1300);
    this.createChildren = (parent) => {
      const parentId = parent ? parent.itemData.id : 0;
      return this.mainMenuService.loadMenu(parentId).toPromise();
    };
  }

  onFocusInMasterDetail() {
    this.showPopupMasterDetail = true;
    setTimeout(() => {
      if (this.mainForm.MetadataMasterDetail) {
        const indexes = [];
        for (const item of JSON.parse(this.mainForm.MetadataMasterDetail)) {
          const project = this.listMasterDetail.filter((x) => x.ProjectId === item.ProjectId && x.MasterDetails[0].MasterDetailKeyName === item.MasterDetails[0].MasterDetailKeyName)[0];
          project.Order = item.Order;
          indexes.push(this.listMasterDetail.indexOf(project));
        }
        this.gridMasterDetail.instance.selectRowsByIndexes(indexes);
      }
    }, 200);
  }

  onFocusInTransaction() {
    //Verificar si ya se encuentran las variables o sino incluirlas
    this.listVarsTransaction.filter(x => x.Name === 'P_Consec')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_Consec', Description: 'Campo consecutivo de la transacción', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_Numero')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_Numero', Description: 'Campo número de la transacción', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_Fecha')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_Fecha', Description: 'Campo fecha de la transacción', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_Cdist')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_Cdist', Description: 'Campo tipo de distribución', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_ModInic')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_ModInic', Description: 'Módulo de transacción', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_CEsta')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CEsta', Description: 'Campo estado de la transacción', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEsta')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEsta', Description: 'Valor estado Inconsistente', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEstaEd')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEstaEd', Description: 'Valor estado donde la transacción se puede editar', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAp')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEstaAp', Description: 'Valor estado donde la transacción se puede aplicar', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEstaAn')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEstaAn', Description: 'Valor estado donde la transacción se puede anular', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEstaRe')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEstaRe', Description: 'Valor estado donde la transacción se puede revertir', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_CMcont')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CMcont', Description: 'Campo consecutivo movimiento contable', Value: '' });
    this.listVarsTransaction.filter(x => x.Name === 'P_CToper')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CToper', Description: 'Campo tipo de operación', Value: 'TOP_CODI' });
    this.listVarsTransaction.filter(x => x.Name === 'P_AsigEd')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_AsigEd', Description: 'Asigna número en edicion', Value: 'N' });
    this.listVarsTransaction.filter(x => x.Name === 'P_CAnop')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CAnop', Description: 'Campo año de la transacción', Value: `${this.mainForm.TableName.slice(3, 6)}_ANOP` });
    this.listVarsTransaction.filter(x => x.Name === 'P_CMesp')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CMesp', Description: 'Campo mes de la transacción', Value: `${this.mainForm.TableName.slice(3, 6)}_MESP` });
    this.listVarsTransaction.filter(x => x.Name === 'P_CDiap')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CDiap', Description: 'Campo dia de la transacción', Value: `${this.mainForm.TableName.slice(3, 6)}_DIAP` });
    this.listVarsTransaction.filter(x => x.Name === 'P_CNech')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_CNech', Description: 'Campo fecha númerica de la transacción', Value: `${this.mainForm.TableName.slice(3, 6)}_NECH` });
    this.listVarsTransaction.filter(x => x.Name === 'P_Auth')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_Auth', Description: 'Encabezado autorización metodos', Value: 'N' });
    this.listVarsTransaction.filter(x => x.Name === 'P_VEstn')[0] !== undefined ? 'existe' : this.listVarsTransaction.push({ Name: 'P_VEstn', Description: 'Valor estado Anulado', Value: 'N' });
    this.showPopupisTransaction = true;
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.4);
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.6);
  }

  gridVarsHeight = () => {
    return Math.round(window.innerHeight / 2.45);
  }

  setMasterDetail() {
    if (this.gridMasterDetail.instance.getSelectedRowsData().length > 0) {
      this.mainForm.MetadataMasterDetail = JSON.stringify(this.gridMasterDetail.instance.getSelectedRowsData());
      this.masterDetailCount = `${this.gridMasterDetail.instance.getSelectedRowsData().length} Detalles`;
    } else {
      this.mainForm.UseMasterDetail = false;
    }
    this.showPopupMasterDetail = false;
  }

  setIsTransaction() {
    this.mainForm.VarsTransaction = JSON.stringify(this.listVarsTransaction);
  }

  setDocBaseConfig() {
    this.mainForm.BaseDocConfig = JSON.stringify(this.baseDocForm);
  }

  setSpecialDetConfig() {
    this.mainForm.SpecialDetConfig = JSON.stringify(this.specialDetForm);
  }

  setExceptDetail(){
    this.mainForm.ExceptDetail = JSON.stringify(this.listExceptDetail);
  }

  setTabs() {
    this.mainForm.Tabs = JSON.stringify(this.listTabs);
  }

  setParams() {
    this.mainForm.Params = JSON.stringify(this.listParams);
  }

  setFilters() {
    this.mainForm.Filters = JSON.stringify(this.listFilters.concat(this.listFiltersF));
  }

  setTemptable() {
    this.mainForm.Temptable = JSON.stringify(this.temptableForm);
  }

  setMultiReport() {
    this.mainForm.MultiReport = JSON.stringify(this.listMultiReport);
  }

  setExecProcess() {
    this.mainForm.ExecProcess = JSON.stringify(this.execprocessForm);
  }

  setAssignConsUbica() {
    this.mainForm.AssignConsUbica = JSON.stringify(this.assignConsUbicaForm);
  }

  addTemptable() {
    if (!this.formTemptable.instance.validate().isValid) {
      return;
    }
    if (this.temptableForm.fields.length === 0) {
      this.sharedService.error('Faltan campos a enviar');
      return;
    }
    this.sharedService.info('Información ingresada correctamente');
  }

  addExecProcess() {
    if (!this.formExecProcess.instance.validate().isValid) {
      return;
    }
    if (this.execprocessForm.fields.length === 0) {
      this.sharedService.error('Faltan campos a enviar');
      return;
    }
    this.sharedService.info('Información ingresada correctamente');
  }

  addAssignConsUbica() {
    if (!this.formAssignConsUbica.instance.validate().isValid) {
      return;
    }
    if (this.assignConsUbicaForm.fields.length === 0) {
      this.sharedService.error('Faltan campos a enviar');
      return;
    }
    this.sharedService.info('Información ingresada correctamente');
  }

  deleteTemptable() {
    this.temptableForm = new ReportTemptable();
  }

  deleteExecProcess() {
    this.execprocessForm = new ExecProcess();
  }

  deleteAssignConsUbica() {
    this.assignConsUbicaForm = new AssignConsUbica();
  }

  addBasedocConfig() {
    if (!this.formBasDoc.instance.validate().isValid) {
      return;
    }
    if (this.baseDocForm.origins.length === 0) {
      this.sharedService.error('Faltan relación valores a metodos');
      return;
    }
    this.sharedService.info('Información ingresada correctamente');
  }

  deleteBasedocConfig() {
    this.baseDocForm = new BaseDocConfg();
  }

  addSpecialDetConfig() {
    if (!this.formSpeDet.instance.validate().isValid) {
      return;
    }
    // if (this.specialDetForm.columns.length === 0) {
    //   this.sharedService.error('Faltan incluir columnas');
    //   return;
    // }
    this.sharedService.info('Información ingresada correctamente');
  }

  deleteSpecialDetConfig() {
    this.specialDetForm = new SpecialDetConfg();
  }

  cleargridBaseDoc = (e) => {
    this.baseDocForm.origins = [];
  }

  cleargridSpecialDet = (e) => {
    this.specialDetForm.columns = [];
  }

  specialDetFormChanged(e) {
    if (e.dataField === 'projectDetailId') {
      //this.getGridInformation(e.value);
    }
  }

  getFilteredOrigins() {
    const item = this.baseDocForm.field ? this.listOriginField.filter(x => x.value === this.baseDocForm.field)[0] : null;
    if (item) {
      return this.listOriginField[this.listOriginField.indexOf(item)].options;
    }
    else {
      return [];
    }
  }

  getFilteredColumns() {
    if (this.specialDetForm.projectDetailId > 0) {
      return this.listColumsGrid;
    }
    else {
      return [];
    }
  }

  onValueChangedMasterDetail = (e) => {
    if (this.loadControls) {
      return;
    }
    this.useMasterDetail = e.value;
    if (e.value === false) {
      this.mainForm.MetadataMasterDetail = null;
      this.masterDetailCount = '0 Detalles';
    }
  }

  onValueChangedisTransaction = (e) => {
    if (this.loadControls) {
      return;
    }
    this.isTransaction = e.value;
    if (e.value === 'N') {
      this.mainForm.Transaccion = 'N';
    }
  }

  getListTablesMasterDetail(tableName: string) {
    this.mainFormService.listTablesMasterDetail(this.mainForm.ConnectionId, tableName).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listMasterDetail = response.Result;
        if (this.mainForm.MetadataMasterDetail) {
          this.sharedService.setListMasterDetails(this.listMasterDetail);
        }
      } else if (response.IsError) {
        this.listMasterDetail = [];
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.listMasterDetail = [];
        this.sharedService.error(response.Messages);
      }
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
    });
  }

  getListColumns(tableName: string) {
    this.mainFormService.listColumns(this.mainForm.ConnectionId, tableName).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listUbicaFields = response.Result;
        this.listUbicaFields = this.listUbicaFields.map((y) => {
          return {
            value: y.Name,
            text: y.Name
          };
        });
        this.listUbicaFields = this.listUbicaFields.filter(x => x.value !== 'EMP_CODI' && x.value !== 'AUD_ESTA' && x.value !== 'AUD_USUA' && x.value !== 'AUD_UFAC');
      } else if (response.IsError) {
        this.listUbicaFields = [];
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.listUbicaFields = [];
        this.sharedService.error(response.Messages);
      }
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
    });
  }

  getListpColumns(tableName: string) {
    this.mainFormService.listColumns(this.mainForm.ConnectionId, tableName).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {
        this.listpFields = response.Result;
        this.listpFields = this.listpFields.map((y) => {
          return {
            value: y.Name,
            text: y.Name
          };
        });
        this.listpFields = this.listpFields.filter(x => x.value !== 'EMP_CODI' && x.value !== 'AUD_ESTA' && x.value !== 'AUD_USUA' && x.value !== 'AUD_UFAC');
      } else if (response.IsError) {
        this.listpFields = [];
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.listpFields = [];
        this.sharedService.error(response.Messages);
      }
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
    });
  }

  setDataPopupEvent(event: string, eventName: string) {
    this.event = event;
    this.eventName = eventName;
    this.showPopupEvents = true;
  }

  getEventConfig(e: EventProperty) {
    if (this.listFormEventData) {
      if (this.listFormEventData.filter((x) => x.eventName === e.eventName).length > 0) {
        this.listFormEventData.splice(this.listFormEventData.indexOf(this.listFormEventData.filter((x) => x.eventName === e.eventName)[0]), 1);
      }
    }
    this.listFormEventData.push(e);
    this.setIsConfiguredEventForm();
    this.showPopupEvents = false;
  }

  setIsConfiguredEventForm() {
    if (!this.listFormEventData) {
      return;
    }
    for (const iterator of this.listFormEventData) {
      switch (iterator.eventName) {
        case 'onBeforeSave':
          this.configuredOnBeforeSave = 'Configurado';
          break;
        case 'onSave':
          this.configuredOnSave = 'Configurado';
          break;
        case 'onBeforeDelete':
          this.configuredOnBeforeDelete = 'Configurado';
          break;
        case 'onOpen':
          this.configuredOnOpen = 'Configurado';
          break;
        case 'onButton':
          this.configuredOnButton = 'Configurado';
          break;
        case 'onReport':
          this.configuredOnReport = 'Configurado';
          break;
        case 'onApply':
          this.configuredOnApply = 'Configurado';
          break;
        case 'onRevert':
          this.configuredOnRevert = 'Configurado';
          break;
        case 'onAnnul':
          this.configuredOnAnnul = 'Configurado';
          break;
      }
    }
  }

  removeEvent(eventName: string) {
    const event = this.listFormEventData.filter((x) => x.eventName === eventName)[0];
    this.listFormEventData.splice(this.listFormEventData.indexOf(event), 1);
    switch (eventName) {
      case 'onBeforeSave':
        this.configuredOnBeforeSave = null;
        break;
      case 'onSave':
        this.configuredOnSave = null;
        break;
      case 'onBeforeDelete':
        this.configuredOnBeforeDelete = null;
        break;
      case 'onOpen':
        this.configuredOnOpen = null;
        break;
      case 'onButton':
        this.configuredOnButton = null;
        break;
      case 'onReport':
        this.configuredOnReport = null;
        break;
      case 'onApply':
        this.configuredOnApply = null;
        break;
      case 'onRevert':
        this.configuredOnRevert = null;
        break;
      case 'onAnnul':
        this.configuredOnAnnul = null;
        break;
    }
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const gridEl = document.getElementById(this.gridId);
      const gridVarsTransactionEl = document.getElementById(this.gridVarsTransactionId);
      const gridExceptDetEl = document.getElementById(this.gridExceptDetId);
      const formEl = document.getElementById(this.formId);
      const formEventsEl = document.getElementById(this.formEventsId);
      const formTemptableEl = document.getElementById(this.formTemptableId);
      const formExecProcessEl = document.getElementById(this.formExecProcessId);
      const formUbicaEl = document.getElementById(this.formUbicaId);
      const formBaseDocIdEl = document.getElementById(this.formBaseDocId);
      const formSpecialDetIdEl = document.getElementById(this.formSpecialDetId);
      const popUpEl = document.getElementById(this.popUpId);
      const popUpTabsEl = document.getElementById(this.popUpTabsId);
      const popUpTransactionEl = document.getElementById(this.popUpTransactionId);
      const popUpExceptDetEl = document.getElementById(this.popUpExceptDetId);
      const popUpParamsEl = document.getElementById(this.popUpParamsId);
      const popUpProcessEl = document.getElementById(this.popUpProcessId);
      const popUpUbicaEl = document.getElementById(this.popUpUbicaId);
      const BtnConfigTabsEl = document.getElementById(this.BtnConfigTabsId);
      const BtnConfigParamsEl = document.getElementById(this.BtnConfigParamsId);
      const BtnConfigProcessEl = document.getElementById(this.BtnConfigProcessId);
      const BtnConfigUbicaEl = document.getElementById(this.BtnConfigUbicaId);
      const gridParamsEl = document.getElementById(this.gridParamsId);
      const gridFiltersEl = document.getElementById(this.gridFiltersId);
      const gridFiltersFEl = document.getElementById(this.gridFiltersFId);
      const gridTemptableEl = document.getElementById(this.gridTemptableId);
      const gridMultiReportEl = document.getElementById(this.gridMultiReportId);
      const gridExecProcessEl = document.getElementById(this.gridExecProcessId);
      const gridUbicaEl = document.getElementById(this.gridUbicaId);
      const gridBaseDocEl = document.getElementById(this.gridBaseDocId);
      const gridSpecialDetEl = document.getElementById(this.gridSpecialDetId);
      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formEventsEl) {
        this.stylingService.setLabelColorStyle(formEventsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEventsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formTemptableEl) {
        this.stylingService.setLabelColorStyle(formTemptableEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formTemptableEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formExecProcessEl) {
        this.stylingService.setLabelColorStyle(formExecProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formExecProcessEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formUbicaEl) {
        this.stylingService.setLabelColorStyle(formUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formBaseDocIdEl) {
        this.stylingService.setLabelColorStyle(formBaseDocIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formBaseDocIdEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formSpecialDetIdEl) {
        this.stylingService.setLabelColorStyle(formSpecialDetIdEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formSpecialDetIdEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridVarsTransactionEl) {
        this.stylingService.setGridHeaderColorStyle(gridVarsTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridVarsTransactionEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridExceptDetEl) {
        this.stylingService.setGridHeaderColorStyle(gridExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridExceptDetEl, this.sessionService.session.selectedCompany.theme);
      }      
      if (popUpEl) {
        this.stylingService.setTitleColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
      }
      // Styling del popUp de pestañas
      if (popUpTabsEl) {
        this.stylingService.setTitleColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpTabsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpTransactionEl) {
        this.stylingService.setTitleColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpTransactionEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpExceptDetEl) {
        this.stylingService.setTitleColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpExceptDetEl, this.sessionService.session.selectedCompany.theme);
      }      
      if (popUpParamsEl) {
        this.stylingService.setTitleColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpParamsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpProcessEl) {
        this.stylingService.setTitleColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpProcessEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpUbicaEl) {
        this.stylingService.setTitleColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (BtnConfigTabsEl) {
        this.stylingService.setTitleColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(BtnConfigTabsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (BtnConfigParamsEl) {
        this.stylingService.setTitleColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(BtnConfigParamsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (BtnConfigProcessEl) {
        this.stylingService.setTitleColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(BtnConfigProcessEl, this.sessionService.session.selectedCompany.theme);
      }
      if (BtnConfigUbicaEl) {
        this.stylingService.setTitleColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(BtnConfigUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridParamsEl) {
        this.stylingService.setGridHeaderColorStyle(gridParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridParamsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridFiltersEl) {
        this.stylingService.setGridHeaderColorStyle(gridFiltersEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridFiltersEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridFiltersFEl) {
        this.stylingService.setGridHeaderColorStyle(gridFiltersFEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridFiltersFEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridTemptableEl) {
        this.stylingService.setGridHeaderColorStyle(gridTemptableEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridTemptableEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMultiReportEl) {
        this.stylingService.setGridHeaderColorStyle(gridMultiReportEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMultiReportEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridExecProcessEl) {
        this.stylingService.setGridHeaderColorStyle(gridExecProcessEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridExecProcessEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridUbicaEl) {
        this.stylingService.setGridHeaderColorStyle(gridUbicaEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridUbicaEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridBaseDocEl) {
        this.stylingService.setGridHeaderColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridBaseDocEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridSpecialDetEl) {
        this.stylingService.setGridHeaderColorStyle(gridSpecialDetEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridSpecialDetEl, this.sessionService.session.selectedCompany.theme);
      }
    }, 1);
  }

  onInitNewRow(e) {
    e.data.Range = 0;
    e.data.Id = this.listFilters.length + 1;
    e.data.Type = 'V';
  }

  onInitNewRowF(e) {
    e.data.Range = 0;
    e.data.Id = this.listFiltersF.length + 1;
    e.data.Type = 'F';
  }

  onInitNewRowM(e) {
    e.data.id = this.listMultiReport.length + 1;
  }

  openPopUpTabs() {
    this.showPopUpTabs = true;
  }

  openPopUpParams() {
    this.showPopUpParams = true;
  }

  openPopUpProcess() {
    this.showPopUpProcess = true;
  }

  openPopUpUbica() {
    this.showPopUpUbica = true;
  }

  // getMenuVisualization() {
  //   this.securityService.getParameterValueByCode('MicroappCategoryMenuMode').subscribe((response: RequestResult<any>) => {
  //     let responseResolve = this.sharedService.resolveRequestResult(response);
  //     if (responseResolve.error) {
  //       this.sharedService.error(responseResolve.error);
  //       this.sharedService.showLoader(false);
  //       return false;
  //     }
  //     // se asigna el resultado
  //     this.menuType = responseResolve.result;
  //     if (this.menuType === MicroappCategoryMenuModeEnums.treeList) {
  //       this.securityService.getParameterValueByCode('MicroappTreelistCategories').subscribe((responseTreelist: RequestResult<any>) => {
  //         responseResolve = this.sharedService.resolveRequestResult(responseTreelist);
  //         if (responseResolve.error) {
  //           this.sharedService.error(responseResolve.error);
  //           this.sharedService.showLoader(false);
  //           return false;
  //         }
  //         this.menuTreeListCategories = responseResolve.result;
  //       });
  //     }
  //   });
  // }
  onCategoryTreeViewSelectionChanged = (e: any) => {
    this.mainForm.TreeListCategory = e.itemData.id;
  }

  closeNodes() {
    this.treeView.instance.collapseAll();
  }

  onKeyUpMainSearch(event, e) {
    if (e.code === "Enter") {
      if (event != null && event.length > 0) {
        this.getMainBySearchBar(event);

      }
    }
    if (event != null && event.length === 0) {
      this.isSearchingMenu = true;
    }
  }

  getMainBySearchBar(data: string) {
    this.mainMenuService.loadMenuFilter(data).toPromise().then((data) => {
      this.isSearchingMenu = false;
      let e = { code: 'Enter' };
      this.changeDetectorRef.detectChanges();
      this.onKeyUpMainSearch(null, e);
    })
  }

  setMenuBySearch(e) {
    if (!e.hasItems) {

      this.mainForm.ApplicationMenu = e;
      this.dropDownTreeView.instance.close();
    }

  }

  onMenuApplicationSelectionChanged = (e: any) => {

    if (e.itemData.hasItems) {
      if (e.itemData.expanded) {
        this.treeView.instance.collapseItem(e.itemData);
      }
      else
        this.treeView.instance.expandItem(e.itemData);
    }
    else {
      this.mainForm.ApplicationMenu = e.itemData;
      this.dropDownTreeView.instance.close();
    }


  };

  initMainObserver() {
    this.mainMenuService.main.asObservable().subscribe((resp) => {
      this.mainDataSearch = resp;
    });
  }

  getMainInformation() {
    this.microApplicationsService.getMicroApplicationByFormCode(this.mainForm.ProgramCode).subscribe(resp => {
      if (resp != null) {
        this.mainForm.MicroApplicationId = resp.id;
        this.mainMenuService.getMainMenu(this.mainForm.MicroApplicationId).subscribe(resp => {
          if (resp == null) {
            this.mainForm.ApplicationMenu = new MainModel();
          }
          else
            this.mainForm.ApplicationMenu = resp;
        })
      }
    })
  }

  getGridInformation(pId: number) {
    if (pId > 0) {
      this.sharedService.showLoader(true);
      this.mainFormService.getMainFormById(pId.toString()).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.metadataGrid = JSON.parse(response.Result.MetadataGrid);
          this.listColumsGrid = this.metadataGrid.columns;
          this.listColumsGrid = this.listColumsGrid.filter(x => x.visible).map((y) => {
            return {
              field: y.name,
              text: y.dataField
            };
          });
          this.sharedService.showLoader(false);
        }
        else {
          this.sharedService.error(response.ErrorMessage);
        }
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    }
  }

}

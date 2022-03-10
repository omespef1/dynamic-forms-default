import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainForm, Connection, Table, Column, Property, KeyData, DataSource, EventProperty, EventAction, RestForm, ActionResult, OtherField } from '../../models';
import { SharedService } from '../../services/shared.service';
import { MainFormService } from '../../services/main-form.service';
import { DxFormComponent, DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import { CommonFunctions } from '../../utils/common-functions';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { FormPropertiesComponent } from '../form-properties/form-properties.component';
import { SecurityService } from 'src/app/services/security.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfigService } from 'src/app/services/config.service';
import { SAVE_ACTION, EDIT_ACTION, NEW_ICON, SAVE_ICON, BACK_ICON } from 'src/app/utils/const';
import { ResourceType } from 'src/app/models/permission';
import { Menu, MenuGroupItem, MenuGroup } from 'src/app/models/menu';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { MainFormTab } from '../../models/main-form-tab';
import { EventActionType } from '../../enums/event-action-type.enum';
import { TabForm, TabItem } from '../../models/tab-form';
import { SecuritySevenService } from '../../services/security-seven.service';
import { ReportParams } from 'src/app/models/report-config';
import { MainMenuService } from '../../services/main-menu.service';

@Component({
  selector: 'app-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent implements OnInit {
  //#region Fields
  formId = uuid();
  formConnectionsId = uuid();
  gridId = uuid();
  gridPreviewId = uuid();
  gridConnectionsId = uuid();
  popUpConnectionsId = uuid();
  @ViewChild('formConnection') formConnection: DxFormComponent;
  @ViewChild('formDesigner') formDesigner: DxFormComponent;
  @ViewChild('gridPreview') grid: DxDataGridComponent;
  @ViewChild('gridMasterDetail') gridMasterDetail: DxDataGridComponent;
  @ViewChild('tabsConnection') tabsConnection: NgbTabset;
  @ViewChild('countDetail') countDetail: DxTextBoxComponent;
  @ViewChild(FormPropertiesComponent)
  formPropertiesComponent: FormPropertiesComponent;
  mainForm: MainForm;
  connection: Connection;
  showPopup = false;
  showDesigner = false;
  newConection = false;
  useMasterDetail = false;
  loadControls = false;
  masterDetailCount = '0 Detalles';
  listConections: Connection[] = [];
  listProviders = [
    { id: 1, label: 'Microsoft SQL Server' },
    { id: 2, label: 'Oracle' }
  ];
  listConectionsOracle = [
    { id: 'SERVICE_NAME', label: 'Servicio' },
    { id: 'SID', label: 'Sid' }
  ];
  listItems = [
    { id: 1, title: 'Seleccionar Conexión' },
    { id: 2, title: 'Propiedades de la Conexión' }
  ];
  listOptions: any[] = [
    { value: true, text: 'Si' },
    { value: false, text: 'No' }
  ];
  editMode = false;
  editModeConnection = false;
  listTables: Table[] = [];
  listItemsForm: Property[] = [];
  listItemsDataSource: DataSource[] = [];
  listMasterDetail: any[] = [];
  listPrimaryKeys: KeyData[] = [];
  itemsToolbarConnection: any;
  tabChangeWithMethod = false;
  listTabs: MainFormTab[] = [];
  listParams: ReportParams [] = [];
  selectIndex = 0;
  visualizeForm = false;
  showProperties = false;
  loadingVisible = false;
  showPopupMasterDetail = false;
  toolBarButtons = { save: false, edit: false, redirect: true };
  itemsToolbar = [
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        hint: 'Aplicar',
        icon: 'fas fa-check',
        onClick: () => {
          this.selectConnection();
        }
      }
    }
  ];
  metadataGrid: any;
  listOptionsVisible: any[] = [
    { value: 'S', text: 'Si' },
    { value: 'N', text: 'No' }
  ];
  listIcons: any[] = [];
  listEventData: EventProperty[] = [];
  listFormEventData: EventProperty[] = [];
  showPopupEvents = false;
  eventName: string;
  event: string;
  toolbarItemsConnectionPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.selectConnection();
        }
      }
    }
  ];
  listPermisions = [];
  listActions: Menu[];
  RestActions: EventAction[] = [];
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

  //#endregion

  //#region Builder
  constructor(
    public router: Router,
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private commonFunctions: CommonFunctions,
    private activatedRoute: ActivatedRoute,
    private securityService: SecuritySevenService,
    private sessionService: SessionService,
    private configService: ConfigService,
    private stylingService: StylingService,
    private mainMenuService:MainMenuService
  ) {    
    this.mainForm = new MainForm();
    this.connection = new Connection();
  }
  //#endregion

  //#region Events
  async ngOnInit() {

    const resultPermisions = await this.securityService.getPermisions(this.configService.config.designerMicroAppCode).toPromise();
    if (resultPermisions.isSuccessful) {
      this.listPermisions = resultPermisions.result.actions;
    }


    this.activatedRoute.queryParams.subscribe(params => {
      const id = params.pId;
      if (!id) {
        this.showPopup = true;
        this.getListConnections();
        this.itemsToolbarConnection = [
          {
            location: 'after',
            widget: 'dxButton',
            options: {
              hint: 'Cambiar Conexión',
              icon: 'fas fa-edit',
              onClick: () => {
                this.showPopup = true;
              }
            }
          }
        ];
      } else {
        this.setFormInEditMode(id);
      }
    });
  }


  onToolbarPreparing(e) {
    e.toolbarOptions.items.splice(0, 0, {
      name: 'add',
      locateInMenu: 'auto',
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        hint: 'Agregar Conexión',
        onClick: () => {
          this.newConection = true;
          this.editModeConnection = false;
          this.connection = new Connection();
          this.tabsConnection.select('formConnection');
          setTimeout(() => {
            this.formConnection.instance.getEditor('ProviderType').focus();
          }, 600);
        }
      }
    });
  }

  onValueChangedProvider = (e: any) => {
    if (e.value) {
      this.connection.ProviderName =
        e.value === 1 ? 'System.Data.SqlClient' : 'System.Data.OracleClient';
    }
  }

  onRowClickConnections(e) {
    if (this.editModeConnection) {
      return;
    }
    this.mainForm.ConnectionId = e.data.Id;
    this.mainForm.Connection = e.data;
  }

  onHiddenConnections(e: any) {
    if (!this.mainForm.ConnectionId) {
      return;
    }
    this.sharedService.showLoader(true);
    this.mainFormService.listTables(this.mainForm.ConnectionId).subscribe(
      (response: ActionResult) => {
        if (response.IsSucessfull) {
          this.listTables = response.Result;
        } else if (response.IsError) {
          this.listTables = [];
          this.sharedService.error(response.ErrorMessage);
        } else {
          this.listTables = [];
          this.sharedService.error(response.Messages);
        }
        this.sharedService.showLoader(false);
      },
      () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.listTables = [];
        this.sharedService.showLoader(false);
      }
    );
  }

  onItemTitleClick(e: any) {
    this.editModeConnection = false;
    if (e.itemData.id === 1) {
      this.newConection = false;
    } else {
      this.newConection = true;
      this.connection = new Connection();
      setTimeout(() => {
        this.formConnection.instance.getEditor('ProviderType').focus();
      }, 600);
    }
  }

  onTabChangeConnection(e) {
    if (this.tabChangeWithMethod) {
      this.tabChangeWithMethod = false;
      return;
    }
    this.editModeConnection = false;
    if (e.nextId === 'listConnection') {
      this.newConection = false;
    } else {
      this.newConection = true;
      this.connection = new Connection();
      setTimeout(() => {
        this.formConnection.instance.getEditor('ProviderType').focus();
      }, 600);
    }
  }

  async onInitialized(e) {
    const itemChangeLabelColor = [];
    e.component.option('items', []);
    let arrItemsWithTabs: any[] = [];
    for await (const item of this.listItemsForm) {
      if (item.cssClass) {
        itemChangeLabelColor.push(item.cssClass);
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
      this.prepareDateBoxItem(item);
      this.prepareNumberBoxItem(item);
      this.prepareDefaultValue(item);
      if (item.editorType === 'dxCheckBox') {
        delete item.validationRules;
      }
      arrItemsWithTabs.push({ ...item });
      e.component.option('items').push({ ...item });
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

    e.component.repaint();
    e.component.endUpdate();

    setTimeout(() => {
      // se establece el color del label
      for (const item of itemChangeLabelColor) {
        const itemsByClass = document.getElementsByClassName(item);
        for (let i = 0; i < itemsByClass.length; i++) {
          const element = itemsByClass[i];
          const itemLabel: any = element.children[0].children[0].children[0];
          itemLabel.style.color = item.replace('DG_', '');
        }
      }
    }, 100);
  }

  onContentReadyGridPreview(e) {
    // this.sharedService.getGridStyle();
  }

  onValueChangedMasterDetail = (e: any) => {
    if (this.loadControls) {
      return;
    }
    this.useMasterDetail = e.value;
    if (e.value === false) {
      this.mainForm.MetadataMasterDetail = null;
      this.masterDetailCount = '0 Detalles';
    }
  }

  onFocusInMasterDeatil() {
    this.showPopupMasterDetail = true;
    setTimeout(() => {
      if (this.mainForm.MetadataMasterDetail) {
        const indexes = [];
        for (const item of JSON.parse(this.mainForm.MetadataMasterDetail)) {
          const project = this.listMasterDetail.filter(
            x => x.ProjectId === item.ProjectId
          )[0];
          indexes.push(this.listMasterDetail.indexOf(project));
        }
        this.gridMasterDetail.instance.selectRowsByIndexes(indexes);
      }
    }, 200);
  }

  onRowDblClickConnections(e: any) {
    this.selectConnection();
  }

  onRowDblClickTables(e: any) {
    this.previsualizationForm(e);
  }

  //#endregion

  //#region Methods
  itemClickToolbar(item: MenuGroupItem) {
    if (!item) {
      return;
    }
    switch (item.name) {
      case 'save':
        if (!this.editMode) {
          this.save();

        } else {
          this.edit();
        }
        break;
      case 'back':
        this.redirect();
        break;
    }
  }

  setListActionsFormMain() {
    this.listActions = [];
    const menu = new Menu();
    menu.id = 1;
    menu.name = 'start';
    menu.text = 'Inicio';

    const menuGroup = new MenuGroup();
    menuGroup.id = 10;
    menuGroup.name = 'main';
    menuGroup.text = 'Principal';

    const menuGroupItemSave = new MenuGroupItem();
    menuGroupItemSave.id = 102;
    menuGroupItemSave.name = 'save';
    menuGroupItemSave.text = 'Guardar';
    menuGroupItemSave.tooltip = 'Guardar';
    menuGroupItemSave.icon = SAVE_ICON;
    menuGroup.items.push(menuGroupItemSave);

    const menuGroupItemBack = new MenuGroupItem();
    menuGroupItemBack.id = 102;
    menuGroupItemBack.name = 'back';
    menuGroupItemBack.text = 'Regresar';
    menuGroupItemBack.tooltip = 'Regresar';
    menuGroupItemBack.icon = BACK_ICON;
    menuGroup.items.push(menuGroupItemBack);
    menu.groups.push(menuGroup);
    this.listActions.push(menu);
  }

  setListActionsFormRedirect() {
    this.listActions = [];
    const menu = new Menu();
    menu.id = 1;
    menu.name = 'start';
    menu.text = 'Inicio';

    const menuGroup = new MenuGroup();
    menuGroup.id = 10;
    menuGroup.name = 'main';
    menuGroup.text = 'Principal';

    const menuGroupItemBack = new MenuGroupItem();
    menuGroupItemBack.id = 102;
    menuGroupItemBack.name = 'back';
    menuGroupItemBack.text = 'Regresar';
    menuGroupItemBack.tooltip = 'Regresar';
    menuGroupItemBack.icon = BACK_ICON;
    menuGroup.items.push(menuGroupItemBack);
    menu.groups.push(menuGroup);
    this.listActions.push(menu);
  }

  conectionHeight = () => {
    return window.innerHeight / 1.4;
  }

  setFormInEditMode(id: string) {
    this.setListActionsFormMain();
    this.loadControls = true;
    this.sharedService.showLoader(true);
    this.toolBarButtons = { save: false, edit: true, redirect: true };
    this.mainFormService.getMainFormById(id).subscribe((response: ActionResult) => {
      if (response.IsSucessfull) {      
        this.mainForm = response.Result;
        this.editMode = true;
        this.listItemsForm = JSON.parse(this.mainForm.MetadataForm);
        this.listItemsDataSource = JSON.parse(this.mainForm.MetadataDataSource);
        this.metadataGrid = JSON.parse(this.mainForm.MetadataGrid);
        this.listEventData = JSON.parse(this.mainForm.MetadataControlEvent);
        this.listFormEventData = JSON.parse(this.mainForm.MetadataFormEvent);
        this.listTabs = this.mainForm.Tabs ? JSON.parse(this.mainForm.Tabs) : [];
        this.listParams = this.mainForm.Params ? JSON.parse(this.mainForm.Params) : [];
        this.formTabs = JSON.parse(this.mainForm.Tabs);
        this.mainForm.VarsTransaction = this.mainForm.VarsTransaction ? this.mainForm.VarsTransaction : '';
        this.setGridColumns();
        this.listPrimaryKeys = JSON.parse(this.mainForm.MetadataPrimaryKey);
        this.showDesigner = true;
        this.visualizeForm = false;
        setTimeout(() => {
          this.visualizeForm = true;
        }, 200);
      } else if (response.IsError) {
        this.sharedService.error(response.ErrorMessage);
      } else {
        this.sharedService.error(response.Messages.join(','));
      }
      this.sharedService.showLoader(false);
      setTimeout(() => {
        if (!response.IsSucessfull) {
          this.router.navigate(['list-forms']);
        }
      }, 1000);
    }, () => {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
      this.loadControls = false;
    }
    );
  }

  getListConnections() {
    this.mainFormService
      .listAllConnection()
      .subscribe((response: ActionResult) => {
        this.listConections = response.Result;
      });
  }

  async redirect() {
    if (await this.sharedService.confirm('Es seguro de salir?')) {
      if (this.showDesigner && !this.editMode) {
        this.cleanFormDesigner();
      } else {
        this.router.navigate(['list-forms']);
      }
    }
  }

  selectConnection() {
    if (this.newConection) {
      if (!this.formConnection.instance.validate().isValid) {
        return;
      }
      this.crudConnection('saveConnection');
    } else if (this.editModeConnection) {
      if (!this.formConnection.instance.validate().isValid) {
        return;
      }
      this.crudConnection('updateConnection');
    } else if (!this.mainForm.ConnectionId) {
      this.sharedService.error('Seleccione una conexión');
      return;
    }
    this.newConection = false;
    this.editModeConnection = false;
    this.tabChangeWithMethod = true;
    this.tabsConnection.select('listConnection');
    this.showPopup = false;
  }

  crudConnection(method: string) {
    this.sharedService.showLoader(true);
    this.mainFormService[method](this.connection).subscribe(
      (response: ActionResult) => {
        if (response.IsSucessfull) {
          this.mainForm.ConnectionId = response.Result.Id;
          this.mainForm.Connection = response.Result;
          this.connection = new Connection();
          this.showPopup = false;
          this.getListConnections();
        } else {
          this.sharedService.error('Ocurrio un error guardando el registro');
        }
        this.sharedService.showLoader(false);
      },
      () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      }
    );
  }

  cancelConnection() {
    if (this.newConection) {
      this.newConection = false;
    } else {
      this.showPopup = false;
    }
  }

  editConnection = (e: any) => {
    this.tabChangeWithMethod = true;
    this.tabsConnection.select('formConnection');
    this.editModeConnection = true;
    this.connection = { ...e.row.data };
    this.selectIndex = 0;
    setTimeout(() => {
      this.selectIndex = 1;
    }, 600);
  }

  deleteConnection(e: any) {
    const result = confirm(
      'Esta seguro de eliminar el registro',
      'Confirmación'
    );
    result.then(confirmResult => {
      if (confirmResult) {
        this.sharedService.showLoader(true);
        this.mainFormService.deleteConnection(e.row.data.Id).subscribe(
          response => {
            if (response.IsSucessfull) {
              this.sharedService.success('Registro eliminado correctamente');
              this.connection = new Connection();
              this.getListConnections();
            } else {
              this.sharedService.error(
                'Ocurrio un error eliminando el registro'
              );
            }
            this.sharedService.showLoader(false);
          },
          () => {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
          }
        );
      }
    });
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
    if (item.editorOptions.defaultValueFunc) {
      if (item.editorOptions.defaultValueFunc === 'getMaxConse' || item.editorOptions.defaultValueFunc === 'getMaxConseDet'){
        item.editorOptions.value = 0        
      }
      else{
        item.editorOptions.value = this.commonFunctions[
          item.editorOptions.defaultValueFunc
        ]();
      }
    }
  }

  previsualizationForm(e) {
    this.sharedService.showLoader(true);
    this.mainForm.TableName = e.data.Name;
    this.mainForm.Title = e.data.Name;
    this.toolBarButtons = { save: true, edit: false, redirect: true };
    this.showDesigner = true;
    this.setListActionsFormMain();
  }

  getItems(e) {
    this.visualizeForm = false;
    this.loadingVisible = true;
    setTimeout(() => {
      this.visualizeForm = true;
      this.listItemsForm = e.listItemsForm;
      this.listPrimaryKeys = e.listPrimaryKeys;
      this.listItemsDataSource = e.listItemsDataSource;
      if (e.listEventData) {
        this.listEventData = e.listEventData;
      }
      this.loadingVisible = false;
    }, 300);
  }

  getColumns(e) {
    this.metadataGrid = { ...this.metadataGrid, ...e };
    this.loadingVisible = true;
    this.setGridColumns();
  }

  getConditions(e) {
    this.metadataGrid = { ...this.metadataGrid, ...e };
  }

  setGridColumns() {
    setTimeout(() => {
      this.grid.instance.beginUpdate();
      this.grid.instance.option('columns', []);
      for (const column of this.metadataGrid.columns) {
        this.grid.instance.addColumn(column);
      }
      this.grid.instance.endUpdate();
      this.loadingVisible = false;
    }, 300);
  }

  save() {  
    if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
      this.sharedService.warning('No tiene permiso para guardar');
      return;
    }
    try {
      if (!this.formPropertiesComponent.form.instance.validate().isValid) {
        return;
      }
      this.sharedService.showLoader(true);
      this.mainForm.MetadataPrimaryKey = JSON.stringify(this.listPrimaryKeys);
      this.mainForm.MetadataForm = JSON.stringify(this.listItemsForm);
      this.mainForm.MetadataGrid = JSON.stringify(this.metadataGrid);
      this.mainForm.MetadataDataSource = JSON.stringify(this.listItemsDataSource);
      this.mainForm.MetadataControlEvent = JSON.stringify(this.listEventData);
      this.mainForm.MetadataFormEvent = JSON.stringify(this.listFormEventData);
      this.mainForm.CreationUser = this.sessionService.session.accountCode;
      this.mainForm.Url = this.configService.config.urlBaseMicroApplications;
      if (this.mainForm.Transaccion === 'S') {
        if (this.mainForm.VarsTransaction.length === 0){
          this.sharedService.showLoader(false);
          this.sharedService.error('Pendiente definir variables formulario transacción');
          return;
        }
        else{
          for (const item of JSON.parse(this.mainForm.VarsTransaction)){
            if (item.Value.length === 0){
              this.sharedService.showLoader(false);
              this.sharedService.error(`Pendiente definir valor para: ${item.Description}`);
              return;
            }
          }
        }
        this.mainFormService.getConcodi(this.sessionService.session.selectedCompany.code,
          this.mainForm.TableName).subscribe((response: ActionResult) => {
            if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
              this.sharedService.showLoader(false);
              return;
            }
            const lcon_codi = response.Result.con_codi;
            //evento getConse
            //let lcampo = `${this.mainForm.TableName.slice(3, 6)}_CONT`;
            let lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Consec')[0].Value;
            let event = this.listEventData.filter(x => x.eventName === 'onGetConse' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onGetConse';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.rest;
              const restForm = new RestForm();
              restForm.description = 'GetConse';
              restForm.method = 1;
              restForm.url = `${this.configService.config.urlWsConseTransaction}GetConse`;
              restForm.responseMessage = 'ok';
              let lparam = { code: 'EMP_CODI', value: '{EMP_CODI}' };
              restForm.params.push(lparam);
              lparam = { code: 'CON_CODI', value: `${lcon_codi}` };
              restForm.params.push(lparam);
              if (lcon_codi === -500){
                lparam = { code: 'CON_TABL', value: `${this.mainForm.TableName}` };
                restForm.params.push(lparam);
                lparam = { code: 'CON_CAMP', value: `${lcampo}` };
                restForm.params.push(lparam);
              }
              eventAction.config = restForm;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);
            }
            //evento getDocnume
            //lcampo = `${this.mainForm.TableName.slice(3, 6)}_NUME`;
            lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Numero')[0].Value;
            event = this.listEventData.filter(x => x.eventName === 'onGetDocnume' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onGetDocnume';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.rest;
              const restForm = new RestForm();
              restForm.description = 'GetDocnume';
              restForm.method = 1;
              restForm.url = `${this.configService.config.urlWsConseTransaction}GetDocnume`;
              restForm.responseMessage = 'ok';
              let lparam = { code: 'EMP_CODI', value: '{EMP_CODI}' };
              restForm.params.push(lparam);
              lparam = { code: 'TOP_CODI', value: '{TOP_CODI}' };
              restForm.params.push(lparam);
              lparam = { code: 'ARB_SUCU', value: '{ARB_SUCU}' };
              restForm.params.push(lparam);              
              lcampo = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              lparam = { code: 'MVTOFECH', value: `{${lcampo}}` };
              restForm.params.push(lparam);                            
              eventAction.config = restForm;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);
            }
            //evento TOP_CODI
            //lcampo = 'FKTOP_CODI';
            lcampo = `FK${JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_CToper')[0].Value}`;
            event = this.listEventData.filter(x => x.eventName === 'onValueChanged' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onValueChanged';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.otherField;
              const otherField = new OtherField();
              otherField.type = 2;
              //otherField.field = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              otherField.field = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
              otherField.description = 'ValidarToper';
              otherField.valuefunc = 'VALTIPOPE()';
              eventAction.config = otherField;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);              
            }
            //evento XXX_FECH
            //lcampo = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
            lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
            event = this.listEventData.filter(x => x.eventName === 'onValueChanged' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onValueChanged';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.otherField;
              const otherField = new OtherField();
              otherField.type = 2;
              //otherField.field = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              otherField.field = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
              otherField.description = 'ValidarFecha';
              otherField.valuefunc = 'VALBLOMES()';
              eventAction.config = otherField;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);              
            }            
            this.mainForm.MetadataControlEvent = JSON.stringify(this.listEventData);            
            this.mainFormService.saveMainForm(this.mainForm).subscribe((response: ActionResult) => {              
              if (response.IsSucessfull) {
              
                this.setMainMenuApplication();
                this.cleanFormDesigner();
                this.sharedService.success('Registro guardado correctamente');
              } else if (response.IsError) {
                this.sharedService.error(response.ErrorMessage);
              } else {
                this.sharedService.error(response.Messages);
              }
              this.sharedService.showLoader(false);
            }, () => {
              this.sharedService.error('Ocurrio un error inesperado');
              this.sharedService.showLoader(false);
            }
            );
          }
          );
      }
      else {       
        this.mainFormService.saveMainForm(this.mainForm).subscribe((response: ActionResult) => {
          if (response.IsSucessfull) {
          this.setMainMenuApplication();
            this.cleanFormDesigner();
            this.sharedService.success('Registro guardado correctamente');
          } else if (response.IsError) {
            this.sharedService.error(response.ErrorMessage);
          } else {
            this.sharedService.error(response.Messages);
          }
          this.sharedService.showLoader(false);
        }, () => {
          this.sharedService.error('Ocurrio un error inesperado');
          this.sharedService.showLoader(false);
        }
        );
      }
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  edit() {    
    if (!this.listPermisions.find(x => x === EDIT_ACTION)) {
      this.sharedService.warning('No tiene permiso para editar');
      return;
    }
    try {
      if (!this.formPropertiesComponent.form.instance.validate().isValid) {
        return;
      }
      this.sharedService.showLoader(true);
      this.mainForm.MetadataPrimaryKey = JSON.stringify(this.listPrimaryKeys);
      this.mainForm.MetadataForm = JSON.stringify(this.listItemsForm);
      this.mainForm.MetadataGrid = JSON.stringify(this.metadataGrid);
      // this.mainForm.Tabs = JSON.stringify(this.listTabs);
      this.mainForm.MetadataDataSource = JSON.stringify(this.listItemsDataSource);
      this.mainForm.MetadataControlEvent = JSON.stringify(this.listEventData);
      this.mainForm.MetadataFormEvent = JSON.stringify(this.listFormEventData);
      if (this.mainForm.Transaccion === 'S') {
        if (this.mainForm.VarsTransaction.length === 0){
          this.sharedService.showLoader(false);
          this.sharedService.error('Pendiente definir variables formulario transacción');
          return;
        }
        else{
          for (const item of JSON.parse(this.mainForm.VarsTransaction)){
            if (item.Value.length === 0){
              this.sharedService.showLoader(false);
              this.sharedService.error(`Variables formulario transacción. Pendiente definir: [${item.Description}]`);
              return;
            }
          }
        }        
        this.mainFormService.getConcodi(this.sessionService.session.selectedCompany.code,
          this.mainForm.TableName).subscribe((response: ActionResult) => {
            if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
              this.sharedService.showLoader(false);
              return;
            }
            const lcon_codi = response.Result.con_codi;
            //evento getConse
            //let lcampo = `${this.mainForm.TableName.slice(3, 6)}_CONT`;
            let lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Consec')[0].Value;
            let event = this.listEventData.filter(x => x.eventName === 'onGetConse' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onGetConse';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.rest;
              const restForm = new RestForm();
              restForm.description = 'GetConse';
              restForm.method = 1;
              restForm.url = `${this.configService.config.urlWsConseTransaction}GetConse`;
              restForm.responseMessage = 'ok';
              let lparam = { code: 'EMP_CODI', value: '{EMP_CODI}' };
              restForm.params.push(lparam);
              lparam = { code: 'CON_CODI', value: lcon_codi };
              restForm.params.push(lparam);
              if (lcon_codi === -500){
                lparam = { code: 'CON_TABL', value: `${this.mainForm.TableName}` };
                restForm.params.push(lparam);
                lparam = { code: 'CON_CAMP', value: `${lcampo}` };
                restForm.params.push(lparam);
              }                            
              eventAction.config = restForm;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);
            }
            else{ //existe, actualizar url por si cambia
              if (event.actions[0].config.url !== `${this.configService.config.urlWsConseTransaction}GetConse`){
                event.actions[0].config.url = `${this.configService.config.urlWsConseTransaction}GetConse`;
              }
            }
            //evento getDocnume
            //lcampo = `${this.mainForm.TableName.slice(3, 6)}_NUME`;
            lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Numero')[0].Value;
            event = this.listEventData.filter(x => x.eventName === 'onGetDocnume' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onGetDocnume';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.rest;
              const restForm = new RestForm();
              restForm.description = 'GetDocnume';
              restForm.method = 1;
              restForm.url = `${this.configService.config.urlWsConseTransaction}GetDocnume`;
              restForm.responseMessage = 'ok';
              let lparam = { code: 'EMP_CODI', value: '{EMP_CODI}' };
              restForm.params.push(lparam);
              lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_CToper')[0].Value;
              lparam = { code: 'TOP_CODI', value: `{${lcampo}}` };
              restForm.params.push(lparam);
              lparam = { code: 'ARB_SUCU', value: '{ARB_SUCU}' };
              restForm.params.push(lparam);              
              //lcampo = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
              lparam = { code: 'MVTOFECH', value: `{${lcampo}}` };
              restForm.params.push(lparam);                            
              eventAction.config = restForm;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);
            }
            else{ //existe, actualizar url por si cambia
              if (event.actions[0].config.url !== `${this.configService.config.urlWsConseTransaction}GetDocnume`){
                event.actions[0].config.url = `${this.configService.config.urlWsConseTransaction}GetDocnume`;
              }
            }
            //evento TOP_CODI
            //lcampo = 'FKTOP_CODI';
            lcampo = `FK${JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_CToper')[0].Value}`;
            event = this.listEventData.filter(x => x.eventName === 'onValueChanged' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onValueChanged';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.otherField;
              const otherField = new OtherField();
              otherField.type = 2;
              //otherField.field = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              otherField.field = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
              otherField.description = 'ValidarToper';
              otherField.valuefunc = 'VALTIPOPE()';
              eventAction.config = otherField;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);              
            }
            //evento XXX_FECH
            //lcampo = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
            lcampo = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
            event = this.listEventData.filter(x => x.eventName === 'onValueChanged' && x.dataField === lcampo)[0];
            if (event === undefined) { //no existe, se crea
              this.RestActions = [];
              const eventProperty = new EventProperty();
              eventProperty.dataField = lcampo;
              eventProperty.eventName = 'onValueChanged';
              const eventAction = new EventAction();
              eventAction.sequence = 1;
              eventAction.type = EventActionType.otherField;
              const otherField = new OtherField();
              otherField.type = 2;
              //otherField.field = `${this.mainForm.TableName.slice(3, 6)}_FECH`;
              otherField.field = JSON.parse(this.mainForm.VarsTransaction).filter(x => x.Name === 'P_Fecha')[0].Value;
              otherField.description = 'ValidarFecha';
              otherField.valuefunc = 'VALBLOMES()';
              eventAction.config = otherField;
              this.RestActions.push(eventAction);
              eventProperty.actions = this.RestActions;
              this.listEventData.push(eventProperty);              
            }
            this.mainForm.MetadataControlEvent = JSON.stringify(this.listEventData);
            this.mainFormService.updateMainForm(this.mainForm).subscribe((response: ActionResult) => {
              if (response.IsSucessfull) {
               this.setMainMenuApplication();
                this.sharedService.success('Registro actualizado correctamente');
                this.router.navigate(['list-forms']);
              } else if (response.IsError) {
                this.sharedService.error(response.ErrorMessage);
              } else {
                this.sharedService.error(response.Messages);
              }
              this.sharedService.showLoader(false);
            }, () => {
              this.sharedService.error('Ocurrio un error inesperado');
              this.sharedService.showLoader(false);
            }
            );
          }
          );
      }
      else {
        this.mainFormService.updateMainForm(this.mainForm).subscribe((response: ActionResult) => {
          if (response.IsSucessfull) {
          this.setMainMenuApplication();
            this.sharedService.success('Registro actualizado correctamente');
            this.router.navigate(['list-forms']);
          } else if (response.IsError) {
            this.sharedService.error(response.ErrorMessage);
          } else {
            this.sharedService.error(response.Messages);
          }
          this.sharedService.showLoader(false);
        }, () => {
          this.sharedService.error('Ocurrio un error inesperado');
          this.sharedService.showLoader(false);
        }
        );
      }
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
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

  cleanFormDesigner() {
    this.setListActionsFormRedirect();
    const connectionTmp = { ...this.mainForm.Connection };
    this.mainForm = new MainForm();
    this.mainForm.Connection = connectionTmp;
    this.mainForm.ConnectionId = connectionTmp.Id;
    this.metadataGrid = {};
    this.listItemsForm = [];
    this.listPrimaryKeys = [];
    this.showDesigner = false;
    this.editMode = false;
    this.useMasterDetail = false;
    this.masterDetailCount = '';
    this.toolBarButtons = { save: false, edit: false, redirect: true };
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.2);
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.6);
  }

  gridHeightTables = () => {
    return Math.round(window.innerHeight / 1.3);
  }

  setMasterDetail() {
    if (this.gridMasterDetail.instance.getSelectedRowsData().length > 0) {
      this.mainForm.MetadataMasterDetail = JSON.stringify(
        this.gridMasterDetail.instance.getSelectedRowsData()
      );
      this.masterDetailCount = `${this.gridMasterDetail.instance.getSelectedRowsData().length
        } Detalles`;
    } else {
      this.mainForm.UseMasterDetail = false;
    }
    this.showPopupMasterDetail = false;
  }

  heightScroll = () => {
    return window.innerHeight - 160;
  }

  onContentReady(e: any) {
    //  = uuid();
    //  = uuid();
    //  = uuid();
    setTimeout(() => {
      const formEl = document.getElementById(this.formId);
      const formConnectionsEl = document.getElementById(this.formConnectionsId);
      const gridEl = document.getElementById(this.gridId);
      const gridPreviewEl = document.getElementById(this.gridPreviewId);
      const gridConnectionsEl = document.getElementById(this.gridConnectionsId);
      const popUpConnectionsEl = document.getElementById(this.popUpConnectionsId);

      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formConnectionsEl) {
        this.stylingService.setLabelColorStyle(formConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formConnectionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridPreviewEl) {
        this.stylingService.setGridHeaderColorStyle(gridPreviewEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridPreviewEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridConnectionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridConnectionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpConnectionsEl) {
        this.stylingService.setTitleColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpConnectionsEl, this.sessionService.session.selectedCompany.theme);
      }

    }, 1);
  }


  setMainMenuApplication(){
    try {
      this.mainMenuService.updateMainApplicationId(this.mainForm.ApplicationMenu.id,this.mainForm.MicroApplicationId).subscribe();
    } catch (error) {
       this.sharedService.error('Error configurando menú');
    }
   
  }

  //#endregion
}

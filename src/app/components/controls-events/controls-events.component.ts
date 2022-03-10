import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Property, Column, HideField, EventAction, EventProperty, RuleAction, OtherField, ActionResult } from '../../models';
import { EventActionType } from '../../enums/event-action-type.enum';
import { DxFormComponent } from 'devextreme-angular';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { MainFormService } from 'src/app/services/main-form.service';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SessionService } from 'src/app/services';
import { Functions } from 'src/app/models/function';
import { Method, MethodDef } from 'src/app/models/method';

@Component({
  selector: 'app-controls-events',
  templateUrl: './controls-events.component.html',
  styleUrls: ['./controls-events.component.scss']
})
export class ControlsEventsComponent implements OnInit {
  popUpId = uuid();
  formHideFieldId = uuid();
  formRuledId = uuid();
  gridRuleId = uuid();
  gridRulesId = uuid();
  gridActionsId = uuid();
  popUpRuleValuId = uuid();
  formRuleValueId = uuid();
  formOthersFieldsId = uuid();
  popUpFunctionsId = uuid();
  popUpFunctionsIntId = uuid();
  gridFunctionsId = uuid();
  gridVarsFunctionsId = uuid();
  popUpMethodId = uuid();
  popUpMethodIntId = uuid();
  gridMethodId = uuid();
  gridParamsInId = uuid();
  gridParamsOutId = uuid();
  listFunctions: Functions[] = [];
  listMethod: Method[] = [];
  listVarsFunctions: any[] = [];
  listMasterDetails: any[];
  listParamsIn: any[] = [];
  listParamsOut: any[] = [];
  @Input() eventName: string;
  @Input() event: string;
  @Input() set field(dataField: string) {
    this.dataField = dataField;
    this.dataFieldDisplay = dataField.replace(/^FK/, '');
  }
  @Input() tableName: string;
  @Input() connectionId: number;
  @Input() showPopup: boolean;
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter(false);
  @Output() getEventConfig: EventEmitter<EventProperty> = new EventEmitter(null);
  @Input() set listAllowHideFields(items: Property[]) {
    this.listFields = items.filter((x) => x.visible);
    this.item = items.find((x) => x.dataField === this.dataField);
  }
  @Input() set listEventField(list: EventProperty[]) {
    if (list.filter((x) => x.dataField === this.dataField && x.eventName === this.event).length > 0) {
      this.dataSourceActions = [...list.filter((x) => x.dataField === this.dataField && x.eventName === this.event)[0].actions];
    }
  }
  @ViewChild('hideFieldForm') hideFieldForm: DxFormComponent;
  @ViewChild('ruleActionForm') ruleActionForm: DxFormComponent;
  @ViewChild('ruleParamForm') ruleParamForm: DxFormComponent;
  @ViewChild('tabs') tabsDatasource: NgbTabset;
  @ViewChild('otherFieldForm') otherFieldForm: DxFormComponent;
  @ViewChild('tabsParams') tabsParams: NgbTabset;
  item: Property;
  dataFieldDisplay: string;
  dataField: string;
  listOperator: any[] = [{ value: '==', text: 'Igual' }, { value: '!=', text: 'Diferente' }];
  listActions: any[] = [{ value: true, text: 'Si' }, { value: false, text: 'No' }];
  listActionType: any[] = [{ value: EventActionType.rest, text: 'REST' }, { value: EventActionType.hideField, text: 'Ocultar/Mostrar Campos' }, { value: EventActionType.operation, text: 'Operación' },
  { value: EventActionType.rule, text: 'Regla' }, { value: EventActionType.otherField, text: 'Asignar Valor Otros Campos' }];
  listDataTypes: any[] = [{ value: 'string', text: 'String' }, { value: 'double', text: 'Double' }, { value: 'long', text: 'Long' }, { value: 'bool', text: 'Bool' }, { value: 'object', text: 'Object' },
  { value: 'date', text: 'Date' }, { value: 'entity', text: 'Entity' }, { value: 'dynamic', text: 'Dynamic' }];

  listSourceTypeSetValueRule: any[] = [{ value: 1, text: 'Valor Fijo' }, { value: 2, text: 'Campo del Formulario' }];
  listColumns: Column[] = [];
  listSourceTypeSetValueOtherField: any[] = [{ value: 1, text: 'Valor Fijo' }, { value: 2, text: 'Función' }, { value: 3, text: 'Método' }];
  otherFieldFunctionsDate: string[] = ['YEAR()', 'MONTH()', 'DAY()', 'NDATE()'];
  otherFieldFunctionsNum: string[] = ['DTOVER()'];


  hideField: HideField;
  ruleAction: RuleAction;
  otherField: OtherField;
  ruleParam: any;
  isFunction = 1;
  isMethod = 1;
  change = false;
  showPopupFunctions = false;
  showPopupFunctionsInt = false;
  showPopupMethod = false;
  showPopupMethodInt = false;
  function: Functions;
  method: Method;
  methodDef: MethodDef;
  listFields: any[] = [];
  itemsToolbarHideField = [{
    location: 'before', widget: 'dxButton', options: {
      hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
        this.addActionHideField();
      }
    }
  }];
  itemsToolbarRule = [{
    location: 'before', widget: 'dxButton', options: {
      hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
        this.addActionRule();
      }
    }
  }];
  itemsToolbarOthersFields = [{
    location: 'before', widget: 'dxButton', options: {
      hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
        this.addActionOtherField();
      }
    }
  }];
  toolbarItemsPopupSetValueParamRule = [{
    toolbar: 'bottom',
    location: 'center',
    widget: 'dxButton',
    visible: true,
    options: {
      elementAttr: { class: 'primary-button-color' },
      text: 'Aceptar',
      onClick: () => {
        this.setValueParamRule();
      }
    }
  }];
  toolbarItemsPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.addEvent();
        }
      }
    }
  ];
  isFunctionButton = {
    icon: 'fas fa-plus',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.listAllFunctions();
      this.showPopupFunctions = true;
    }
  };
  isMethodButton = {
    icon: 'fas fa-plus',
    type: 'normal',
    stylingMode: 'text',
    onClick: () => {
      this.listAllMethod();
      this.showPopupMethod = true;
    }
  };
  toolbarPopupsConfig = {
    toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
  };
  toolbarItemsFunctionsPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Cerrar',
        onClick: () => {
          this.showPopupFunctionsInt = false;
          this.showPopupFunctions = false;
        }
      }
    }
  ];
  toolbarItemsFunctionsIntPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.otherField.valuefunc = `${this.function.FunctionCode}()`;
          this.otherField.varsfunc = this.listVarsFunctions;
          this.showPopupFunctionsInt = false;
          this.showPopupFunctions = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secondary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.listAllFunctions();
          this.showPopupFunctionsInt = false;
        }
      }
    }
  ];
  toolbarItemsMethodPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Cerrar',
        onClick: () => {
          this.showPopupMethod = false;
        }
      }
    }
  ];
  toolbarItemsMethodIntPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          this.otherField.valuefunc = this.methodDef.code;
          this.otherField.parInmethod = this.listParamsIn;
          this.otherField.parOutmethod = this.listParamsOut;
          this.showPopupMethodInt = false;
          this.showPopupMethod = false;
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secondary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.listAllMethod();
          this.showPopupMethodInt = false;
        }
      }
    }
  ];
  dataSourceActions: EventAction[] = [];
  popupTitle: string;
  actionOrder = 1;
  editMode = false;
  indexItem: number = null;
  listRules: any[] = [];
  listParamsRule: any[] = [];
  controlSearchPrototype: any;
  showPopupSetValue = false;
  ruleDataType: string;
  listFieldsRuleValue: any[] = [];
  listFieldsSetValueRule: any[] = [];
  listFieldsSetValueOther: any[] = [];
  listFieldsSetFunction: any[] = [];

  constructor(
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private sessionService: SessionService,
    private stylingService: StylingService) {
    this.hideField = new HideField();
    this.ruleAction = new RuleAction();
    this.otherField = new OtherField();
    this.ruleParam = {};
  }

  async ngOnInit() {
    if (this.item && (this.item.editorType === 'dxDateBox' || this.item.editorType === 'dxNumberBox')) {
      this.listOperator.push({ value: '>', text: 'Mayor' });
      this.listOperator.push({ value: '>=', text: 'Mayor o Igual' });
      this.listOperator.push({ value: '<', text: 'Menor' });
      this.listOperator.push({ value: '<=', text: 'Menor o Igual' });
    }
    this.popupTitle = `Configuración de Eventos (${this.eventName})`;
    setTimeout(() => {
      this.tabsDatasource.select('hideField');
      if (this.event !== 'onFocusIn') {
        this.tabsDatasource.select('hideField');
      } else {
        this.tabsDatasource.select('rules');
      }
    }, 500);
    // this.mainFormService.listRules().subscribe((response: any) => {
    //   this.listRules = response.result;
    // });
    await this.getListColumns();
    // listado de los detalles disponibles para el formulario
    this.sharedService.getListMasterDetail.subscribe(list => {
      this.listMasterDetails = list.map(detail => {
        return {
          label: {
            text: detail.ProjectName
          },
          dataField: detail.ProjectId
        };
      });
      for (const item of this.listMasterDetails) {
        this.listFields.push(item);
      }
    });
  }

  onHidingPopup() {
    this.closePopup.emit(false);
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.2);
  }

  popupHeightFunc = () => {
    return Math.round(window.innerHeight / 1.4);
  }

  popupHeightFuncInt = () => {
    return Math.round(window.innerHeight / 1.6);
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 2.6);
  }

  onOpened(e) {
    this.controlSearchPrototype = e.component;
  }

  onRowClick(e) {
    this.ruleAction.ruleCode = e.data.code;
    // se consultan los parametros de la regla
    this.mainFormService.listRuleParams(this.ruleAction.ruleCode).subscribe((response: any) => {
      this.listParamsRule = response.result.map((x) => {
        return {
          code: x.code,
          description: x.description,
          dataType: x.type === 0 ? 'string' : x.type === 1 ? 'double' : x.type === 2 ? 'long' : x.type === 3 ? 'bool' : x.type === 4 ? 'object' : x.type === 5 ? 'date' : x.type === 6 ? 'entity' : 'dynamic',
          isNullable: x.isNullable,
          isList: x.isList,
          defaultValue: x.defaultValue,
          value: x.value
        };
      });
    });
    this.controlSearchPrototype.option('opened', false);
  }

  onValueChangedSourceType = (e) => {
    this.ruleParam.value = null;
  }

  addActionHideField() {
    if (!this.hideFieldForm.instance.validate().isValid) {
      return;
    }
    if (this.editMode) {
      this.dataSourceActions.splice(this.indexItem, 1);
    }
    const eventAction = new EventAction();
    eventAction.sequence = this.actionOrder;
    eventAction.type = EventActionType.hideField;
    eventAction.config = { ...this.hideField };
    this.dataSourceActions.push({ ...eventAction });
    this.hideField = new HideField();
    this.editMode = false;
    this.indexItem = null;
    this.actionOrder = 1;
    this.hideFieldForm.instance.resetValues();
  }

  addActionRule() {
    if (!this.ruleActionForm.instance.validate().isValid) {
      return;
    }
    if (this.editMode) {
      this.dataSourceActions.splice(this.indexItem, 1);
    }
    // se valida que todos los parametros tengan valor
    if (this.listParamsRule.find((x) => !x.value)) {
      this.sharedService.error('Existen parametros sin valor');
      return;
    }
    const eventAction = new EventAction();
    eventAction.sequence = this.actionOrder;
    eventAction.type = EventActionType.rule;
    this.ruleAction.parameters = [...this.listParamsRule];

    eventAction.config = { ...this.ruleAction };
    this.dataSourceActions.push({ ...eventAction });
    this.ruleAction = new RuleAction();
    this.listParamsRule = [];
    this.editMode = false;
    this.indexItem = null;
    this.actionOrder = 1;
    this.ruleActionForm.instance.resetValues();
  }

  addActionOtherField() {
    if (!this.otherFieldForm.instance.validate().isValid) {
      return;
    }
    if (this.editMode) {
      this.dataSourceActions.splice(this.indexItem, 1);
    }
    if (this.otherField.type === 1) {
      if (this.otherField.valuefunc.endsWith('()')) {
        this.sharedService.error('Debe seleccionar tipo Función');
        return;
      }
    }
    if (this.otherField.type === 2) {
      if (!this.otherField.valuefunc.endsWith('()')) {
        this.sharedService.error('Función debe terminar en ()');
        return;
      }
      else {
        //validar si es funcion parametrizada por diseñador
        if (this.listFunctions.filter(x => `${x.FunctionCode}()` === this.otherField.valuefunc)[0] !== undefined) {
          //validar homologación de variables
          for (const item of this.otherField.varsfunc) {
            if (!item.field) {
              this.sharedService.error('Variables no han sido homologadas');
              return;
            }
          }
        }
        else {
          if (this.otherFieldFunctionsDate.indexOf(this.otherField.valuefunc) === -1 && this.otherFieldFunctionsNum.indexOf(this.otherField.valuefunc) === -1) {
            this.sharedService.error('Función no soportada');
            return;
          }
          //Si es funcion de fechas validar tipo de dato datetime
          if (this.otherFieldFunctionsDate.indexOf(this.otherField.valuefunc) !== -1) {
            const item = this.listColumns.find((x) => x.Name === this.dataFieldDisplay);
            if (item.DataType !== 'datetime') { //validacion funciones soportadas solo sobre campos datetime
              this.sharedService.error(`Para funciones, campo ${this.dataFieldDisplay} debe ser tipo Fecha`);
              return;
            }
          }
          //Si es funcion digito verificacion validar tipo de dato y existencia de campo TIP_CODI
          if (this.otherField.valuefunc === 'DTOVER()') {
            let isOk = false;
            const item = this.listColumns.find((x) => x.Name.replace(/^FK/, '') === 'TIP_CODI');
            if (item !== undefined) {
              for (const key of item.ForeignKeys) {
                if (key.RefrencedTable === 'GN_TIPDO') {
                  isOk = true;
                  break;
                }
              }
            }
            if (!isOk) {
              this.sharedService.error('Formulario no cuenta con campo para tipo de documento');
              return;
            }
          }
        }
      }
    }
    const eventAction = new EventAction();
    eventAction.sequence = this.actionOrder;
    eventAction.type = EventActionType.otherField;
    eventAction.config = { ...this.otherField };
    this.dataSourceActions.push({ ...eventAction });
    this.otherField = new OtherField();
    this.editMode = false;
    this.indexItem = null;
    this.actionOrder = 1;
    this.otherFieldForm.instance.resetValues();
  }

  addEvent() {
    const eventProperty = new EventProperty();
    eventProperty.dataField = this.dataField;
    eventProperty.eventName = this.event;
    eventProperty.actions = [...this.dataSourceActions];
    this.getEventConfig.emit({ ...eventProperty });
    this.showPopup = false;
  }

  editAction(e) {
    this.editMode = true;
    this.indexItem = e.rowIndex;
    this.actionOrder = e.data.sequence;
    switch (e.data.type) {
      case EventActionType.rest:
        this.tabsDatasource.select('rest');
        break;
      case EventActionType.hideField:
        this.hideField = { ...e.data.config };
        this.tabsDatasource.select('hideField');
        break;
      case EventActionType.operation:
        this.tabsDatasource.select('operation');
        break;
      case EventActionType.rule:
        this.ruleAction = { ...e.data.config };
        this.listParamsRule = [...this.ruleAction.parameters];
        this.tabsDatasource.select('rules');
        break;
      case EventActionType.otherField:
        this.otherField = { ...e.data.config };
        this.tabsDatasource.select('otherField');
        this.change = false;
        break;
      default:
        break;
    }
  }

  async deleteAction(e) {
    if (await this.sharedService.confirm()) {
      this.dataSourceActions.splice(this.indexItem, 1);
      this.hideField = new HideField();
      this.ruleAction = new RuleAction();
      this.listParamsRule = [];
      this.otherField = new OtherField();
      this.editMode = false;
      this.indexItem = null;
      this.actionOrder = 1;
    }
  }

  setValueRule(e) {
    this.showPopupSetValue = true;
    this.ruleParam = { ...e.data };
    if (e.data.dataType === 'string') {
      this.ruleDataType = 'string';
      this.listFieldsRuleValue = this.listColumns.filter((x) => x.DataType === 'varchar' || x.DataType === 'uniqueidentifier').map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name
        };
      });
    }
    if (e.data.dataType === 'double' || e.data.dataType === 'long') {
      this.ruleDataType = 'number';
      this.listFieldsRuleValue = this.listColumns.filter((x) => x.DataType === 'int' || x.DataType === 'decimal' || x.DataType === 'smallint' || x.DataType === 'numeric' || x.DataType === 'tinyint' || x.DataType === 'bigint' || x.DataType === 'number').map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name
        };
      });
    }
    if (e.data.dataType === 'bool') {
      this.ruleDataType = 'boolean';
      this.listFieldsRuleValue = this.listColumns.filter((x) => x.DataType === 'bit').map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name
        };
      });
    }
    if (e.data.dataType === 'date') {
      this.ruleDataType = 'date';
      this.listFieldsRuleValue = this.listColumns.filter((x) => x.DataType === 'datetime' || x.DataType === 'datetime2' || x.DataType === 'smalldatetime' || x.DataType === 'date').map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name
        };
      });
    }

    this.ruleParam.sourceType = this.ruleParam.sourceType ? this.ruleParam.sourceType : 1;
  }


  async getListColumns() {
    const response: ActionResult = await this.mainFormService.listColumns(this.connectionId, this.tableName).toPromise();
    if (response.IsSucessfull) {
      this.listColumns = response.Result;
      this.listFieldsSetValueRule = this.listColumns.map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name
        };
      });
      this.listFieldsSetFunction = this.listColumns.map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name,
          datatype: y.DataType
        };
      });
      this.listFieldsSetValueOther = this.listColumns.map((y) => {
        return {
          value: y.ForeignKeys !== null ? `FK${y.Name}` : y.Name,
          text: y.Name,
          datatype: y.DataType
        };
      });
      const item = this.listFieldsSetValueOther.find((x) => x.value === this.dataField);
      const i = this.listFieldsSetValueOther.indexOf(item);
      this.listFieldsSetValueOther.splice(i, 1);
    } else if (response.IsError) {
      this.listColumns = [];
      this.listFieldsSetValueRule = [];
      this.listFieldsSetValueOther = [];
      this.listFieldsSetFunction = [];
      this.sharedService.error(response.ErrorMessage);
    } else {
      this.listColumns = [];
      this.listFieldsSetValueRule = [];
      this.listFieldsSetValueOther = [];
      this.listFieldsSetFunction = [];
      this.sharedService.error(response.Messages);
    }
  }

  setValueParamRule() {
    if (!this.ruleParamForm.instance.validate().isValid) {
      return;
    }
    let param = this.listParamsRule.find((x) => x.code === this.ruleParam.code);
    if (param) {
      const index = this.listParamsRule.indexOf(param);
      this.listParamsRule.splice(index, 1);
      this.listParamsRule.splice(index, 0, { ...this.ruleParam });
      param = { ...this.ruleParam };
    }
    this.showPopupSetValue = false;
    this.ruleParam = {};
  }

  listAllFunctions() {
    this.mainFormService.listAllFunction().subscribe((response: ActionResult) => {
      this.listFunctions = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  listAllMethod() {
    this.mainFormService.listAllMethod().subscribe((response: ActionResult) => {
      this.listMethod = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  onValueChangedisFuncMeth = (e) => {
    if (this.change) {
      this.isFunction = e.value;
      this.isMethod = e.value;
      if (e.value === 2) {
        this.otherField.type = 2;
        if (!this.otherField.valuefunc.includes('()')) {
          this.otherField.valuefunc = ' ';
          this.listAllFunctions();
          this.showPopupFunctions = true;
        }
      }
      else if (e.value === 3) {
        this.otherField.type = 3;
        this.listAllMethod();
        this.showPopupMethod = true;
      }
      else {
        this.otherField.valuefunc.includes('()') ? this.otherField.valuefunc = ' ' : '';
      }
    }
    else{
      this.change = true;
    }
  }

  onRowFunctionDblClick(e: any) {
    this.function = e.data;
    //obtener variables de cuerpo de funcion
    this.listVarsFunctions = [];
    let lcadena = this.function.FunctionBody;
    let lpos1 = lcadena.indexOf('{');
    let lpos2 = lcadena.indexOf('}');
    while (lpos1 !== -1) {
      const lvar = lcadena.substring(lpos1 + 1, lpos2);
      const lexist = this.otherField.varsfunc.filter(x => x.variable === lvar)[0];
      lexist ? this.listVarsFunctions.push({ variable: lvar, field: lexist.field }) : this.listVarsFunctions.push({ variable: lvar, field: '' });
      lpos1 = lcadena.indexOf('{', lpos2 + 1);
      lpos2 = lcadena.indexOf('}', lpos1 + 1);
    }
    this.showPopupFunctionsInt = true;
  }

  onRowMethodDblClick(e: any) {
    this.method = e.data;
    this.methodDef = JSON.parse(this.method.MethodBody);
    this.listParamsIn = [];
    this.listParamsIn = this.methodDef.paramsIn.map((x) => {
      return {
        param: x.param,
        field: this.otherField.parInmethod.filter(y => y.param === x.param)[0] ? this.otherField.parInmethod.filter(y => y.param === x.param)[0].field : ''
      };
    });
    this.listParamsOut = [];
    this.listParamsOut = this.methodDef.paramsOut.map((x) => {
      return {
        param: x.param,
        field: this.otherField.parOutmethod.filter(y => y.param === x.param)[0] ? this.otherField.parOutmethod.filter(y => y.param === x.param)[0].field : ''
      };
    });
    this.showPopupMethodInt = true;
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const gridRuleEl = document.getElementById(this.gridRuleId);
      const gridRulesEl = document.getElementById(this.gridRulesId);
      const gridActionsEl = document.getElementById(this.gridActionsId);
      const formHideFieldEl = document.getElementById(this.formHideFieldId);
      const formRuledEl = document.getElementById(this.formRuledId);
      const formRuleValueEl = document.getElementById(this.formRuleValueId);
      const popUpEl = document.getElementById(this.popUpId);
      const popUpRuleValuEl = document.getElementById(this.popUpRuleValuId);
      const formOthersFieldsId = document.getElementById(this.formOthersFieldsId);
      const popUpFunctionsEl = document.getElementById(this.popUpFunctionsId);
      const popUpFunctionsIntEl = document.getElementById(this.popUpFunctionsIntId);
      const gridFunctionsEl = document.getElementById(this.gridFunctionsId);
      const gridVarsFunctionsEl = document.getElementById(this.gridVarsFunctionsId);
      const popUpMethodEl = document.getElementById(this.popUpMethodId);
      const popUpMethodIntEl = document.getElementById(this.popUpMethodIntId);
      const gridMethodEl = document.getElementById(this.gridMethodId);
      const gridParamsInEl = document.getElementById(this.gridParamsInId);
      const gridParamsOutEl = document.getElementById(this.gridParamsOutId);
      if (formHideFieldEl) {
        this.stylingService.setLabelColorStyle(formHideFieldEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formHideFieldEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formRuledEl) {
        this.stylingService.setLabelColorStyle(formRuledEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formRuledEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formRuleValueEl) {
        this.stylingService.setLabelColorStyle(formRuleValueEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formRuleValueEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridRuleEl) {
        this.stylingService.setGridHeaderColorStyle(gridRuleEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridRuleEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridRulesEl) {
        this.stylingService.setGridHeaderColorStyle(gridRulesEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridRulesEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridActionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridActionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridActionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpEl) {
        this.stylingService.setTitleColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpRuleValuEl) {
        this.stylingService.setTitleColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpRuleValuEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formOthersFieldsId) {
        this.stylingService.setLabelColorStyle(formOthersFieldsId, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formOthersFieldsId, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpFunctionsEl) {
        this.stylingService.setTitleColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpFunctionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpFunctionsIntEl) {
        this.stylingService.setTitleColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpFunctionsIntEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridFunctionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridFunctionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridVarsFunctionsEl) {
        this.stylingService.setGridHeaderColorStyle(gridVarsFunctionsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridVarsFunctionsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpMethodEl) {
        this.stylingService.setTitleColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpMethodIntEl) {
        this.stylingService.setTitleColorStyle(popUpMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMethodEl) {
        this.stylingService.setGridHeaderColorStyle(gridMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMethodEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridParamsInEl) {
        this.stylingService.setGridHeaderColorStyle(gridParamsInEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridParamsInEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridParamsOutEl) {
        this.stylingService.setGridHeaderColorStyle(gridParamsOutEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridParamsOutEl, this.sessionService.session.selectedCompany.theme);
      }
    }, 1);
  }

}

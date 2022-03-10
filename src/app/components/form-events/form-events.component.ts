import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EventAction, EventProperty, QueryForm, RestForm } from '../../models/event-data';
import { SharedService } from '../../services/shared.service';
import { EventActionType } from '../../enums/event-action-type.enum';
import { DxFormComponent } from 'devextreme-angular';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SessionService } from 'src/app/services';


@Component({
  selector: 'app-form-events',
  templateUrl: './form-events.component.html',
  styleUrls: ['./form-events.component.scss']
})
export class FormEventsComponent implements OnInit {
  formId = uuid();
  formQueryId = uuid();
  popUpId = uuid();
  gridParamsId = uuid();
  gridMessagesId = uuid();
  gridParamsqueryId = uuid();
  gridActionsId = uuid();
  @ViewChild('restFormEvent') restFormEvent: DxFormComponent;
  @ViewChild('queryFormEvent') queryFormEvent: DxFormComponent;
  @Input() eventName: string;
  @Input() event: string;
  @Input() showPopup: boolean;
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter(false);
  @Output() getEventConfig: EventEmitter<EventProperty> = new EventEmitter(null);
  @Input() set listEventField(list: EventProperty[]) {
    if (list) {
      if (list.filter((x) => x.eventName === this.event).length > 0) {
        this.dataSourceActions = [...list.filter((x) => x.eventName === this.event)[0].actions];
      }
    } else {
      this.dataSourceActions = [];
    }
  }
  @ViewChild('tabs') tabsDatasource: NgbTabset;
  itemsToolbar = [{
    location: 'before', widget: 'dxButton', options: {
      hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
        this.addActionRest();
      }
    }
  }];
  itemsToolbarQry = [{
    location: 'before', widget: 'dxButton', options: {
      hint: 'Aplicar', icon: 'fas fa-check', onClick: () => {
        this.addActionQuery();
      }
    }
  }];  
  listMethod: any[] = [{ value: 1, text: 'POST' }, { value: 2, text: 'GET' }];
  listRedirect: any[] = [{ value: 1, text: 'Si' }, { value: 0, text: 'No' }];
  listActionType: any[] = [{ value: EventActionType.rest, text: 'REST' }, { value: EventActionType.hideField, text: 'Ocultar/Mostrar Campos' }, { value: EventActionType.operation, text: 'Operación' },
  { value: EventActionType.query, text: 'Consulta' }];
  dataSourceActions: EventAction[] = [];
  popupTitle: string;
  actionOrder = 1;
  editMode = false;
  indexItem: number = null;
  restForm: RestForm;
  queryForm: QueryForm;
  toolbarItemsPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.addEvent();
        }
      }
    }
  ];
  listType: any[] = [
    { value: 'M', text: 'Mensaje' },
    { value: 'D', text: 'Mensaje condicional' },
    { value: 'C', text: 'Conjunto de datos' },
    { value: 'A', text: 'Archivo' },
    { value: 'O', text: 'Modificación de datos' }
  ];

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private stylingService: StylingService) {
    this.restForm = new RestForm();
    this.queryForm = new QueryForm();
  }

  ngOnInit() {
    this.popupTitle = `Configuración de Eventos (${this.eventName})`;
  }

  onHidingPopup() {
    this.closePopup.emit(false);
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.3);
  }

  gridHeightRest = () => {
    return Math.round(window.innerHeight / 3);
  }

  gridHeightQuery = () => {
    return Math.round(window.innerHeight / 4.5);
  }  

  gridHeightActions = () => {
    return Math.round(window.innerHeight / 2);
  }    

  formHeight = () => {
    return Math.round(window.innerHeight / 2);
  }  


  onToolbarPreparingParams(e) {
    e.toolbarOptions.items.push({
      location: 'center',
      locateInMenu: 'never',
      template: () => {
        return `<div class=\'toolbar-label\'><b>Parametros</b></div>`;
      }
    });
  }

  onToolbarPreparingActions(e) {
    e.toolbarOptions.items.push({
      location: 'center',
      locateInMenu: 'never',
      template: () => {
        return `<div class=\'toolbar-label\'><b>Acciones</b></div>`;
      }
    });
  }

  errorRowEnabledChange(e) {
    if (e.error.message.split(' - ')[0] === 'E4008') {
      e.error.message = 'Clave Duplicada';
    }
  }

  addEvent() {
    if (this.dataSourceActions.length === 0){
      this.sharedService.error('Pendiente confirmar cambios');
      return;
    }
    const eventProperty = new EventProperty();
    eventProperty.eventName = this.event;
    eventProperty.actions = [...this.dataSourceActions];
    this.getEventConfig.emit({ ...eventProperty });
    this.showPopup = false;
  }

  addActionRest() {
    if (!this.restFormEvent.instance.validate().isValid) {
      return;
    }
    if (this.restForm.params.length === 0){
      this.sharedService.error('Ingrese parametros del servicio');
      return;
    }
    if (this.restForm.messages.filter(x => x.type === 'C').length > 1){
      this.sharedService.error('Solo se permite un mensaje tipo conjunto de datos');
      return;
    }
    if (this.editMode) {
      this.dataSourceActions.splice(this.indexItem, 1);
    }
    const eventAction = new EventAction();
    eventAction.sequence = this.actionOrder;
    eventAction.type = EventActionType.rest;
    eventAction.config = { ...this.restForm };
    this.dataSourceActions.push({ ...eventAction });
    this.restForm = new RestForm();
    this.editMode = false;
    this.indexItem = null;
    this.actionOrder = 1;
    this.restFormEvent.instance.resetValues();
    this.tabsDatasource.select('actions');
  }

  addActionQuery() {
    if (!this.queryFormEvent.instance.validate().isValid) {
      return;
    }    
    //this.sharedService.warning('Consulta de digiflags y parametros');
    return;
  }

  editAction(e) {
    this.editMode = true;
    this.indexItem = e.rowIndex;
    this.actionOrder = e.data.sequence;
    switch (e.data.type) {
      case EventActionType.rest:
        this.restForm = { ...e.data.config };
        this.restForm.redirect ? '' : this.restForm.redirect = 1;
        this.restForm.messages ? '' : this.restForm.messages = [];
        this.tabsDatasource.select('rest');
        break;
    }
  }

  async deleteAction(e) {
    if (await this.sharedService.confirm()) {
      this.dataSourceActions.splice(this.indexItem, 1);
      this.restForm = new RestForm();
      this.editMode = false;
      this.indexItem = null;
      this.actionOrder = 1;
    }
  }

  onInitNewRow(e){
    e.data.id = this.restForm.messages.length + 1;
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const gridParamsEl = document.getElementById(this.gridParamsId);
      const gridMessagesEl = document.getElementById(this.gridMessagesId);
      const gridParamsqueryEl = document.getElementById(this.gridParamsqueryId);
      const gridActionsEl = document.getElementById(this.gridActionsId);
      const formEl = document.getElementById(this.formId);
      const formQueryEl = document.getElementById(this.formQueryId);
      const popUpEl = document.getElementById(this.popUpId);
      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formQueryEl) {
        this.stylingService.setLabelColorStyle(formQueryEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formQueryEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridParamsEl) {
        this.stylingService.setGridHeaderColorStyle(gridParamsEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridParamsEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMessagesEl) {
        this.stylingService.setGridHeaderColorStyle(gridMessagesEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMessagesEl, this.sessionService.session.selectedCompany.theme);
      }      
      if (gridParamsqueryEl) {
        this.stylingService.setGridHeaderColorStyle(gridParamsqueryEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridParamsqueryEl, this.sessionService.session.selectedCompany.theme);
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
    }, 1);
  }
}

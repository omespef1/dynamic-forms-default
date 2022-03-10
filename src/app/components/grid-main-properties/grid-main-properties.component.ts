import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Connection, ActionResult, ColumnGrid } from '../../models';
import { MainFormService } from '../../services/main-form.service';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SessionService } from 'src/app/services';

@Component({
  selector: 'app-grid-main-properties',
  templateUrl: './grid-main-properties.component.html',
  styleUrls: ['./grid-main-properties.component.css']
})
export class GridMainPropertiesComponent implements OnInit {
  formId = uuid();
  popUpId = uuid();
  gridId = uuid();
  showPopupConditionsDesigner = false;
  listDataSourceConditions: any[] = [];
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
    { value: 'AND', text: 'Y' },
    { value: 'OR', text: 'O' }
  ];
  listColumns: ColumnGrid[] = [];

  @Input() tableName: string;
  @Input() connection: Connection;
  @Input() metadataGrid: any = {};
  @Output() getConditions = new EventEmitter<any>();
  listOptions: any[] = [{ value: true, text: 'Si' }, { value: false, text: 'No' }];
  @Input() set conditions(data) {
    if (data) {
      this.listDataSourceConditions = JSON.parse(data);
    }
  }
  toolbarItemsFontPopup = [
    {
      toolbar: 'bottom',
      location: 'center',
      widget: 'dxButton',
      visible: true,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          this.setConditions();
          this.showPopupConditionsDesigner = false;
        }
      }
    }
  ];

  constructor(
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private sessionService: SessionService,
    private stylingService: StylingService
  ) { }

  ngOnInit() {
    this.mainFormService.listAllColumnsSelectedTable(this.connection.Id, this.tableName).subscribe((response: ActionResult) => {
      this.listColumns = response.Result.Columns;
    });
    if (!this.metadataGrid) {
      this.metadataGrid = {
        wordWrapEnabled: false
      };
    }
  }


  onFocusInCondition = () => {
    this.showPopupConditionsDesigner = true;
  }


  setConditions() {
    this.getConditions.emit({ conditions: JSON.stringify(this.listDataSourceConditions) });
    this.showPopupConditionsDesigner = false;
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.5);
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.1);
  }

  setDisplay = (data) => {
    return data.Name.replace('.', '_');
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
      if (popUpEl) {
        this.stylingService.setTitleColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
    }
    }, 1);
  }
}

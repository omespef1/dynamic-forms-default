import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Property, MainForm, PropertyGrid, ActionResult } from 'src/app/models';
import { DxoGridComponent } from 'devextreme-angular/ui/nested';
import moment from 'moment';
import 'moment/min/locales';
import { DynamicProgramsService } from 'src/app/services/dynamic.programs.service';
import { SecurityService } from 'src/app/services/security.service';
import { SessionService } from 'src/app/services/session.service';
import { ResourceType } from 'src/app/models/permission';
import { SAVE_ACTION } from 'src/app/utils/const';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SecuritySevenService } from '../../services/security-seven.service';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent implements OnInit {
  gridId = uuid();
  popUpId = uuid();
  @Input() showPopup = false;
  @Input() listItemsForm: Property[];
  @Input() mainForm: MainForm;
  @Input() parentMainForm: MainForm;
  @Input() dataMaster: any;
  listItems: any[] = [];
  listKeyMasterDetail: any[] = [];
  metadataPrimaryKey: any[];
  @Output() responseImport = new EventEmitter<any>();
  @ViewChild('inputImport') inputImport: ElementRef;
  @ViewChild('grid') grid: DxoGridComponent;
  listErrorsImport = [];
  listPermisions = [];

  toolbarPopupsCofig = { toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true };
  toolbarItemsPopup = [
    {
      ...this.toolbarPopupsCofig,
      options: {
        text: 'Aceptar',
        elementAttr: { class: 'primary-button-color' },
        onClick: () => {
          if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
            this.sharedService.warning('No tiene permiso para guardar');
            return;
          }
          if (this.listItems.length === 0) {
            this.sharedService.warning('No existen items para procesar');
            return;
          }
          if (this.listErrorsImport.length > 0) {
            this.sharedService.error(this.listErrorsImport);
            return;
          }
          this.sharedService.showLoader(true);
          this.dynamicProgramsService.saveDataMassive({ ProjectId: this.mainForm.Id, Details: this.listItems }).subscribe((response: ActionResult) => {
            if (response.IsSucessfull) {
              this.sharedService.success('Proceso finalizado correctamente');
            } else if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
            } else {
              this.sharedService.warning(response.Messages);
            }
            this.sharedService.showLoader(false);
            this.responseImport.emit(true);
            this.showPopup = false;
          }, () => {
            this.sharedService.error('Ocurrio un error inesperado');
            this.sharedService.showLoader(false);
            this.responseImport.emit(true);
          });

        }
      }
    },
    {
      ...this.toolbarPopupsCofig,
      options: {
        elementAttr: { class: 'secundary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.responseImport.emit(false);
          this.showPopup = false;
        }
      }
    }
  ];


  constructor(
    private sharedService: SharedService,
    private dynamicProgramsService: DynamicProgramsService,
    private sessionService: SessionService,
    private securityService: SecuritySevenService,
    private stylingService: StylingService) {
  }

  async ngOnInit() {
    const resultPermisions = await this.securityService.getPermisions(this.mainForm.ProgramCode).toPromise();
    if (resultPermisions.isSuccessful) {
      this.listPermisions = resultPermisions.result.actions;
    }
    if (this.parentMainForm) {
      this.listKeyMasterDetail = JSON.parse(this.parentMainForm.MetadataMasterDetail).filter((x) => x.ProjectId === this.mainForm.Id)[0].MasterDetails;
    }
    this.metadataPrimaryKey = JSON.parse(this.mainForm.MetadataPrimaryKey);
    this.setColumns();
  }

  setColumns() {
    this.grid.instance.option('columns', []);
    for (const item of this.listItemsForm) {
      const key = this.metadataPrimaryKey.find(x => x.Name === item.dataField.replace(/^FK/, ''));
      if (key && (key.IsGuid || key.IsIdentity)) {
        continue;
      }
      // es un detalle
      if (this.parentMainForm) {
        // se busca el id de la cabecera para no agregarlo en las columnas
        if (this.listKeyMasterDetail[0].DetailColumnName === item.dataField.replace(/^FK/, '')) {
          continue;
        }
      }
      const column = new PropertyGrid();
      column.dataField = item.dataField.replace(/^FK/, '');
      column.caption = column.dataField;
      if (item.validationRules.find(x => x.type === 'required')) {
        column.caption = `${column.dataField}*`;
      }
      delete column.lookup;
      switch (item.dataType) {
        case 'datetime':
        case 'datetime2':
        case 'smalldatetime':
          column.dataType = 'datetime';
          (column as any).dateSerializationFormat = 'yyyy-MM-ddTHH:mm:ss';
          break;
        case 'date':
          column.dataType = 'date';
          (column as any).dateSerializationFormat = 'yyyy-MM-ddTHH:mm:ss';
          break;
        case 'int':
        case 'decimal':
        case 'smallint':
        case 'numeric':
        case 'tinyint':
        case 'bigint':
        case 'number':
          column.dataType = 'number';
          break;
        case 'bit':
          column.dataType = 'string';
          break;
        default:
          column.dataType = 'string';
          break;
      }
      column.editorOptions = { ...item.editorOptions };
      column.format = item.editorOptions.displayFormat ? item.editorOptions.displayFormat : item.editorOptions.format;
      this.grid.instance.addColumn(column);
    }
  }

  onToolbarPreparingGrid(e: any) {
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
          this.inputImport.nativeElement.click();
        }
      }
    });
  }

  changeFile(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();

      this.sharedService.showLoader(true);

      reader.readAsBinaryString(e.target.files[0]);

      reader.onerror = (ex) => {
        //console.log(ex);
      };
      // reader.readAsDataURL(e.target.files[0]);
      reader.onload = (r) => {
        const data = (r as any).target.result;
        const workbook = (window as any).XLSX.read(data, {
          type: 'binary'
        });
        workbook.SheetNames.forEach((sheetName: any) => {
          this.listItems = [];
          this.listErrorsImport = [];
          const listItemsExcel = (window as any).XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          for (const row of listItemsExcel) {
            const dataAdd = {};
            // si es un detalle se agrega el id de la cabecera
            if (this.parentMainForm) {
              dataAdd[this.listKeyMasterDetail[0].DetailColumnName] = this.dataMaster[this.listKeyMasterDetail[0].MasterColumnName];
            }
            for (const itemForm of this.listItemsForm) {
              const primaryKey = this.metadataPrimaryKey.find(x => x.Name === itemForm.dataField.replace(/^FK/, ''));
              if (primaryKey && (primaryKey.IsGuid || primaryKey.IsIdentity)) {
                continue;
              }
              // si es un detalle
              if (this.parentMainForm) {
                if (this.listKeyMasterDetail[0].DetailColumnName === itemForm.dataField.replace(/^FK/, '')) {
                  continue;
                }
              }
              const key = Object.keys(row).find(x => x.replace('*', '') === itemForm.dataField.replace(/^FK/, ''));

              const itemRequired = itemForm.validationRules.find(x => x.type === 'required');
              // se valid que el campo tenga valor si es requerido
              if (itemRequired && !key) {
                this.listErrorsImport.push(`El campo ${itemForm.label.text} del item ${listItemsExcel.indexOf(row) + 1} es requerido pero no se asigno valor`);
                continue;
              }
              // si no es requerido y no se encuentra la llave entonces se
              if (!key) {
                dataAdd[itemForm.dataField.replace(/^FK/, '')] = null;
                continue;
              }
              const keyDataAdd = key.replace('*', '');
              switch (itemForm.dataType) {
                case 'datetime':
                case 'datetime2':
                case 'smalldatetime':
                case 'date':
                  dataAdd[keyDataAdd] = moment(new Date(row[key])).locale('es-CO').format('YYYY-MM-DDTHH:mm:ss');
                  break;
                case 'int':
                case 'decimal':
                case 'smallint':
                case 'numeric':
                case 'tinyint':
                case 'bigint':
                case 'number':
                  dataAdd[keyDataAdd] = Number(row[key]);
                  break;
                case 'bit':
                  dataAdd[keyDataAdd] = Boolean(JSON.parse(row[key]));
                  break;
                default:
                  dataAdd[keyDataAdd] = row[key];
                  break;
              }
            }
            this.listItems.push(dataAdd);

          }
          if (this.listErrorsImport.length > 0) {
            this.listItems = [];
            this.sharedService.error(this.listErrorsImport);
          }
          this.sharedService.showLoader(false);
        });
        this.inputImport.nativeElement.value = '';
      };
    }
  }


  onContentReady(e: any) {
    setTimeout(() => {
      const gridEl = document.getElementById(this.gridId);
      const popUpEl = document.getElementById(this.popUpId);

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

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.6);
  }
}

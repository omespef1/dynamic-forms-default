import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Property, MainForm, PropertyGrid, ActionResult, KeyData } from 'src/app/models';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { DxoGridComponent } from 'devextreme-angular/ui/nested';
import moment from 'moment';
import 'moment/min/locales';
import { DynamicProgramsService } from 'src/app/services/dynamic.programs.service';
import { SecurityService } from 'src/app/services/security.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfigService } from 'src/app/services/config.service';
import { ResourceType } from 'src/app/models/permission';
import { SAVE_ACTION } from 'src/app/utils/const';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SecuritySevenService } from '../../services/security-seven.service';
import { Attach } from 'src/app/models/attach';
import { HttpClient } from '@angular/common/http';
import FileSaver from 'file-saver';


@Component({
    selector: 'app-attach-file',
    templateUrl: './attach-file.component.html',
    styleUrls: ['./attach-file.component.css']
})
export class AttachFileComponent implements OnInit {
    popUpAttachId = uuid();
    gridAttachId = uuid();
    formAttachId = uuid();
    popUpForeignKeyId = uuid();
    gridForeignKeyId = uuid();
    popUpSearchFKId = uuid();
    gridSearchFKId = uuid();
    @Input() showPopup = false;
    @Input() mainForm: MainForm;
    @Input() dataMaster: any = {};
    //@Input() attachForm: Attach;
    //@Input() listDataAttach: any[];
    @Output() responseAttach = new EventEmitter<any>();
    @ViewChild('attachGrid') attachGrid: DxDataGridComponent;
    @ViewChild('formAttach') formAttach: DxFormComponent;
    @ViewChild('AttachFile') AttachFile: ElementRef;
    @ViewChild('foreignKeyGrid') foreignKeyGrid: DxDataGridComponent;
    data: any = {};
    //foreignKeyData: Property;
    attachForm: Attach;
    listDataAttach: any[] = [];
    atrrForeignKey: any[] = [];
    listDataForeignKey: any[] = [];
    listSearchFKConditions: any[] = [];
    searchTitle = '';
    showPopupForeign = false;
    showPopupSearchFKConditions = false;
    listPermisions = [];
    itemRowClickDataAttach: any;
    itemRowClickSearch: any;
    valueListCategory: any;
    valueListType: any;
    valueListGroup: any;
    valueListThird: any;
    valueListThirdO: any;
    valueListContO: any;
    valueListThirdD: any;
    valueListContD: any;
    valueListToper: any;
    valueListOrig: any;
    fileBase64 = '';
    fileName = '';
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
    toolbarPopupsConfig = {
        toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true
    };
    toolbarConfig = { toolbar: 'bottom', location: 'center', widget: 'dxButton', visible: true };

    valueListConfigS = {
        icon: 'dx-icon dx-icon-search icon-foreign-key', type: 'normal',
        stylingMode: 'text', disabled: false, visible: true,
        onClick: (b: any) => { this.openPopupSearchForeignKey(b.component.option('name').replace('search_', ''),''); }
    };

    valueListConfigC = {
        icon: 'dx-icon dx-icon-clear icon-foreign-key', type: 'normal',
        stylingMode: 'text', disabled: false, visible: false,
        onClick: (b: any) => {
            const dataField = b.component.option('name').replace('clear_', '');
            this.formAttach.instance.getEditor(dataField).option('readOnly', false);
            this.formAttach.instance.getEditor(dataField).option('buttons[1].options.visible', false);
            this.attachForm[dataField] = null;
            this.cleanDependencyFields(dataField);
        }
    };

    toolbarItemsAttachPopup = [
        {
            ...this.toolbarConfig,
            options: {
                text: 'Adicionar',
                icon: 'fas fa-folder-plus',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.AttachFile.nativeElement.click();
                }
            }
        },
        {
            ...this.toolbarConfig,
            options: {
                text: 'Descargar',
                icon: 'fas fa-download',
                elementAttr: { class: 'secondary-button-color' },
                onClick: () => {
                    this.downloadAttachfile();
                }
            }
        },
        {
            ...this.toolbarConfig,
            options: {
                text: 'Eliminar',
                icon: 'fas fa-folder-minus',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.deleteAttachfile();
                }
            }
        },
        {
            ...this.toolbarConfig,
            options: {
                text: 'Cerrar',
                icon: 'far fa-window-close',
                elementAttr: { class: 'secondary-button-color' },
                onClick: () => {
                    if (this.attachForm.rad_cont > 0){
                        this.saveAttach();
                    }
                    else{
                        this.responseAttach.emit(true);
                        this.showPopup = false;
                    }
                }
            }
        }
    ];
    toolbarItemsForeignKeyPopup = [
        {
            ...this.toolbarPopupsConfig,
            options: {
                text: 'Aceptar',
                icon: 'fas fa-bolt',
                elementAttr: { class: 'primary-button-color' },
                onClick: () => {
                    this.setForeignKey(this.itemRowClickSearch['field']);
                    this.formAttach.instance.getEditor(this.itemRowClickSearch['field']).option('readOnly', true);
                    this.formAttach.instance.getEditor(this.itemRowClickSearch['field']).option('buttons[1].options.visible', true);
                    this.cleanDependencyFields(this.itemRowClickSearch['field']);
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
                    this.showPopupForeign = false;
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
                    this.listSearchFKConditions = [];
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
                    this.searchFK();
                }
            }
        }
    ];

    constructor(
        private http: HttpClient,
        private sharedService: SharedService,
        private dynamicProgramsService: DynamicProgramsService,
        private configService: ConfigService,
        private sessionService: SessionService,
        private securityService: SecuritySevenService,
        private stylingService: StylingService
    ) {
        this.attachForm = new Attach();
        //this.foreignKeyData = new Property();
        this.valueListCategory = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_ite_cono_c',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_ite_cono_c',
                    }
                }
            ]
        };
        this.valueListType = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_arb_cono',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_arb_cono',
                    }
                }
            ]
        };
        this.valueListGroup = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_ite_cono_g',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_ite_cono_g',
                    }
                }
            ]
        };
        this.valueListThird = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_ter_cono',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_ter_cono',
                    }
                }
            ]
        };
        this.valueListThirdO = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_ter_cono_o',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_ter_cono_o',
                    }
                }
            ]
        };
        this.valueListContO = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_rad_cori',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_rad_cori',
                    }
                }
            ]
        };
        this.valueListThirdD = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_ter_cono_d',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_ter_cono_d',
                    }
                }
            ]
        };
        this.valueListContD = {
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_rad_cdes',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_rad_cdes',
                    }
                }
            ]
        };
        this.valueListToper = {
            readOnly: true,
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_top_cono',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_top_cono',
                    }
                }
            ]
        };
        this.valueListOrig = {
            readOnly: true,
            buttons: [
                {
                    name: 'search', location: 'before',
                    options: {
                        ...this.valueListConfigS, name: 'search_rad_orig',
                    }
                },
                {
                    name: 'times',
                    options: {
                        ...this.valueListConfigC, name: 'clear_rad_orig',
                    }
                }
            ]
        };
    }
    async ngOnInit() {
        const resultPermisions = await this.securityService.getPermisions(this.mainForm.ProgramCode).toPromise();
        if (resultPermisions.isSuccessful) {
            this.listPermisions = resultPermisions.result.actions;
        }
        this.listAttach();
    }

    async onInitialized(e) {
        // this.sharedService.showLoader(true);
        // e.component.beginUpdate();
        // e.component.option('items', []);        
        // this.itemForm.dataField = 'rad_cont';
        // this.itemForm.label.text = 'ID';        
        // this.itemForm.editorOptions.readOnly = true;
        // e.component.option('items').push({ ...this.itemForm });
        // e.component.repaint();
        // e.component.endUpdate();
        // setTimeout(() => {
        //   this.sharedService.showLoader(false);
        // }, 2000);        
    }

    async listAttach() {
        const dataRest: any = {};
        let lrad_llav = '';
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['pro_codi'] = this.mainForm.SubTitle;
        const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
        for (const item of listKeyData) {
            lrad_llav += this.dataMaster[item.Name];
        }
        dataRest['rad_llav'] = lrad_llav;
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}GetGnRadju`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //asignar resultado
                this.attachForm = resultEvent.Result[0];
                this.listDataAttach = resultEvent.Result[1];
                this.showPopup = true;
                setTimeout(() => {
                    this.attachGrid.instance.option('columns', []);
                    this.attachGrid.instance.addColumn({ caption: 'Nombre archivo', dataField: 'adj_nomb' });
                    this.attachGrid.instance.addColumn({ caption: 'Usuario', dataField: 'aud_usua' });
                    this.attachGrid.instance.addColumn({ caption: 'Fecha', dataField: 'aud_ufac' });
                    this.attachGrid.instance.addColumn({ caption: 'Tipo', dataField: 'adj_tipo' });
                    this.attachForm['ite_cono_c'] ? this.formAttach.instance.getEditor('ite_cono_c').option('readOnly', true) : '';
                    this.attachForm['ite_cono_c'] ? this.formAttach.instance.getEditor('ite_cono_c').option('buttons[1].options.visible', true) : '';
                    this.attachForm['ite_cono_g'] ? this.formAttach.instance.getEditor('ite_cono_g').option('readOnly', true) : '';
                    this.attachForm['ite_cono_g'] ? this.formAttach.instance.getEditor('ite_cono_g').option('buttons[1].options.visible', true) : '';
                    this.attachForm['arb_cono'] ? this.formAttach.instance.getEditor('arb_cono').option('readOnly', true) : '';
                    this.attachForm['arb_cono'] ? this.formAttach.instance.getEditor('arb_cono').option('buttons[1].options.visible', true) : '';
                    this.attachForm['ter_cono'] ? this.formAttach.instance.getEditor('ter_cono').option('readOnly', true) : '';
                    this.attachForm['ter_cono'] ? this.formAttach.instance.getEditor('ter_cono').option('buttons[1].options.visible', true) : '';
                    this.attachForm['ter_cono_o'] ? this.formAttach.instance.getEditor('ter_cono_o').option('readOnly', true) : '';
                    this.attachForm['ter_cono_o'] ? this.formAttach.instance.getEditor('ter_cono_o').option('buttons[1].options.visible', true) : '';
                    this.attachForm['ter_cono_d'] ? this.formAttach.instance.getEditor('ter_cono_d').option('readOnly', true) : '';
                    this.attachForm['ter_cono_d'] ? this.formAttach.instance.getEditor('ter_cono_d').option('buttons[1].options.visible', true) : '';
                    this.attachForm['rad_cori'] ? this.formAttach.instance.getEditor('rad_cori').option('readOnly', true) : '';
                    this.attachForm['rad_cori'] ? this.formAttach.instance.getEditor('rad_cori').option('buttons[1].options.visible', true) : '';
                    this.attachForm['rad_cdes'] ? this.formAttach.instance.getEditor('rad_cdes').option('readOnly', true) : '';
                    this.attachForm['rad_cdes'] ? this.formAttach.instance.getEditor('rad_cdes').option('buttons[1].options.visible', true) : '';
                    this.attachForm['top_cono'] ? this.formAttach.instance.getEditor('top_cono').option('readOnly', true) : '';
                    this.attachForm['top_cono'] ? this.formAttach.instance.getEditor('top_cono').option('buttons[1].options.visible', true) : '';
                    this.attachForm['rad_orig'] ? this.formAttach.instance.getEditor('rad_orig').option('readOnly', true) : '';
                    this.attachForm['rad_orig'] ? this.formAttach.instance.getEditor('rad_orig').option('buttons[1].options.visible', true) : '';
                }, 200);
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al consultar archivos adjuntos.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    async saveAttach() {
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}SetGnRadju`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, this.attachForm).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.responseAttach.emit(true);
                this.showPopup = false;
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al guardar registro de adjuntos.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    async Attachfile() {
        const dataRest: any = {};
        let lrad_llav = '';
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['rad_cont'] = this.attachForm.rad_cont ? this.attachForm.rad_cont : 0;
        dataRest['pro_codi'] = this.mainForm.SubTitle;
        dataRest['rad_tabl'] = this.mainForm.TableName;
        const listKeyData: KeyData[] = JSON.parse(this.mainForm.MetadataPrimaryKey);
        for (const item of listKeyData) {
            lrad_llav += this.dataMaster[item.Name];
        }
        dataRest['rad_llav'] = lrad_llav;
        dataRest['adj_nomb'] = this.fileName;
        dataRest['adj_file'] = this.fileBase64;
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}AddGnAdjun`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //refrescar listado
                this.listAttach();
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al adjuntar archivo.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    async deleteAttachfile() {
        const dataRest: any = {};
        if (!this.itemRowClickDataAttach) {
            this.sharedService.error('Debe seleccionar un archivo adjunto');
            return;
        }
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['rad_cont'] = this.itemRowClickDataAttach['rad_cont'];
        dataRest['adj_cont'] = this.itemRowClickDataAttach['adj_cont'];
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}DeleteGnRadju`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                this.itemRowClickDataAttach = null;
                //refrescar listado
                this.listAttach();
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error al eliminar archivo.');
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    async downloadAttachfile() {
        const dataRest: any = {};
        if (!this.itemRowClickDataAttach) {
            this.sharedService.error('Debe seleccionar un archivo adjunto');
            return;
        }
        if (this.itemRowClickDataAttach['adj_tipo'] === 'URL') {
            this.sharedService.warning('Registro corresponde a URL');
            return;
        }
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['rad_cont'] = this.itemRowClickDataAttach['rad_cont'];
        dataRest['adj_cont'] = this.itemRowClickDataAttach['adj_cont'];
        dataRest['adj_nomb'] = this.itemRowClickDataAttach['adj_nomb'];
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}DownloadGnRadju`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //descargar archivo
                //const dataURI = 'data:image/png;base64,' + resultEvent.Result;
                const dataURI = 'data:text/plain;base64,' + resultEvent.Result;
                FileSaver.saveAs(dataURI, this.itemRowClickDataAttach['adj_nomb']);
                this.itemRowClickDataAttach = null;
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

    async openPopupSearchForeignKey(item: string, where: string) {
        const dataRest: any = {};
        dataRest['emp_codi'] = this.sessionService.session.selectedCompany.code;
        dataRest['field'] = item;
        dataRest['ter_codi'] = 0;
        dataRest['where'] = where;
        if (item === 'rad_cori') {
            this.attachForm['ter_orig'] ? dataRest['ter_codi'] = this.attachForm['ter_orig'] : dataRest['ter_codi'] = -1;
        }
        if (item === 'rad_cdes') {
            this.attachForm['ter_dest'] ? dataRest['ter_codi'] = this.attachForm['ter_dest'] : dataRest['ter_codi'] = -1;
        }
        if (dataRest['ter_codi'] === -1) {
            this.sharedService.error('Debe seleccionar primero el tercero');
            return;
        }
        try {
            this.sharedService.showLoader(true);
            const url = `${this.configService.config.urlWsGnGenerFuncs}GetValueList`;
            const resultEvent: ActionResult = await this.http.post<ActionResult>(url, dataRest).toPromise();
            if (!resultEvent.IsSucessfull) {
                this.sharedService.showLoader(false);
                this.sharedService.error(resultEvent.ErrorMessage);
                return;
            }
            else {
                //asignar resultado
                this.atrrForeignKey = resultEvent.Result[0];
                this.listDataForeignKey = resultEvent.Result[1];
                this.searchTitle = 'Seleccionar ' + this.atrrForeignKey[0];
                this.showPopupForeign = true;
                setTimeout(() => {
                    this.foreignKeyGrid.instance.option('columns', []);
                    if (item === 'top_cono') {
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Tipo Operación', dataField: 'top_cono' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Número', dataField: 'reg_nume' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Fecha', dataField: 'reg_fech' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Proyecto', dataField: 'arb_cpno' });
                    }
                    else if (item === 'rad_orig') {
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Número', dataField: 'val_cont' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Fecha documento', dataField: 'rad_fdoc' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Descripción', dataField: 'rad_desc' });
                    }
                    else {
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Código', dataField: 'val_codi' });
                        this.foreignKeyGrid.instance.addColumn({ caption: 'Nombre', dataField: 'val_nomb' });
                    }
                }, 200);
            }
            this.sharedService.showLoader(false);
        }
        catch (error) {
            setTimeout(() => {
                this.sharedService.error('Error consulta campo: ' + item);
                this.sharedService.showLoader(false);
                return;
            }, 1000);
        }
    }

    onRowClickDataAttach(e) {
        this.itemRowClickDataAttach = { ...e.data };
    }

    onRowClickSearch(e) {
        this.itemRowClickSearch = { ...e.data };
    }

    onRowDblClickSearch(e) {
        this.itemRowClickSearch = { ...e.data };
        this.setForeignKey(this.itemRowClickSearch['field']);
        this.formAttach.instance.getEditor(this.itemRowClickSearch['field']).option('readOnly', true);
        this.formAttach.instance.getEditor(this.itemRowClickSearch['field']).option('buttons[1].options.visible', true);
        this.itemRowClickSearch = null;
    }

    setForeignKey(field: string) {
        const lfields = this.atrrForeignKey[1].split(',');
        this.attachForm[lfields[0]] = this.itemRowClickSearch['val_cont'];
        if (field === 'top_cono') {
            this.attachForm[field] = this.itemRowClickSearch['top_cono'];
            this.attachForm['reg_nume'] = this.itemRowClickSearch['reg_nume'];
            this.attachForm['reg_fech'] = this.itemRowClickSearch['reg_fech'];
            this.attachForm['arb_cpno'] = this.itemRowClickSearch['arb_cpno'];
        }
        else if (field === 'rad_orig') {
            this.attachForm['rad_fdoo'] = this.itemRowClickSearch['rad_fdoc'];
            this.attachForm['rad_deso'] = this.itemRowClickSearch['rad_desc'];
        }
        else {
            this.attachForm[field] = this.itemRowClickSearch['val_codi'] + ' - ' + this.itemRowClickSearch['val_nomb'];
        }
        this.showPopupForeign = false;
    }

    cleanDependencyFields(field: string) {
        field === 'ite_cono_c' ? this.attachForm['ite_cate'] = null : '';
        field === 'ite_cono_g' ? this.attachForm['ite_grup'] = null : '';
        field === 'arb_cono' ? this.attachForm['arb_tipo'] = null : '';
        field === 'ter_cono' ? this.attachForm['ter_codi'] = null : '';
        field === 'ter_cono_o' ? this.attachForm['ter_orig'] = null : '';
        field === 'ter_cono_o' ? this.attachForm['rad_cori'] = null : '';
        field === 'ter_cono_d' ? this.attachForm['ter_dest'] = null : '';
        field === 'ter_cono_d' ? this.attachForm['rad_cdes'] = null : '';
        field === 'rad_cori' ? this.attachForm['rad_cori'] = null : '';
        field === 'rad_cdes' ? this.attachForm['rad_cdes'] = null : '';
        if (field === 'top_cono') {
            this.attachForm['reg_cont'] = null;
            this.attachForm['reg_nume'] = null;
            this.attachForm['reg_fech'] = null;
            this.attachForm['arb_cpno'] = null;
        }
        if (field === 'rad_orig') {
            this.attachForm['rad_fdoo'] = null;
            this.attachForm['rad_deso'] = null;
        }
    }

    searchFK() {
        //Armar QBE        
        switch (this.atrrForeignKey[1].split(',')[0]) {
            case 'ite_cate':
                this.listSearchFKConditions.push({ field: 'ITE_CODI', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'ITE_NOMB', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'ite_grup':
                this.listSearchFKConditions.push({ field: 'ITE_CODI', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'ITE_NOMB', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'arb_tipo':
                this.listSearchFKConditions.push({ field: 'ARB_CODI', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'ARB_NOMB', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'ter_codi':
                this.listSearchFKConditions.push({ field: 'TER_CODA', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'TER_NOCO', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'ter_orig':
                this.listSearchFKConditions.push({ field: 'TER_CODA', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'TER_NOCO', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'ter_dest':
                this.listSearchFKConditions.push({ field: 'TER_CODA', label: 'Código', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'TER_NOCO', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'rad_cori':
                this.listSearchFKConditions.push({ field: 'CON_CODI', label: 'Código', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'CON_NOMB', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'CON_APEL', label: 'Apellido', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'rad_cdes':
                this.listSearchFKConditions.push({ field: 'CON_CODI', label: 'Código', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'CON_NOMB', label: 'Nombre', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'CON_APEL', label: 'Apellido', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'reg_cont':
                this.listSearchFKConditions.push({ field: 'GN_TOPER.TOP_CODI', label: 'Tipo de operación', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'GN_TOPER.TOP_NOMB', label: 'Nombre tipo de operación', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'PY_REGPY.REG_NUME', label: 'Número', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'PY_REGPY.REG_FECH', label: 'Fecha', type: 'D', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'GN_ARBOL.ARB_CODI', label: 'Proyecto', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'GN_ARBOL.ARB_NOMB', label: 'Nombre proyecto', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
            case 'rad_orig':
                this.listSearchFKConditions.push({ field: 'RAD_CONT', label: 'Número', type: 'N', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'RAD_FDOC', label: 'Fecha documento', type: 'D', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'RAD_FREC', label: 'Fecha recibo', type: 'D', operator: '=', value: '', operatorUnion: 'AND' });
                this.listSearchFKConditions.push({ field: 'RAD_DESC', label: 'Descripción', type: 'S', operator: '=', value: '', operatorUnion: 'AND' });
                break;
        }
        this.showPopupSearchFKConditions = true;
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
            this.searchDataForeignKey();
            this.showPopupSearchFKConditions = false;
        }
        else {
            this.showPopupSearchFKConditions = false;            
            this.openPopupSearchForeignKey(this.atrrForeignKey[1].split(',')[1],'');
        }
    }

    searchDataForeignKey(){
        if (this.showPopupSearchFKConditions) {
            let where: string[] = [];
            let j = -1;
            for (let i = 0; i < this.listSearchFKConditions.length; i++) {
                const element = this.listSearchFKConditions[i];
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
                this.openPopupSearchForeignKey(this.atrrForeignKey[1].split(',')[1],where.join('|'));
            }
        }        
    }

    heightScroll = () => {
        return Math.round(window.innerHeight / 1.3);
    }

    popupHeight = () => {
        return Math.round(window.innerHeight / 1.15);
    }

    changeFile(e: any) {
        if (e.target.files && e.target.files.length > 0) {
            let file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (r) => {
                this.fileName = e.target.files[0].name;
                this.fileBase64 = (r as any).target.result;
                this.Attachfile();
                //console.log(this.fileBase64);
            };
            reader.onerror = function (error) {
                //console.log('Error: ', error);
            };
        }
    }

    onContentReady(e: any) {
        setTimeout(() => {
            const gridAttachEl = document.getElementById(this.gridAttachId);
            const popUpAttachEl = document.getElementById(this.popUpAttachId);
            const formAttachEl = document.getElementById(this.formAttachId);
            const popUpForeignKeyEl = document.getElementById(this.popUpForeignKeyId);
            const gridForeignKeyEl = document.getElementById(this.gridForeignKeyId);
            const popUpSearchFKEl = document.getElementById(this.popUpSearchFKId);
            const gridSearchFKEl = document.getElementById(this.gridSearchFKId);

            if (gridAttachEl) {
                this.stylingService.setGridHeaderColorStyle(gridAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpAttachEl) {
                this.stylingService.setTitleColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpForeignKeyEl) {
                this.stylingService.setTitleColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpForeignKeyEl, this.sessionService.session.selectedCompany.theme);
            }
            if (formAttachEl) {
                this.stylingService.setLabelColorStyle(formAttachEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSubTitleColorStyle(formAttachEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridForeignKeyEl) {
                this.stylingService.setGridHeaderColorStyle(gridForeignKeyEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridForeignKeyEl, this.sessionService.session.selectedCompany.theme);
            }
            if (popUpSearchFKEl) {
                this.stylingService.setTitleColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setTitleTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setPrimaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setSecundaryButtonTextColorStyle(popUpSearchFKEl, this.sessionService.session.selectedCompany.theme);
            }
            if (gridSearchFKEl) {
                this.stylingService.setGridHeaderColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
                this.stylingService.setGridHeaderTextColorStyle(gridSearchFKEl, this.sessionService.session.selectedCompany.theme);
            }
        }, 1);
    }
}
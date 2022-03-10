import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { MainFormService } from '../../services/main-form.service';
import { MainForm, ActionResult } from '../../models';
import { confirm } from 'devextreme/ui/dialog';
import { SecurityService } from 'src/app/services/security.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfigService } from 'src/app/services/config.service';
import { RequestResult } from 'src/app/models/request-result';
import { SAVE_ACTION, EDIT_ACTION, DELETE_ACTION, NEW_ICON, FUNC_ICON, METHOD_ICON, TRANSLATE_ICON } from 'src/app/utils/const';
import { ResourceType } from 'src/app/models/permission';
import { MenuGroupItem, Menu, MenuGroup } from 'src/app/models/menu';
import { v4 as uuid } from 'uuid';
import { StylingService } from 'src/app/services/styling.service';
import { SecuritySevenService } from '../../services/security-seven.service';
import { Functions } from 'src/app/models/function';
import { DxFormComponent } from 'devextreme-angular';
import { Method, MethodDef } from 'src/app/models/method';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Translator } from 'src/app/models/translator';

@Component({
  selector: 'app-list-main-form',
  templateUrl: './list-main-form.component.html',
  styleUrls: ['./list-main-form.component.scss']
})
export class ListMainFormComponent implements OnInit {
  formId = uuid();
  gridId = uuid();
  popUpFunctionsId = uuid();
  popUpFunctionsIntId = uuid();
  gridFunctionsId = uuid();
  formFunctionId = uuid();
  popUpMethodId = uuid();
  popUpMethodIntId = uuid();
  gridMethodId = uuid();
  formMethodId = uuid();
  gridMethodParamsInId = uuid();
  gridMethodParamsOutId = uuid();
  popUpTranslateId = uuid();
  gridTranslateId = uuid();
  popUpTranslateTextId = uuid();
  gridTranslateIntId = uuid();
  popUpTranslateIntId = uuid();
  formTranslateId = uuid();
  @ViewChild('formFunction') formFunction: DxFormComponent;
  @ViewChild('formMethod') formMethod: DxFormComponent;
  @ViewChild('tabsParams') tabsParams: NgbTabset;
  @ViewChild('formTranslate') formTranslate: DxFormComponent;
  configToolBar = { add: true };
  listMainForm: MainForm[] = [];
  listPermisions = [];
  listActions: Menu[];
  showPopupFunctions = false;
  showPopupFunctionsInt = false;
  editfunc = false;
  showPopupMethod = false;
  showPopupMethodInt = false;
  showPopupTranslate = false;
  showPopupTranslateText = false;
  showPopupTranslateInt = false;
  editmethod = false;
  edittranslator = false;
  listFunctions: Functions[] = [];
  listMethod: Method[] = [];
  listTranslate: Translator[] = [];
  function: Functions;
  method: Method;
  methodDef: MethodDef;
  translator: Translator;
  seltranslator: Translator;
  translatorDef: any[] = [];
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
          if (this.editfunc) {
            this.editFunction();
          }
          else {
            this.addFunction();
          }
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
          if (this.editmethod) {
            this.editMethod();
          }
          else {
            this.addMethod();
          }
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secondary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.listAllMethods();
          this.showPopupMethodInt = false;
        }
      }
    }
  ];
  toolbarItemsTranslatePopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Cerrar',
        onClick: () => {
          this.showPopupTranslate = false;
        }
      }
    }
  ];
  toolbarItemsTranslateTextPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          if (this.edittranslator && this.translator.TranslatorBase === 'N') {
            this.editTranslate(true);
          }
          else {
            this.showPopupTranslateInt = false;
            this.showPopupTranslateText = false;
          }
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secondary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.listAllTranslate();
          this.showPopupTranslateText = false;
        }
      }
    }
  ];
  toolbarItemsTranslateIntPopup = [
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'primary-button-color' },
        text: 'Aceptar',
        onClick: () => {
          if (this.edittranslator && this.translator.TranslatorBase === 'N') {
            this.editTranslate(false);
          }
          else {
            this.addTranslate();
          }
        }
      }
    },
    {
      ...this.toolbarPopupsConfig,
      options: {
        elementAttr: { class: 'secondary-button-color' },
        text: 'Cancelar',
        onClick: () => {
          this.listAllTranslate();
          this.showPopupTranslateInt = false;
        }
      }
    }
  ];


  constructor(
    public router: Router,
    private sharedService: SharedService,
    private mainFormService: MainFormService,
    private securityService: SecuritySevenService,
    private sessionService: SessionService,
    private configService: ConfigService,
    private stylingService: StylingService
  ) {
    this.function = new Functions();
    this.method = new Method();
    this.methodDef = new MethodDef();
    this.translator = new Translator();
  }

  async ngOnInit() {
    this.sharedService.showLoader(true);
    // const resultPermisions = await this.securityService.getPermisions(this.sessionService.session.accountCode, this.configService.config.designerMicroAppCode, ResourceType.Microapplication).toPromise();
    const resultPermisions = await this.securityService.getPermisions(this.configService.config.designerMicroAppCode).toPromise();
    if (resultPermisions.isSuccessful) {
      this.listPermisions = resultPermisions.result.actions;
    }
    this.setListActionsMain();
    this.listAllMainForms();
  }

  itemClickToolbar(item: MenuGroupItem) {
    if (!item) {
      return;
    }
    switch (item.name) {
      case 'new':
        this.addMainForm();
        break;
      case 'funcs':
        this.listAllFunctions();
        this.showPopupFunctions = true;
        break;
      case 'method':
        this.listAllMethods();
        this.showPopupMethod = true;
        break;
      case 'translate':
        this.listAllTranslate();
        this.showPopupTranslate = true;
        break;
    }
  }

  itemsFunctionToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Nueva', icon: 'fas fa-plus', onClick: () => {
          this.function = new Functions();
          this.editfunc = false;
          this.showPopupFunctionsInt = true;
        }
      }
    }
  ];

  itemsMethodToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Nueva', icon: 'fas fa-plus', onClick: () => {
          this.method = new Method();
          this.methodDef = new MethodDef();
          this.editmethod = false;
          this.showPopupMethodInt = true;
        }
      }
    }
  ];

  itemsTranslateToolbar = [
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Nuevo', icon: 'fas fa-plus', onClick: () => {
          this.translator = new Translator();
          this.edittranslator = false;
          this.showPopupTranslateInt = true;
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Cargar', icon: 'fas fa-upload', onClick: () => {
          this.sharedService.showLoader(true);
          this.loadTextTranslate();
        }
      }
    },
    {
      location: 'before', widget: 'dxButton', options: {
        hint: 'Traducir', icon: 'fas fa-language', onClick: () => {
          this.sharedService.showLoader(true);
          this.translateText(this.seltranslator.Id);
        }
      }
    }
  ];

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

    const menuGroupItemNew = new MenuGroupItem();
    menuGroupItemNew.id = 102;
    menuGroupItemNew.name = 'new';
    menuGroupItemNew.text = 'Nuevo';
    menuGroupItemNew.tooltip = 'Nuevo';
    menuGroupItemNew.icon = NEW_ICON;
    menuGroup.items.push(menuGroupItemNew);

    const menuGroupItemFuncs = new MenuGroupItem();
    menuGroupItemFuncs.id = 104;
    menuGroupItemFuncs.name = 'funcs';
    menuGroupItemFuncs.text = 'Funciones';
    menuGroupItemFuncs.tooltip = 'Funciones';
    menuGroupItemFuncs.icon = FUNC_ICON;
    menuGroup.items.push(menuGroupItemFuncs);

    const menuGroupItemMethod = new MenuGroupItem();
    menuGroupItemMethod.id = 106;
    menuGroupItemMethod.name = 'method';
    menuGroupItemMethod.text = 'Métodos';
    menuGroupItemMethod.tooltip = 'Métodos';
    menuGroupItemMethod.icon = METHOD_ICON;
    menuGroup.items.push(menuGroupItemMethod);

    const menuGroupItemTerms = new MenuGroupItem();
    menuGroupItemTerms.id = 108;
    menuGroupItemTerms.name = 'translate';
    menuGroupItemTerms.text = 'Traducción';
    menuGroupItemTerms.tooltip = 'Traducción';
    menuGroupItemTerms.icon = TRANSLATE_ICON;
    menuGroup.items.push(menuGroupItemTerms);

    menu.groups.push(menuGroup);
    this.listActions.push(menu);
  }

  listAllMainForms() {
    this.mainFormService.listAllMainForm().subscribe((response: ActionResult) => {
      this.listMainForm = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
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
      this.listMethod = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  listAllTranslate() {
    this.mainFormService.listAllTranslate().subscribe((response: ActionResult) => {
      this.listTranslate = response.Result;
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  loadTextTranslate() {
    this.mainFormService.loadTextTranslate().subscribe((response: ActionResult) => {
      response.IsSucessfull ? this.sharedService.success('Diccionario base cargado correctamente') : this.sharedService.error(response.ErrorMessage);
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }

  translateText(id : number) {
    this.mainFormService.translateText(id).subscribe((response: ActionResult) => {
      response.IsSucessfull ? this.sharedService.success('Textos traducidos correctamente') : this.sharedService.error(response.ErrorMessage);
      this.sharedService.showLoader(false);
    }, () => {
      this.sharedService.showLoader(false);
    });
  }  

  addMainForm() {
    if (!this.listPermisions.find(x => x === SAVE_ACTION)) {
      this.sharedService.warning('No tiene permiso para crear');
      return;
    }
    this.router.navigate(['form-designer']);
  }

  deleteMainForm = (e) => {
    if (!this.listPermisions.find(x => x === DELETE_ACTION)) {
      this.sharedService.warning('No tiene permiso para eliminar');
      return;
    }
    try {
      const result = confirm('Esta seguro de eliminar el registro', 'Confirmación');
      result.then((confirmResult) => {
        if (confirmResult) {
          this.sharedService.showLoader(true);
          this.mainFormService.deleteMainForm(e.row.data.Id).subscribe((response: ActionResult) => {
            if (response.IsSucessfull) {
              this.sharedService.success('Registro eliminado correctamente');
              this.listAllMainForms();
            } else if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
            } else {
              this.sharedService.error(response.Messages);
            }
            this.sharedService.showLoader(false);
          });
        }
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  deleteFunction = (e) => {
    try {
      const result = confirm('Esta seguro de eliminar la función', 'Confirmación');
      result.then((confirmResult) => {
        if (confirmResult) {
          this.sharedService.showLoader(true);
          this.mainFormService.deleteFunction(e.row.data.Id).subscribe((response: ActionResult) => {
            if (response.IsSucessfull) {
              this.sharedService.success('Función eliminada correctamente');
              this.listAllFunctions();
            } else if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
            } else {
              this.sharedService.error(response.Messages);
            }
            this.sharedService.showLoader(false);
          });
        }
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  deleteMethod = (e) => {
    try {
      const result = confirm('Esta seguro de eliminar el método', 'Confirmación');
      result.then((confirmResult) => {
        if (confirmResult) {
          this.sharedService.showLoader(true);
          this.mainFormService.deleteMethod(e.row.data.Id).subscribe((response: ActionResult) => {
            if (response.IsSucessfull) {
              this.sharedService.success('Método eliminado correctamente');
              this.listAllMethods();
            } else if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
            } else {
              this.sharedService.error(response.Messages);
            }
            this.sharedService.showLoader(false);
          });
        }
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  deleteTranslate = (e) => {
    try {
      const result = confirm('Esta seguro de eliminar el diccionario', 'Confirmación');
      result.then((confirmResult) => {
        if (confirmResult) {
          this.sharedService.showLoader(true);
          this.mainFormService.deleteTranslator(e.row.data.Id).subscribe((response: ActionResult) => {
            if (response.IsSucessfull) {
              this.sharedService.success('Diccionario eliminado correctamente');
              this.listAllTranslate();
            } else if (response.IsError) {
              this.sharedService.error(response.ErrorMessage);
            } else {
              this.sharedService.error(response.Messages);
            }
            this.sharedService.showLoader(false);
          });
        }
      }, () => {
        this.sharedService.error('Ocurrio un error inesperado');
        this.sharedService.showLoader(false);
      });
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  editMainFormclick = (e: any) => {
    this.editMainForm(e.row.data.Id);
  }

  editFunctionclick = (e: any) => {
    this.function = e.row.data;
    this.editfunc = true;
    this.showPopupFunctionsInt = true;
  }

  editMethodclick = (e: any) => {
    this.method = e.row.data;
    this.methodDef = JSON.parse(this.method.MethodBody);
    this.editmethod = true;
    this.showPopupMethodInt = true;
  }

  editTranslateclick = (e: any) => {
    this.translator = e.row.data;
    this.translatorDef = JSON.parse(this.translator.TranslatorBody);
    this.edittranslator = true;
    this.showPopupTranslateInt = true;
  }

  editMainForm(id: any) {
    if (!this.listPermisions.find(x => x === EDIT_ACTION)) {
      this.sharedService.warning('No tiene permiso para editar');
      return;
    }
    this.router.navigate(['edit-form-designer'], {
      queryParams: {
        pId: id
      }
    });
  }

  gridHeight = () => {
    return Math.round(window.innerHeight / 1.3);
  }

  popupHeight = () => {
    return Math.round(window.innerHeight / 1.4);
  }

  popupHeightInt = () => {
    return Math.round(window.innerHeight / 2.3);
  }

  gridHeightRest = () => {
    return Math.round(window.innerHeight / 3);
  }

  gridHeightTrans = () => {
    return Math.round(window.innerHeight / 2);
  }

  onRowDblClick(e: any) {
    this.editMainForm(e.data.Id);
  }

  onRowFunctionDblClick(e: any) {
    this.function = e.data;
    this.editfunc = true;
    this.showPopupFunctionsInt = true;
  }

  onRowMethodDblClick(e: any) {
    this.method = e.data;
    this.methodDef = JSON.parse(this.method.MethodBody);
    this.editmethod = true;
    this.showPopupMethodInt = true;
  }

  onRowTranslateDblClick(e: any) {
    this.translator = e.data;
    this.translator.TranslatorBody ? this.translatorDef = JSON.parse(this.translator.TranslatorBody) : this.translatorDef = [];
    this.edittranslator = true;
    this.showPopupTranslateText = true;
  }

  onRowTranslateClick(e: any){
    this.seltranslator = e.data;
  }

  onToolbarPreparingParamsIn(e) {
    // e.toolbarOptions.items.push({
    //   location: 'center',
    //   locateInMenu: 'never',
    //   template: () => {
    //     return `<div class=\'toolbar-label\'><b>Parametros entrada</b></div>`;
    //   }
    // });
  }

  onToolbarPreparingParamsOut(e) {
    // e.toolbarOptions.items.push({
    //   location: 'center',
    //   locateInMenu: 'never',
    //   template: () => {
    //     return `<div class=\'toolbar-label\'><b>Parametros salida</b></div>`;
    //   }
    // });
  }

  errorRowEnabledChange(e) {
    if (e.error.message.split(' - ')[0] === 'E4008') {
      e.error.message = 'Clave Duplicada';
    }
  }

  addFunction() {
    try {
      if (!this.formFunction.instance.validate().isValid) {
        return;
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      this.mainFormService.saveFunction(this.function).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Función insertada correctamente');
          this.showPopupFunctionsInt = false;
          this.editfunc = false;
          this.listAllFunctions();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  editFunction() {
    try {
      if (!this.formFunction.instance.validate().isValid) {
        return;
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      this.mainFormService.updateFunction(this.function).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Función actualizada correctamente');
          this.showPopupFunctionsInt = false;
          this.editfunc = false;
          this.listAllFunctions();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  addMethod() {
    try {
      if (!this.formMethod.instance.validate().isValid) {
        return;
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      this.method.MethodCode = this.methodDef.code;
      this.method.MethodDesc = this.methodDef.description;
      this.method.MethodBody = JSON.stringify(this.methodDef);
      this.mainFormService.saveMethod(this.method).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Método insertado correctamente');
          this.showPopupMethodInt = false;
          this.editmethod = false;
          this.listAllMethods();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  editMethod() {
    try {
      if (!this.formMethod.instance.validate().isValid) {
        return;
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      this.method.MethodCode = this.methodDef.code;
      this.method.MethodDesc = this.methodDef.description;
      this.method.MethodBody = JSON.stringify(this.methodDef);
      this.mainFormService.updateMethod(this.method).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Método actualizado correctamente');
          this.showPopupMethodInt = false;
          this.editmethod = false;
          this.listAllMethods();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  onInitNewRowIn(e) {
    e.data.id = this.methodDef.paramsIn.length + 1;
  }

  onInitNewRowOut(e) {
    e.data.id = this.methodDef.paramsOut.length + 1;
  }

  onInitNewRowTra(e) {
    e.data.id = this.translatorDef.length + 1;
  }  

  addTranslate() {
    try {
      if (!this.formTranslate.instance.validate().isValid) {
        return;
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      this.translator.TranslatorBody = null;
      this.mainFormService.saveTranslator(this.translator).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Diccionario insertado correctamente');
          this.showPopupTranslateInt = false;
          this.edittranslator = false;
          this.listAllTranslate();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  editTranslate(p_texto: boolean) {
    try {
      if (!p_texto) {
        if (!this.formTranslate.instance.validate().isValid) {
          return;
        }
      }
      //consumo metodo
      this.sharedService.showLoader(true);
      p_texto ? this.translator.TranslatorBody = JSON.stringify(this.translatorDef) : this.translator.TranslatorBody = null;
      this.mainFormService.updateTranslator(this.translator).subscribe((response: ActionResult) => {
        if (response.IsSucessfull) {
          this.sharedService.success('Diccionario actualizado correctamente');
          this.showPopupTranslateInt = false;
          this.showPopupTranslateText = false;
          this.edittranslator = false;
          this.listAllTranslate();
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
    } catch (error) {
      this.sharedService.error('Ocurrio un error inesperado');
      this.sharedService.showLoader(false);
    }
  }

  onContentReady(e: any) {
    setTimeout(() => {
      const gridEl = document.getElementById(this.gridId);
      const formEl = document.getElementById(this.formId);
      const popUpFunctionsEl = document.getElementById(this.popUpFunctionsId);
      const popUpFunctionsIntEl = document.getElementById(this.popUpFunctionsIntId);
      const gridFunctionsEl = document.getElementById(this.gridFunctionsId);
      const formFunctionEl = document.getElementById(this.formFunctionId);
      const popUpMethodEl = document.getElementById(this.popUpMethodId);
      const popUpMethodIntEl = document.getElementById(this.popUpMethodIntId);
      const gridMethodEl = document.getElementById(this.gridMethodId);
      const formMethodEl = document.getElementById(this.formMethodId);
      const gridMethodParamsInEl = document.getElementById(this.gridMethodParamsInId);
      const gridMethodParamsOutEl = document.getElementById(this.gridMethodParamsOutId);
      const popUpTranslateEl = document.getElementById(this.popUpTranslateId);
      const gridTranslateEl = document.getElementById(this.gridTranslateId);
      const popUpTranslateTextEl = document.getElementById(this.popUpTranslateTextId);
      const gridTranslateIntEl = document.getElementById(this.gridTranslateIntId);
      const popUpTranslateIntEl = document.getElementById(this.popUpTranslateIntId);
      const formTranslateEl = document.getElementById(this.formTranslateId);

      if (formEl) {
        this.stylingService.setLabelColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridEl) {
        this.stylingService.setGridHeaderColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridEl, this.sessionService.session.selectedCompany.theme);
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
      if (formFunctionEl) {
        this.stylingService.setLabelColorStyle(formFunctionEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formFunctionEl, this.sessionService.session.selectedCompany.theme);
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
        this.stylingService.setTitleColorStyle(popUpMethodIntEl, this.sessionService.session.selectedCompany.theme);
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
      if (formMethodEl) {
        this.stylingService.setLabelColorStyle(formMethodEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formMethodEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMethodParamsInEl) {
        this.stylingService.setGridHeaderColorStyle(gridMethodParamsInEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMethodParamsInEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridMethodParamsOutEl) {
        this.stylingService.setGridHeaderColorStyle(gridMethodParamsOutEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridMethodParamsOutEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpTranslateEl) {
        this.stylingService.setTitleColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpTranslateEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridTranslateEl) {
        this.stylingService.setGridHeaderColorStyle(gridTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridTranslateEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpTranslateTextEl) {
        this.stylingService.setTitleColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpTranslateTextEl, this.sessionService.session.selectedCompany.theme);
      }
      if (gridTranslateIntEl) {
        this.stylingService.setGridHeaderColorStyle(gridTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setGridHeaderTextColorStyle(gridTranslateIntEl, this.sessionService.session.selectedCompany.theme);
      }
      if (popUpTranslateIntEl) {
        this.stylingService.setTitleColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setTitleTextColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setPrimaryButtonTextColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSecundaryButtonTextColorStyle(popUpTranslateIntEl, this.sessionService.session.selectedCompany.theme);
      }
      if (formTranslateEl) {
        this.stylingService.setLabelColorStyle(formTranslateEl, this.sessionService.session.selectedCompany.theme);
        this.stylingService.setSubTitleColorStyle(formTranslateEl, this.sessionService.session.selectedCompany.theme);
      }
    }, 1);
  }

}

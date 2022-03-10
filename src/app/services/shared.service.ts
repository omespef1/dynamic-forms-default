import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import { alert } from 'devextreme/ui/dialog';
import { HttpParams } from '@angular/common/http';
import { Company } from '../models/session';
import { SessionService } from './session.service';
import {RequestResult} from '../models/request-result';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public companyChanged: BehaviorSubject<Company> = new BehaviorSubject<Company>(null);
  public loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public successNotification: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public errorNotification: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public warningNotification: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public infoNotification: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public hideNotification: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public getListMasterDetail: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public getListItemsForm: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public subMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public logout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private sesionService: SessionService
  ) {

  }

  changeCompany(company: Company) {
    this.sesionService.session = { ...this.sesionService.session, selectedCompany: company };
    this.companyChanged.next(company);
  }

  showLoader(valor: boolean) {
    return this.loader.next(valor);
  }

  hide() {
    this.hideNotification.next(null);
  }

  getMenu() {
    this.subMenu.next(true);
  }

  runLogout() {
    this.logout.next(true);
  }

  success(message: any) {
    this.successNotification.next(message);
  }

  error(message: any) {
    this.errorNotification.next(message);
  }

  warning(message: any) {
    this.warningNotification.next(message);
  }

  info(message: any) {
    this.infoNotification.next(message);
  }

  setListMasterDetails(list: any[]) {
    this.getListMasterDetail.next(list);
  }

  setListItemsForm(list: any[]) {
    this.getListItemsForm.next(list);
  }

  public getParams(params: any) {
    return Object.getOwnPropertyNames(params)
      .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }

  async confirm(message: string = 'Esta seguro de eliminar el registro'): Promise<boolean> {
    const c = await confirm(message, 'Confirmación');
    return c;
  }

  async confirmMessage(message: string, title : string): Promise<boolean> {
    const c = await confirm(message, title);
    return c;
  }  

  async alertMessage(message: string, title : string): Promise<void> {
    const c = await alert(message, title);
    return c;
  }  

  confirmCallback(message: string = 'Esta seguro de eliminar el registro', callBackFunction: any): void {
    const result = confirm(message, 'Confirmación');
    result.then((c) => {
      if (c) {
        callBackFunction();
      }
    });
  }

  resolveRequestResult(request: RequestResult<any>) {
    const response = {
      result: null,
      error: null
    };
    if (request.isSuccessful) {
      response.result = request.result;
    } else if (request.isError) {
      response.error = request.errorMessage;
    } else {
      response.error = request.messages.join(',');
    }
    return response;
  }
  

}

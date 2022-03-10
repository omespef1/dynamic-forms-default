import { Injectable } from '@angular/core';
import { MainForm } from '../models/main-form';
import { Connection } from '../models/connection';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { ActionResult } from '../models/action-result';
import { ConfigService } from './config.service';
import { Functions } from '../models/function';
import { Method } from '../models/method';
import { Translator } from '../models/translator';

@Injectable({
  providedIn: 'root'
})
export class MainFormService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private configService: ConfigService) {

  }

  saveMainForm(param: MainForm): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/save`, param);
  }

  saveFunction(param: Functions): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}function/save`, param);
  }  

  saveMethod(param: Method): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}method/save`, param);
  }    

  saveTranslator(param: Translator): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/save`, param);
  }      

  updateMainForm(param: MainForm): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/update`, param);
  }

  updateFunction(param: Functions): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}function/update`, param);
  }

  updateMethod(param: Method): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}method/update`, param);
  }

  updateTranslator(param: Translator): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/update`, param);
  }  

  deleteMainForm(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/delete`, { params: this.sharedService.getParams({ id }) });
  }

  deleteFunction(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}function/delete`, { params: this.sharedService.getParams({ id }) });
  }

  deleteMethod(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}method/delete`, { params: this.sharedService.getParams({ id }) });
  }  

  deleteTranslator(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/delete`, { params: this.sharedService.getParams({ id }) });
  }    

  getMainFormById(id: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/getById`, { params: this.sharedService.getParams({ id }) });
  }

  getMainFormByProgramCode(program: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/getByProgramCode`, { params: this.sharedService.getParams({ program }) });
  }

  listAllMainForm(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/listAll`);
  }

  listAllFunction(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}function/listAll`);
  }  

  listAllMethod(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}method/listAll`);
  }    

  listAllTranslate(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/listAll`);
  }

  loadTextTranslate(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/loadText`);
  }  

  translateText(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}translator/translateText`, { params: this.sharedService.getParams({ id }) });
  }    

  listByIdsMainForm(ids: number[]): Observable<ActionResult> {
    const params = [];
    for (const item of ids) {
      params.push(`listIds=${item}`);
    }
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/listById?${params.join('&')}`);
  }

  listTables(connectionId: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/getTables`, { params: this.sharedService.getParams({ connectionId }) });
  }

  listColumns(connectionId: number, tableName: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/GetColunmsTable`, { params: this.sharedService.getParams({ connectionId, tableName }) });
  }

  getMainFormByTableName(connectionId: number, tableName: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/GetMainFormByTableName`, { params: this.sharedService.getParams({ connectionId, tableName }) });
  }

  listAllColumnsSelectedTable(connectionId: number, tableName: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/GetAllColunmsInSelectedTable`, { params: this.sharedService.getParams({ connectionId, tableName }) });
  }

  listTablesMasterDetail(connectionId: number, tableName: string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}mainForm/ListTablesMasterDetail`, { params: this.sharedService.getParams({ connectionId, tableName }) });
  }

  saveConnection(param: Connection): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}connection/save`, param);
  }

  updateConnection(param: Connection): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}connection/update`, param);
  }

  deleteConnection(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}connection/delete`, { params: this.sharedService.getParams({ id }) });
  }

  getConnectionById(id: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}connection/getById`, { params: this.sharedService.getParams({ id }) });
  }

  listAllConnection(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}connection/listAll`);
  }

  listPatterns(): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteCoreApiV1}PatternSequence/GetAll`);
  }

  listAllLibraries(company: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteCoreApiV1}DMS/GetAllLibraries`, { params: this.sharedService.getParams({ company }) });
  }

  listSubMenu(parentId: number): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteSecurityApiV1}MenuItem/GetSubMenuByParentId`, { params: this.sharedService.getParams({ parentId }) });
  }

  saveSubMenu(subMenu: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteSecurityApiV1}MenuItem/SaveMenuDynamic`, subMenu);
  }

  listRules() {
    return this.http.get(`${this.configService.config.opheliaSuiteBRMApiV2}rule/Getbasicinfo`);
  }

  listRuleParams(code: string) {
    return this.http.get(`${this.configService.config.opheliaSuiteBRMApiV2}rule/GetParameters`, { params: this.sharedService.getParams({ code }) });
  }

  getConcodi(pEmp_codi : string, pCon_tabl : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsConseTransaction}GetConcodi?pEmp_codi=${pEmp_codi}&pCon_tabl=${pCon_tabl}`);
  }

  getMaxConse(pEmp_codi : string, pCon_tabl : string, pCon_camp : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsConseTransaction}GetMaxConse?pEmp_codi=${pEmp_codi}&pCon_tabl=${pCon_tabl}&pCon_camp=${pCon_camp}`);
  }  

  getMaxConseDet(pEmp_codi : string, pConsecut : string, pCon_tabl : string, pCon_camm : string, pCon_camd : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsConseTransaction}GetMaxConseDet?pEmp_codi=${pEmp_codi}&pConsecut=${pConsecut}&pCon_tabl=${pCon_tabl}&pCon_camm=${pCon_camm}&pCon_camd=${pCon_camd}`);
  }    

  getDtoVer(pTip_codi : number, pVal_codi : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetDtoVer?pTip_codi=${pTip_codi}&pVal_codi=${pVal_codi}`);
  }

  getCalcPos(pEmp_codi, pVal_con1, pVal_con2 : number,  pTable : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetCalcPos?pEmp_codi=${pEmp_codi}&pVal_con1=${pVal_con1}&pVal_con2=${pVal_con2}&pTable=${pTable}`);
  }  

  CopyDistrib(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}CopyDistrib`, param);
  }  

  DeleteDistrib(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}DeleteDistrib`, param);
  }    

  CalcularDoc(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}CalcularDoc`, param);
  }

  CalcularTot(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}CalcularTot`, param);
  }  

  getRootNodes(pEmp_codi, pTar_codi : number, pTable : string, pCam_movi : string, pTab_nive : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetRootNodes?pEmp_codi=${pEmp_codi}&pTar_codi=${pTar_codi}&pTable=${pTable}&pCam_movi=${pCam_movi}&pTab_nive=${pTab_nive}`);
  } 

  getChildrenNodes(pEmp_codi, pTar_codi : number, pParentCode : string, pTable : string, pCam_movi : string, pTab_nive : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetChildrenNodes?pEmp_codi=${pEmp_codi}&pTar_codi=${pTar_codi}&pParentCode=${pParentCode}&pTable=${pTable}&pCam_movi=${pCam_movi}&pTab_nive=${pTab_nive}`);
  }

  getSearchNodes(pEmp_codi, pTar_codi : number, pTable : string, pFrom : string, pWhere : string, pCam_movi : string, pTab_nive : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetSearchNodes?pEmp_codi=${pEmp_codi}&pTar_codi=${pTar_codi}&pTable=${pTable}&pFrom=${pFrom}&pWhere=${pWhere}&pCam_movi=${pCam_movi}&pTab_nive=${pTab_nive}`);
  }     

  getValidateTree(pEmp_codi, pTar_codi : number, pTable : string, pCam_movi : string, pTab_nive : string, pVal_nive : number, pVal_codi : string, pVal_padr : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetValidateTree?pEmp_codi=${pEmp_codi}&pTar_codi=${pTar_codi}&pTable=${pTable}
      &pCam_movi=${pCam_movi}&pTab_nive=${pTab_nive}&pVal_nive=${pVal_nive}&pVal_codi=${pVal_codi}&pVal_padr=${pVal_padr}`);
  }   

  getValBloMes(pEmp_codi, pMod_inic : string, pMvto_fech : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetValBloMes?pEmp_codi=${pEmp_codi}&pMod_inic=${pMod_inic}&pMvto_fech=${pMvto_fech}`);
  }  

  getValTipOpe(pEmp_codi, pTop_codi : number, pMod_inic : string, pUsu_codi : string, pPro_codi : string): Observable<ActionResult> {
    return this.http.get<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}GetValTipOpe?pEmp_codi=${pEmp_codi}&pTop_codi=${pTop_codi}&pMod_inic=${pMod_inic}&pUsu_codi=${pUsu_codi}&pPro_codi=${pPro_codi}`);
  }

  ExecFunction(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}ExecFunction`, param);
  }

  ExecMethod(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}ExecMethod`, param);
  }  

  ValidateQuery(param: any): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.configService.config.urlWsGnGenerFuncs}ValidateQuery`, param);
  }
}

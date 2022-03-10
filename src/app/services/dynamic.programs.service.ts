import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionResult } from '../models';
import { ConfigService } from './config.service';
import { SharedService } from './shared.service';


@Injectable({
    providedIn: 'root'
})
export class DynamicProgramsService {
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private sharedService: SharedService) {
    }

    public async getParamByCode(): Promise<ActionResult> {
        const res = await this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteSecurityApiV1}Config/GetParameter'`).toPromise();
        return res;
    }

    saveData(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/save`, param);
    }

    saveDataMassive(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/dynamicSaveMassive`, param);
    }

    updateData(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/update`, param);
    }

    updateDataMassive(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/updateMassive`, param);
    }

    deleteData(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/delete`, param);
    }

    listAllData(mainFormId: number) {
        return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/listAll`, { params: this.sharedService.getParams({ mainFormId }) });
    }

    listAllDataReport(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/ListAllReport`, param, { responseType: 'blob' });
    }

    getNumericSequence(id: number) {
        return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteCoreApiV1}NumericSequence/GetNextSequence`, { params: this.sharedService.getParams({ id }) });
    }

    listDataForeignKey(param: any) {
        return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/listDataForeignKey`, param);
    }

    listData(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/listData`, param);
    }

    listDataFixedDataSource(param: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/listDataFixedDataSource`, param);
    }

    listDataFixedDataSourceO(param: any): Observable<ActionResult> {
        return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/listDataFixedDataSource`, param);
    }    

    getItemDataForeignKey(param: any): Observable<ActionResult> {
        return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/getItemDataForeignKey`, param);
    }

    getByPrimaryKey(param: any): Observable<ActionResult> {
        return this.http.post<ActionResult>(`${this.configService.config.opheliaSuiteDynamicFormApiV1}processForm/getByPrimaryKey`, param);
    }

    getDocument(company: number, libraryId: number, fileId: string) {
        return this.http.get<ActionResult>(`${this.configService.config.opheliaSuiteCoreApiV1}Upload/GetDocument`, { params: this.sharedService.getParams({ company, libraryId, fileId }) });
    }

    executeRule(rule: any) {
        return this.http.post(`${this.configService.config.opheliaSuiteBRMApiV2}BRM/ExecuteRule`, rule);
    }
}

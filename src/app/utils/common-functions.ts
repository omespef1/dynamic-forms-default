import { Injectable } from '@angular/core';
import { SharedService } from '../services/shared.service';
import moment from 'moment';
import 'moment/min/locales';
import { SessionService } from '../services/session.service';

@Injectable()
export class CommonFunctions {

    constructor(private sessionService: SessionService) {

    }

    public getDate() {
        return moment().locale('es-CO').format('YYYY-MM-DDTHH:mm:ss');
    }

    public getUserCode() {
        return this.sessionService.session.accountCode;
    }

    public getUserName() {
        return this.sessionService.session.displayName;    
    }

    public getCompany() {
        return this.sessionService.session.selectedCompany.code;
    }
    
    public getYear(){
        return moment().locale('es-CO').format('YYYY');
    }

    public getMonth(){
        return moment().locale('es-CO').format('MM');
    }    

    public getDay(){
        return moment().locale('es-CO').format('DD');
    }        
}

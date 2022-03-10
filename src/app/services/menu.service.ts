import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { ActionResult } from '../models';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private data: any;
    constructor(private http: HttpClient, private configService: ConfigService) {

    }

    getMenu(data): Promise<ActionResult> {
        const json = this.http.get<ActionResult>(this.configService.config.opheliaSuiteSecurityApiV1 + 'MenuItem/GetMenuByParentIdDynamicForms', { params: { ...data } }).toPromise();
        return json;
    }
}

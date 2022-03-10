import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { ActionResult } from '../models';
import { ConfigService } from './config.service';
import { RequestResult } from '../models/request-result';
import { Permission, ResourceType } from '../models/permission';
import { Session } from '../models/session';
import { GlobalVariables } from '../models/globalvariables';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public validateSessionTokenRedirect(token: string) {
    return this.http.get<RequestResult<Session>>(`${this.configService.config.urlSSBApi}session/validateToken?token=${token}`);
  }

  public getPermisions(accountCode: string, resourceCode: string, resourceType: ResourceType) {
    return this.http.get<RequestResult<Permission>>(`${this.configService.config.urlSSBApi}permission/getByAccountResource?accountCode=${accountCode}&resourceCode=${resourceCode}&resourceType=${resourceType}`);
  }

  public getParameterValueByCode(code: string) {
    return this.http.get(`${this.configService.config.urlSSBApi}Parameter/GetValue?code=${code}`);
  }

  public getGlobalVariables() {
    return this.http.get(`${this.configService.config.urlSSBApi}GlobalVariable/GetAll`);
  }  

}

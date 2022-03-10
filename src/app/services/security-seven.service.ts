import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActionResult } from '../models';
import { ConfigService } from './config.service';
import { RequestResult } from '../models/request-result';
import { Permission, ResourceType } from '../models/permission';
import { Session } from '../models/session';
import { GlobalVariables } from '../models/globalvariables';


@Injectable({
  providedIn: 'root'
})
export class SecuritySevenService {

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public validateSessionTokenRedirect(token: string) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<RequestResult<Session>>(`${this.configService.config.urlSecuritySeven}user`, { headers: httpHeaders});
  }

  public getPermisions(formCode:string) {
    return this.http.get<RequestResult<Permission>>(`${this.configService.config.urlSecuritySeven}permissions?formCode=${formCode}`);
  }

  public getParameterValueByCode(code: string) {
    return this.http.get(`${this.configService.config.urlSSBApi}Parameter/GetValue?code=${code}`);
  }

  public getGlobalVariables() {
    return this.http.get(`${this.configService.config.urlSSBApi}GlobalVariable/GetAll`);
  }  

}

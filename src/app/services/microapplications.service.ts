import { Injectable, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResultPrometheus } from '../models/action-result';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class MicroapplicationsService {

  constructor(private http:HttpClient,private configService:ConfigService,
    private sharedService:SharedService) { }



  getMicroApplicationByFormCode(formCode:any){
    return this.http.get<ResultPrometheus<any>>(`${this.configService.config.urlMicroApplications}/MicroApplications/GetByFormCode?CodeForm=${formCode}`)
    .pipe(map(resp=>{
      if(!resp.isSuccessful)
        this.sharedService.error(resp.errorMessage);
       return resp.result;
    }))
  }
}

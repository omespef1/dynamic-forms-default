import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { MainModel } from "../models/main-model";
import { HttpClient } from '@angular/common/http';
import { ResultPrometheus } from "../models/action-result";
import { catchError, finalize, map } from "rxjs/operators";
import { SharedService } from './shared.service';
import { ConfigService } from './config.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MainMenuService {

  isLoadingSubject: BehaviorSubject<boolean>;
  main: BehaviorSubject<MainModel[]> = new BehaviorSubject<MainModel[]>([]);
  constructor(private configService: ConfigService,private http:HttpClient ,
    private sharedService:SharedService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
  }


  private get(code): Observable<ResultPrometheus<MainModel[]>> {
    return this.http.get<ResultPrometheus<MainModel[]>>(`${this.configService.config.urlMainMenuSeven}/main?code=${code}`);
  }

  private getFilter(code): Observable<ResultPrometheus<MainModel[]>> {
    return this.http.get<ResultPrometheus<MainModel[]>>(`${this.configService.config.urlMainMenuSeven}/MainFilter?Filter=${code}`);
  }

   updateMainApplicationId(sevenCodeMain: string,microApplicationId:any){
    return this.http.get<ResultPrometheus<string>>(`${this.configService.config.urlMainMenuSeven}/GN_MENUS/Update?id=${sevenCodeMain}&microApplicationId=${microApplicationId}`)
    .pipe(map(resp=>{
        if(resp.isSuccessful){         
          this.sharedService.success('Menú configurado!');
          //this.notificationService.success('Hecho!');
        }
        if(!resp.isSuccessful){
         this.sharedService.error('Error configurando menú');
        }
    }))
  }

  getMainMenu(code:any){
    return this.http.get<ResultPrometheus<MainModel>>(`${this.configService.config.urlMainMenuSeven}/main/code?code=${code}`)
    .pipe(map(resp=>{
      if(!resp.isSuccessful)
      this.sharedService.error(`Error consultando microaplicación : ${resp.errorMessage}`);
     return resp.result;
    }))
  }




  loadMenu(code: string): Observable<MainModel[]> {
    this.isLoadingSubject.next(true);
    return this.get(code).pipe(
      catchError(err => of(this.sharedService.error("Error conectando con el proveedor de menú"))),
      map((resp: ResultPrometheus<MainModel[]>) => {     
        return resp.result;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  loadMenuFilter(code: string): Observable<MainModel[]> {
    this.isLoadingSubject.next(true);
    return this.getFilter(code).pipe(
      catchError(err => of(this.sharedService.error("Error conectando con el proveedor de menú"))),
      map((resp: ResultPrometheus<MainModel[]>) => {  
        this.main.next(resp.result); 
        this.isLoadingSubject.next(false); 
        return resp.result;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}

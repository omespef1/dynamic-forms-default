import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';
import { SessionService } from '../services/session.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private sharedService: SharedService,
        private sessionService: SessionService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({ headers: request.headers.set('OPHJsonNamingStrategy', `camelcase`) });
        request = request.clone({ headers: request.headers.set('__Language__', `es-CO`) });      
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
        if (this.sessionService.session) {                        
            if (!request.headers.has('Authorization')){
                request = request.clone({ headers: request.headers.set('Authorization', `${this.sessionService.session.token}`) });
            }            
           // request = request.clone({ headers: request.headers.set('Authorization', `OpheliaSuite ${this.sessionService.session.token}`) });
            request = request.clone({
                headers: request.headers.set('_AUDITMESSAGE_HEADER_', btoa(`{ UserCode: '${this.sessionService.session.accountCode}', RoleCode: '${this.sessionService.session.roleCode}' }`))
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.sharedService.error(error.error.Message);
                    setTimeout(() => {
                        this.sharedService.runLogout();
                    }, 1000);
                }
                return throwError(error);
            }));
    }
}

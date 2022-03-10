import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/models/session';
import { SecuritySevenService } from '../../services/security-seven.service';
import globalConfig from "devextreme/core/config"
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private securityService: SecuritySevenService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {   

    this.sessionService.clean();
    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (!params.token || !params.mode) {
        this.sharedService.showLoader(false);
        this.sharedService.error('Los parametros son inválidos');
        return;
      }
      if (params.mode === 'edit') {
        if (!params.recordId || !params.formCode) {
          this.sharedService.showLoader(false);
          this.sharedService.error('Los parámetros para editar son inválidos, se necesita el id del registro y el código del formulario');
          return;
        }
      }
      const redirectTo = params.mode === 'start' ? '' : params.mode === 'designer' ? 'list-forms' : 'form-view';
      try {
        // se consulta si el token es valido
        const response: any = await this.securityService.validateSessionTokenRedirect(params.token).toPromise();
        if (response.isSuccessful) {     
          // El token fue exitoso, por tanto lo almacena en la sesión
          response.result.token = params.token;
          // se establcece la sesion
          this.sessionService.session = response.result;
          // se configurala url para redireccionar
          if (redirectTo.length === 0) {
            this.sharedService.showLoader(false);
            this.router.navigate(['/']);
          } else {
            const paramsRedirect = [];
            for (const item of Object.keys(params)) {
              if (item === 'token') {
                continue;
              }
              if (params[item] === 'designer') {
                continue;
              }
              paramsRedirect.push(`${item}=${params[item]}`);
            }
            const urlRedirect = paramsRedirect.length > 0 ? `${redirectTo}?${paramsRedirect.join('&')}` : `${redirectTo}`;
            // se redirecciona a la url conformada
            this.sharedService.showLoader(false);

            setTimeout(() => {
              this.router.navigateByUrl(urlRedirect);
            }, 0);
          }

        } else if (response.isError) {
          this.sharedService.showLoader(false);
          this.sharedService.error(response.errorMessage);
        } else {
          this.sharedService.showLoader(false);
          this.sharedService.error(response.messages);
          this.sessionService.clean();
          setTimeout(() => {
            this.sharedService.runLogout();
          }, 1000);
        }
      } catch (error) {
        this.sharedService.showLoader(false);
      }
    });
  }
}

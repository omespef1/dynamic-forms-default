import { Component, ViewChild, OnInit } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { SharedService } from './services/shared.service';
import { DxToastComponent } from 'devextreme-angular/ui/toast';
import devexpressConfig from 'devextreme/core/config';
import { SessionService } from './services/session.service';
import { ConfigService } from './services/config.service';
import DevExpress from 'devextreme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(DxToastComponent) notifyComponent: DxToastComponent;
  notificationText = '';
  showPopup = false;
  showLoader: boolean;
  showMenu = false;
  toastOptions = {
    message: '',
    position: { my: 'center center', at: 'center center', of: '#mainContainer', offset: '0 -25' },
    type: '',
    displayTime: 3000,
    closeOnClick: true,
    onHiding: (e: any) => {
      e.element.onclick = () => {
        this.showPopup = true;
      };
    }
  };
  session: any;

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private configService: ConfigService) {
    this.setSession(this.sessionService.session);
    devexpressConfig({
      defaultCurrency: 'COP'
    });
  }

  setSession(session: any) {
    if (!session) {
      return;
    }
    this.session = session;
  }

  setIframeEventsHandler() {
    window.addEventListener('message', (e) => {
      if (e.data.eventName) {
        switch (e.data.eventName) {
          case 'changeCompany':
            this.sharedService.changeCompany(e.data.company);
            break;
          default:
            break;
        }
      }
    }, false);
  }

  async ngOnInit() {
    this.setIframeEventsHandler();
    this.sharedService.logout.subscribe(x => {
      if (!x) {
        return;
      }
      window.parent.postMessage(
        { eventName: 'logout' }
        , '*');
    });
    // se carga la cofiguracion
    await this.configService.getAppConfig();

    this.sessionService.SessionObservable.subscribe(s => {
      this.setSession(s);      
      if (s != null) {
        try {
          devexpressConfig({
            defaultCurrency: s.selectedCompany.generalParameters.currency.abbreviation
          });
        } catch (err) {          
          this.sharedService.error("Error configurando moneda. Verifique que la abreviatura sea válida");
        }

      }

    });

    this.sharedService.loader.subscribe((show: boolean) => {
      setTimeout(() => {
        this.showLoader = show;
      }, 100);

    });
    this.sharedService.successNotification.subscribe((message) => {
      if (message != null) {
        this.notificationText = message;
        this.toastOptions.message = message;
        this.toastOptions.type = 'success';
        notify(this.toastOptions);
      }
    });

    this.sharedService.errorNotification.subscribe((message) => {
      if (message != null) {
        this.notificationText = message;
        this.toastOptions.message = message;
        this.toastOptions.type = 'error';
        notify(this.toastOptions);
      }
    });

    this.sharedService.warningNotification.subscribe((message) => {
      if (message != null) {
        this.notificationText = message;
        this.toastOptions.message = message;
        this.toastOptions.type = 'warning';
        notify(this.toastOptions);
      }
    });
    this.sharedService.infoNotification.subscribe((message) => {
      if (message != null) {
        this.notificationText = message;
        this.toastOptions.message = message;
        this.toastOptions.type = 'info';
        notify(this.toastOptions);
      }
    });

    this.sharedService.hideNotification.subscribe(() => {
      if (this.notifyComponent) {
        this.notifyComponent.instance.hide();
      }
    });
  }
}

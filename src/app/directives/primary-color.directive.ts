import { Directive, ElementRef, NgModule } from '@angular/core';
import { SharedService, SessionService } from '../services';
import { Theme } from '../models/theme';
import { StylingService } from '../services/styling.service';

@Directive({
  selector: '[ophPrimaryColor]'
})
export class PrimaryColorDirective {

  constructor(
    private el: ElementRef,
    private sharedService: SharedService,
    private stylingService: StylingService,
    private sesionService: SessionService
  ) {
    this.setStyle(this.sesionService.session.selectedCompany?.theme);
    this.sharedService.companyChanged.subscribe(comp => {
      if (comp) {
        this.setStyle(comp?.theme);
      }
    });
  }

  setStyle(theme: Theme) {
    if (theme) {
      setTimeout(() => {
        this.stylingService.setPrimaryColorStyle((this.el.nativeElement as HTMLElement), theme);
      }, 1);
    }
  }

}

@NgModule({
  declarations: [PrimaryColorDirective],
  exports: [PrimaryColorDirective]
})
export class PrimaryColorDirectiveModule { }

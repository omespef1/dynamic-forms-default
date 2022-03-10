import { Directive, ElementRef, NgModule, Input } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { SessionService } from '../services/session.service';
import { Theme } from '../models/theme';
import { StylingService } from '../services/styling.service';

@Directive({
  selector: '[ophGridHeaderColor]'
})
export class GridHeaderColorDirective {

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
        this.stylingService.setGridHeaderColorStyle((this.el.nativeElement as HTMLElement), theme);
      }, 1000);
    }
  }

}

@NgModule({
  declarations: [GridHeaderColorDirective],
  exports: [GridHeaderColorDirective]
})
export class GridHeaderColorDirectiveModule { }

import { Directive, ElementRef, NgModule, Input } from '@angular/core';
import { SharedService, SessionService } from '../services';
import { Theme } from '../models/theme';
import { StylingService } from '../services/styling.service';

@Directive({
  selector: '[ophTabSubTitleColor]'
})
export class TabSubTitleColorDirective {

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
        this.stylingService.setTabSubTitleColorStyle((this.el.nativeElement as HTMLElement), theme);
      }, 200);
    }
  }

}

@NgModule({
  declarations: [TabSubTitleColorDirective],
  exports: [TabSubTitleColorDirective]
})
export class TabSubTitleColorDirectiveModule { }

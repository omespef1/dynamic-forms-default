import { Directive, ElementRef, NgModule, Input } from '@angular/core';
import { SharedService, SessionService } from '../services';
import { Theme } from '../models/theme';

@Directive({
  selector: '[ophGridHeaderTextColor]'
})
export class GridHeaderTextColorDirective {

  constructor(
    private el: ElementRef,
    private sharedService: SharedService,
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
        this.el.nativeElement.style.color = theme.assets.gridHeaderTextColor;
        const htmlEl = (this.el.nativeElement as HTMLElement);
        if (htmlEl) {
          htmlEl.querySelectorAll('.dx-datagrid-headers .dx-datagrid-table .dx-row > td[role=columnheader]').forEach(iEl => {
            (iEl as HTMLElement).style.color = theme.assets.gridHeaderTextColor;
          });
        }
      }, 1000);
    }
  }

}

@NgModule({
  declarations: [GridHeaderTextColorDirective],
  exports: [GridHeaderTextColorDirective]
})
export class GridHeaderTextColorDirectiveModule { }

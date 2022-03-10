import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[ophRenderComponent]'
})
export class RenderComponentDirective {

  @Input() id: string;
  constructor(public viewContainerRef: ViewContainerRef) { }

}

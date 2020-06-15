import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[tab-label]' })
export class TabLabelDirective {

  constructor(el: ElementRef<any>) {
    el.nativeElement.style.display = 'none';
  }

}

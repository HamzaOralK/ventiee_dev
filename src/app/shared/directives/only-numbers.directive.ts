import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {

  @Input() ngModel: string;

  constructor(private el: ElementRef) {
    (el.nativeElement as HTMLInputElement).value = '';
  }

  @HostListener('input')
  onChange(event) {
    let str = this.el.nativeElement.value as string;
    if(str) {
      str = str.replace(/[^0-9]+/g, "");
      this.el.nativeElement.value = str;
    }
  }

}

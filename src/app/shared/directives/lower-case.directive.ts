import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLowerCase]'
})
export class LowerCaseDirective {
  @Input() ngModel: string;

  constructor(private el: ElementRef) { }

  @HostListener('input')
  onChange() {
    this.el.nativeElement.value = (this.el.nativeElement.value as string).toLocaleLowerCase();
  }

}

import { NgModule } from '@angular/core';
import { LowerCaseDirective } from './lower-case.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';
import { ScrollRetainerDirective } from './scroll-retainer.directive';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    LowerCaseDirective,
    OnlyNumbersDirective,
    ScrollRetainerDirective
  ],
  exports: [
    LowerCaseDirective,
    OnlyNumbersDirective,
    ScrollRetainerDirective
  ]
})
export class DirectivesModule { }

import { NgModule } from '@angular/core';
import { LowerCaseDirective } from './lower-case.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    LowerCaseDirective,
    OnlyNumbersDirective
  ],
  exports: [
    LowerCaseDirective,
    OnlyNumbersDirective
  ]
})
export class DirectivesModule { }

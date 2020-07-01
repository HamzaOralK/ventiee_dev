import { NgModule } from '@angular/core';
import { LowerCaseDirective } from './lower-case.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';
import { ScrollRetainerDirective } from './scroll-retainer.directive';
import { ExtractLinkDirective } from './extract-link.directive';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    LowerCaseDirective,
    OnlyNumbersDirective,
    ScrollRetainerDirective,
    ExtractLinkDirective
  ],
  exports: [
    LowerCaseDirective,
    OnlyNumbersDirective,
    ScrollRetainerDirective,
    ExtractLinkDirective
  ]
})
export class DirectivesModule { }

import { NgModule } from '@angular/core';
import { MultiLanguagePipe } from './multi-language.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    MultiLanguagePipe
  ],
  exports: [
    MultiLanguagePipe
  ],
  providers: [MultiLanguagePipe],
})
export class PipesModule { }

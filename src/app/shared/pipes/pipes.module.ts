import { NgModule } from '@angular/core';
import { MultiLanguagePipe } from './multi-language.pipe';
import { NoSanitizePipe } from './no-sanitize.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    MultiLanguagePipe,
    NoSanitizePipe
  ],
  exports: [
    MultiLanguagePipe, NoSanitizePipe
  ],
  providers: [ MultiLanguagePipe, NoSanitizePipe ],
})
export class PipesModule { }

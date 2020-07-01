import { NgModule } from '@angular/core';
import { MultiLanguagePipe } from './multi-language.pipe';
import { NoSanitizePipe } from './no-sanitize.pipe';
import { LinkifyPipe } from './linkify.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [MultiLanguagePipe, NoSanitizePipe, LinkifyPipe],
  exports: [MultiLanguagePipe, NoSanitizePipe, LinkifyPipe],
  providers: [MultiLanguagePipe, NoSanitizePipe, LinkifyPipe],
})
export class PipesModule {}

import { Pipe, PipeTransform } from '@angular/core';
import { LangService } from '../../services/lang/lang.service';

@Pipe({
  name: 'ml',
  pure: false
})
export class MultiLanguagePipe implements PipeTransform {
  constructor(private langService: LangService) {}

  transform(key: string): string {
    if(key && this.langService.dictionary) {
      let translation = this.langService.dictionary.find(p => p.key === key);
      return translation.value;
    }
  }

}

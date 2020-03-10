import { Injectable } from '@angular/core';
import * as tr from '../../locale/tr.json';
import * as en from '../../locale/en.json';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  language: string = 'tr';
  dictionary: any[];
  constructor() {
    this.decideDict();
  }
  
  decideDict() {
    switch (this.language) {
      case 'tr':
        this.dictionary = tr["default"];
        break;
      case 'en':
        this.dictionary = en["default"];
        break;
      default:
        this.dictionary = undefined;
    }

  }

}

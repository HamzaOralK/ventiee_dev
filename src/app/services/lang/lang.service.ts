import { Injectable } from '@angular/core';
import * as tr from '../../shared/locale/tr.json';
import * as en from '../../shared/locale/en.json';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  language: string = 'tr';
  dictionary: {key: string, value: string}[];
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

  get(key: string) {
    return this.dictionary.find(l => l.key === key).value;
  }

}

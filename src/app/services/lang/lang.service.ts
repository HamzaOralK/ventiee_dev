import { Injectable } from '@angular/core';
import * as tr from '../../shared/locale/tr.json';
import * as en from '../../shared/locale/en.json';
import * as fromApp from '../../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Languages } from 'src/app/dtos/languages';


@Injectable({
  providedIn: 'root'
})
export class LangService {
  language: string = 'tr';
  dictionary: {key: string, value: string}[];
  auth: Observable<fromAuth.State>;
  constructor(
    private store: Store<fromApp.AppState>,
  ) {
    /** Moved to app.module.ts initializer. */
    // this.decideDict();
    let lang = window.navigator.language.substring(0, 2);
    if (lang === 'tr' || lang === 'en') this.language = lang;
    else this.language = 'en';
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      if(p && p.user) {
        this.language = p.user.language;
        this.decideDict();
      }
    });
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

  changeLanguage(language: Languages) {
    this.language = language;
    this.decideDict();
  }

}

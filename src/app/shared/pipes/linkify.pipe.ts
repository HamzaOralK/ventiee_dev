import { Pipe, PipeTransform } from '@angular/core';
import linkifyHtml from "linkifyjs/html";
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Pipe({
  name: "linkify",
})
export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    let substr = value.search(environment.URL);
    return this.sanitizer.bypassSecurityTrustHtml(value ? linkifyHtml(value,
    {
      defaultProtocol: "https",
      target: {
        url: substr > -1 ? '_self' : '_blank'
      }
    }) : value);
  }
}

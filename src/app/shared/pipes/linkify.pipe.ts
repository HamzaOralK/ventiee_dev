import { Pipe, PipeTransform } from '@angular/core';
import * as linkify from "linkifyjs";
import linkifyHtml from "linkifyjs/html";
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: "linkify",
})
export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value ? linkifyHtml(value, { defaultProtocol: "https" }) : value);
  }
}

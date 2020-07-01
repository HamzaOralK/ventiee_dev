import { Directive, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
import * as linkify from 'linkifyjs';
import linkifyHtml from "linkifyjs/html";

@Directive({
  selector: '[extractLink]'
})
export class ExtractLinkDirective {
  @Input() ngModel: string;

  constructor(private el: ElementRef) {
    (el.nativeElement as HTMLTextAreaElement).value = '';
    console.log(el);
  }

  @HostListener('input')
  onChange() {
    console.log(
      linkifyHtml(this.el.nativeElement.value, {
        defaultProtocol: "https",
      })
    );

    // this.el.nativeElement.value = this.createTextLinks(this.el.nativeElement.value as string);
  }


  createTextLinks(text) {
    return (text || "").replace(
      /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
      (match, space, url) => {
        var hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
        }
        return space + '<a href="' + hyperlink + '">' + url + '</a>';
      }
    );
  }

}

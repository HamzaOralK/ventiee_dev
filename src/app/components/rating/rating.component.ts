import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, AfterContentInit, ElementRef, ViewContainerRef, ViewChildren, QueryList, Renderer2, ViewEncapsulation } from '@angular/core';
import { COMMONS } from 'src/app/shared/commons';


@Component({
  selector: "rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.scss"]
})
export class RatingComponent implements OnInit, AfterViewInit {
  @Input() rating: number;
  @Output("onRate") onRate = new EventEmitter();
  @Input() readonly = false;

  @ViewChildren('star') star: QueryList<ElementRef>;
  uuid: string;

  convertedRating: string;
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.uuid = COMMONS.generateUUID();
    if (this.rating) {
      this.convertedRating = (Math.round(this.rating * 2) / 2).toFixed(1);
      this.convertedRating = this.convertedRating.replace(".", "");
    }
  }

  ngAfterViewInit() {
    if (this.rating && this.convertedRating) {
        ((this.star.toArray() as ElementRef[]).find(p => p.nativeElement.id === 'star' + this.convertedRating + this.uuid).nativeElement as HTMLInputElement).checked = true;
    }
  }

  rate(rate: number) {
    console.log(this.readonly);
    if(!this.readonly) {
      (this.star.toArray() as ElementRef[]).forEach(p => {
        p.nativeElement.checked= false;
      });
      let convertedRating = rate.toFixed(1).replace(".", "");
      ((this.star.toArray() as ElementRef[]).find(p => p.nativeElement.id === 'star' + convertedRating + this.uuid).nativeElement as HTMLInputElement).checked = true;
      console.log(rate);
      this.onRate.emit(rate);
    }
  }
}

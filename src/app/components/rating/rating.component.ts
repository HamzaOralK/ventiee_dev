import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';


@Component({
  selector: "rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.scss"],
})
export class RatingComponent implements OnInit, AfterContentInit {
  @Input() rating: number;
  @Output("onRate") onRate = new EventEmitter();
  @Input() readonly = false;
  convertedRating: string;
  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    if (this.rating) {
      this.convertedRating = (Math.round(this.rating * 2) / 2).toFixed(1);
      this.convertedRating = this.convertedRating.replace(".", "");
    }
  }

  ngAfterContentInit() {
    if(this.rating && this.convertedRating) {
      var starElement: HTMLInputElement = this.elRef.nativeElement.querySelector("#star" + this.convertedRating);
      starElement.checked = true;
    }
  }

  rate(rate: number) {
    if(!this.readonly) this.onRate.emit(rate);
  }
}

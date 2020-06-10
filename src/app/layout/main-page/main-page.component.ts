import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainPageComponent implements OnInit {

  isLoading: boolean;

  constructor(private appService: AppService) {
    this.appService.s_loading.subscribe(p => {
      this.isLoading = p;
    })
  }

  ngOnInit() { }

}

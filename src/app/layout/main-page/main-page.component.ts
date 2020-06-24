import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    slideInAnimation
  ]
})
export class MainPageComponent implements OnInit {

  isLoading: boolean;

  constructor(private appService: AppService) {
    this.appService.s_loading.subscribe(p => {
      this.isLoading = p;
    })
  }

  ngOnInit() { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}

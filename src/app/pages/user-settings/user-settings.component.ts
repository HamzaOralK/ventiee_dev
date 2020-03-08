import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(p => console.log(p));
  }

  ngOnInit(): void { }

}

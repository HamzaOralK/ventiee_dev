import { Component, OnInit } from '@angular/core';
import { privacy_tr } from "src/assets/privacy-tr";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  get privacy() {
    return privacy_tr;
  }

}

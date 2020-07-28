import { Component, OnInit } from '@angular/core';
import { eula_tr } from "src/assets/eula-tr";

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  get eula() {
    return eula_tr;
  }

}

import { Component, OnInit, Input, AfterContentInit, ContentChild, ViewContainerRef, ElementRef } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { TabLabelDirective } from 'src/app/shared/directives/tab-label.directive';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterContentInit {
  @Input() label;
  active: boolean;

  @ContentChild(TabLabelDirective, { read: ElementRef }) child: ElementRef;

  constructor(tabs: TabsComponent) {
    tabs.addTab(this);
  }

  ngAfterContentInit() {
    if(this.child) console.log(this.child);
  }

  get labelElement() {
    if (this.child) {
      return this.child.nativeElement.innerHTML;
    }
  }

  ngOnInit(): void { }



}

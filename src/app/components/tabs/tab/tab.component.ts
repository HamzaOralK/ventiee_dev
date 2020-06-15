import { Component, OnInit, Input, AfterContentInit, ContentChild, ViewContainerRef } from '@angular/core';
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

  @ContentChild(TabLabelDirective, { read: ViewContainerRef }) child: ViewContainerRef;

  constructor(tabs: TabsComponent) {
    tabs.addTab(this)
  }

  ngAfterContentInit() {
    if(this.child) console.log(this.child.element.nativeElement.innerHTML);
  }

  get labelElement() {
    if (this.child) return this.child.element.nativeElement.innerHTML;
  }

  ngOnInit(): void { }



}

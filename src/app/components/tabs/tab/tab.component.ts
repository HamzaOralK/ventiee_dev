import { Component, OnInit, Input, ContentChild, ElementRef, TemplateRef, AfterContentInit } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { TabLabelDirective } from 'src/app/components/tabs/tab-label.directive';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterContentInit {
  @Input() label;
  active: boolean;
  labelTemplateRef: BehaviorSubject<any> = new BehaviorSubject(undefined);

  @ContentChild(TabLabelDirective, { read: TemplateRef }) child: TemplateRef<any>;

  constructor(tabs: TabsComponent) {
    tabs.addTab(this);
  }

  ngAfterContentInit() {
    if(this.child) {
      this.labelTemplateRef.next(this.child);
    }
  }

  get labelElement() {
    if (this.child) {
      return this.child;
    }
  }

  ngOnInit(): void { }



}

import { Component, OnInit, Input, ContentChild, TemplateRef, AfterContentInit } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { TabLabelDirective } from 'src/app/components/tabs/tab-label.directive';
import { BehaviorSubject } from 'rxjs';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ opacity: 1, })),
      state('false', style({ opacity: 0, })),
      transition('false <=> true', animate(500))
    ])
  ],
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

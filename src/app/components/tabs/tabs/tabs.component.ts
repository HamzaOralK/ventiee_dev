import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked, ChangeDetectionStrategy, ContentChild, AfterContentInit, ContentChildren, ElementRef, ViewChildren, ViewContainerRef } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TabsComponent implements OnInit, AfterViewChecked {
  tabs: TabComponent[] = [];
  selectedTab: TabComponent;
  domTabs: any[];
  selectedIndex: number = 0;


  constructor(
    private cdr: ChangeDetectorRef,
    private elt: ElementRef
  ) { }

  ngOnInit(): void { }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.domTabs = this.elt.nativeElement.querySelectorAll('tab');
    this.domTabs.forEach((domtab) => {
      domtab.style.display = 'none';
    })
    this.selectedIndex = 0;
    this.domTabs[this.selectedIndex].style.display = '';
  }

  addTab(tab: TabComponent) {
    if (this.tabs.length === 0) {
      tab.active = true;
      this.selectedTab = tab;
    }
    this.tabs.push(tab);
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    this.domTabs.forEach((domtab) => {
      domtab.style.display = 'none';
    })
    this.selectedIndex = this.tabs.findIndex(p => p === tab);
    this.domTabs[this.selectedIndex].style.display = '';
    this.selectedTab = tab;
    tab.active = true;
  }

  getTabComplexLabel(tab: TabComponent) {
    let html = tab.labelElement;
    return html;
  }


}

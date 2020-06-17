import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked, ChangeDetectionStrategy, ElementRef, ViewContainerRef, ViewChild, TemplateRef, ViewChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TabsComponent implements OnInit, AfterViewChecked {
  tabs: {tabComponent: TabComponent, labelTemplateRef?: TemplateRef<any>}[] = [];
  selectedTabComponent: TabComponent;
  domTabs: any[];
  selectedIndex: number = 0;
  dump: any;
  @ViewChildren('tabLabel', { read: ViewContainerRef }) tabLabel: QueryList<ViewContainerRef>;


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
    this.tabs.forEach((p,i) => {
      if(p.labelTemplateRef) {
        this.tabLabel.toArray()[i].clear();
        this.tabLabel.toArray()[i].createEmbeddedView(p.labelTemplateRef, 0, 0);
      }
    })
  }

  addTab(tab: TabComponent) {
    if (this.tabs.length === 0) {
      tab.active = true;
      this.selectedTabComponent = tab;
    }
    let obj = { tabComponent: tab }
    if(!tab.label) {
      tab.labelTemplateRef.subscribe(p => {
        if(p) {
          this.dump = p;
          let index = this.tabs.findIndex(t => t.tabComponent === tab);
          this.tabs[index].labelTemplateRef = p;
        }
      });
    }
    this.tabs.push(obj);
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((tab) => {
      tab.tabComponent.active = false;
    });
    this.domTabs.forEach((domtab) => {
      domtab.style.display = 'none';
    })
    this.selectedIndex = this.tabs.findIndex(p => p.tabComponent === tab);
    this.domTabs[this.selectedIndex].style.display = '';
    this.selectedTabComponent = tab;
    tab.active = true;
  }

}

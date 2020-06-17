import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';

import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TabLabelDirective } from 'src/app/components/tabs/tab-label.directive';



@NgModule({
  declarations: [TabsComponent, TabComponent, TabLabelDirective],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [TabsComponent, TabComponent, TabLabelDirective],
  providers: [TabLabelDirective]
})
export class TabsModule { }

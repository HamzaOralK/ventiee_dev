import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VfooterComponent } from './vfooter.component';

describe('VfooterComponent', () => {
  let component: VfooterComponent;
  let fixture: ComponentFixture<VfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

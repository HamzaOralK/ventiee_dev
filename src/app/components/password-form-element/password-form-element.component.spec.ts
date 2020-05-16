import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFormElementComponent } from './password-form-element.component';

describe('PasswordFormElementComponent', () => {
  let component: PasswordFormElementComponent;
  let fixture: ComponentFixture<PasswordFormElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordFormElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

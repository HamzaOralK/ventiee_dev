import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericImageCropperComponent } from './generic-image-cropper.component';


describe('ImageCropperComponent', () => {
  let component: GenericImageCropperComponent;
  let fixture: ComponentFixture<GenericImageCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericImageCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

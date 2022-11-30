import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageShowDialogComponent } from './image-show-dialog.component';

describe('ImageShowDialogComponent', () => {
  let component: ImageShowDialogComponent;
  let fixture: ComponentFixture<ImageShowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageShowDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageShowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

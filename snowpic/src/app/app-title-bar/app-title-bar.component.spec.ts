import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTitleBarComponent } from './app-title-bar.component';

describe('AppTitleBarComponent', () => {
  let component: AppTitleBarComponent;
  let fixture: ComponentFixture<AppTitleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTitleBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

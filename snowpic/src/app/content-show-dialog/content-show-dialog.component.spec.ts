import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentShowDialogComponent } from './content-show-dialog.component';

describe('ContentShowDialogComponent', () => {
  let component: ContentShowDialogComponent;
  let fixture: ComponentFixture<ContentShowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentShowDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentShowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

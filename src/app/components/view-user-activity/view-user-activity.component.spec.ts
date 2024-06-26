import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserActivityComponent } from './view-user-activity.component';

describe('ViewUserActivityComponent', () => {
  let component: ViewUserActivityComponent;
  let fixture: ComponentFixture<ViewUserActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

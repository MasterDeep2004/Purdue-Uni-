import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularSearchComponent } from './popular-search.component';

describe('PopularSearchComponent', () => {
  let component: PopularSearchComponent;
  let fixture: ComponentFixture<PopularSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedSearchComponent } from './recommended-search.component';

describe('RecommendedSearchComponent', () => {
  let component: RecommendedSearchComponent;
  let fixture: ComponentFixture<RecommendedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

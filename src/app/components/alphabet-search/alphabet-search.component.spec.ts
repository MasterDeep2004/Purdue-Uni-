import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetSearchComponent } from './alphabet-search.component';

describe('AlphabetSearchComponent', () => {
  let component: AlphabetSearchComponent;
  let fixture: ComponentFixture<AlphabetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphabetSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphabetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

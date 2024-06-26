import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFilesComponent } from './edit-files.component';

describe('EditFilesComponent', () => {
  let component: EditFilesComponent;
  let fixture: ComponentFixture<EditFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminPromptComponent } from './add-admin-prompt.component';

describe('AddAdminPromptComponent', () => {
  let component: AddAdminPromptComponent;
  let fixture: ComponentFixture<AddAdminPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdminPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdminPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

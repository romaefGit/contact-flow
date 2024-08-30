import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactFormModalComponent } from './edit-contact-form-modal.component';

describe('EditContactFormModalComponent', () => {
  let component: EditContactFormModalComponent;
  let fixture: ComponentFixture<EditContactFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditContactFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

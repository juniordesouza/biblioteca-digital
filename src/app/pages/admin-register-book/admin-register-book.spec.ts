import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegisterBook } from './admin-register-book';

describe('AdminRegisterBook', () => {
  let component: AdminRegisterBook;
  let fixture: ComponentFixture<AdminRegisterBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegisterBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegisterBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

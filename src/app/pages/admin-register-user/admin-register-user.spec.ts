import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegisterUser } from './admin-register-user';

describe('AdminRegisterUser', () => {
  let component: AdminRegisterUser;
  let fixture: ComponentFixture<AdminRegisterUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegisterUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegisterUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

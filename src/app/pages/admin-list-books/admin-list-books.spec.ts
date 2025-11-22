import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListBooks } from './admin-list-books';

describe('AdminListBooks', () => {
  let component: AdminListBooks;
  let fixture: ComponentFixture<AdminListBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

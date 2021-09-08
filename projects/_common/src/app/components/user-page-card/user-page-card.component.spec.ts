import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageCardComponent } from './user-page-card.component';

describe('UserPageCardComponent', () => {
  let component: UserPageCardComponent;
  let fixture: ComponentFixture<UserPageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

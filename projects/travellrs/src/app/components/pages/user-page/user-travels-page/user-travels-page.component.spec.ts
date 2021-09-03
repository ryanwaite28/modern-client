import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTravelsPageComponent } from './user-travels-page.component';

describe('UserTravelsPageComponent', () => {
  let component: UserTravelsPageComponent;
  let fixture: ComponentFixture<UserTravelsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTravelsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTravelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

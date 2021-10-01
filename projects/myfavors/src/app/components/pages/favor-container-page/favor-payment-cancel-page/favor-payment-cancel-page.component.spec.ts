import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorPaymentCancelPageComponent } from './favor-payment-cancel-page.component';

describe('FavorPaymentCancelPageComponent', () => {
  let component: FavorPaymentCancelPageComponent;
  let fixture: ComponentFixture<FavorPaymentCancelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorPaymentCancelPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorPaymentCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

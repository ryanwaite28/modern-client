import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorPaymentSuccessPageComponent } from './favor-payment-success-page.component';

describe('FavorPaymentSuccessPageComponent', () => {
  let component: FavorPaymentSuccessPageComponent;
  let fixture: ComponentFixture<FavorPaymentSuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorPaymentSuccessPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorPaymentSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

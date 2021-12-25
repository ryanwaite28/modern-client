import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBrowseMapComponent } from './delivery-browse-map.component';

describe('DeliveryBrowseMapComponent', () => {
  let component: DeliveryBrowseMapComponent;
  let fixture: ComponentFixture<DeliveryBrowseMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryBrowseMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBrowseMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

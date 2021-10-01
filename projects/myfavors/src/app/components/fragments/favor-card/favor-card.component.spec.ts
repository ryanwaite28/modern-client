import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorCardComponent } from './favor-card.component';

describe('FavorCardComponent', () => {
  let component: FavorCardComponent;
  let fixture: ComponentFixture<FavorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

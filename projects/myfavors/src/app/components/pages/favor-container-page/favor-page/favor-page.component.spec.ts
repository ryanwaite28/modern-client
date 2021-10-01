import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorPageComponent } from './favor-page.component';

describe('FavorPageComponent', () => {
  let component: FavorPageComponent;
  let fixture: ComponentFixture<FavorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

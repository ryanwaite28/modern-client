import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorsComponent } from './favors.component';

describe('FavorsComponent', () => {
  let component: FavorsComponent;
  let fixture: ComponentFixture<FavorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

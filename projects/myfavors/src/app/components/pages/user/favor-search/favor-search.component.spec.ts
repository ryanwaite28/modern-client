import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorSearchComponent } from './favor-search.component';

describe('FavorSearchComponent', () => {
  let component: FavorSearchComponent;
  let fixture: ComponentFixture<FavorSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

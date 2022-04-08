import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorBrowseMapComponent } from './favor-browse-map.component';

describe('FavorBrowseMapComponent', () => {
  let component: FavorBrowseMapComponent;
  let fixture: ComponentFixture<FavorBrowseMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorBrowseMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorBrowseMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorBrowseRecentComponent } from './favor-browse-recent.component';

describe('FavorBrowseRecentComponent', () => {
  let component: FavorBrowseRecentComponent;
  let fixture: ComponentFixture<FavorBrowseRecentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorBrowseRecentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorBrowseRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

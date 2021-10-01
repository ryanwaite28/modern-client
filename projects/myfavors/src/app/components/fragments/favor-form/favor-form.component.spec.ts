import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorFormComponent } from './favor-form.component';

describe('FavorFormComponent', () => {
  let component: FavorFormComponent;
  let fixture: ComponentFixture<FavorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

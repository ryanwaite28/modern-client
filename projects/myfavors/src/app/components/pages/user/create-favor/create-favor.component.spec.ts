import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFavorComponent } from './create-favor.component';

describe('CreateFavorComponent', () => {
  let component: CreateFavorComponent;
  let fixture: ComponentFixture<CreateFavorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFavorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFavorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

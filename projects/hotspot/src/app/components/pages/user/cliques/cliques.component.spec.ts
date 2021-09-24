import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliquesComponent } from './cliques.component';

describe('CliquesComponent', () => {
  let component: CliquesComponent;
  let fixture: ComponentFixture<CliquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CliquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CliquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

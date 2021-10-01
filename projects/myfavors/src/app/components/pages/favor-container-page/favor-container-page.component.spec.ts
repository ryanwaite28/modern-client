import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorContainerPageComponent } from './favor-container-page.component';

describe('FavorContainerPageComponent', () => {
  let component: FavorContainerPageComponent;
  let fixture: ComponentFixture<FavorContainerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavorContainerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorContainerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

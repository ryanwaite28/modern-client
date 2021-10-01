import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Favor HelpingsComponent } from './favor-helping.component';

describe('Favor HelpingsComponent', () => {
  let component: Favor HelpingsComponent;
  let fixture: ComponentFixture<Favor HelpingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Favor HelpingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Favor HelpingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

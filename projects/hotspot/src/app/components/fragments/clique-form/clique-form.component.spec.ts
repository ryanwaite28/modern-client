import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliqueFormComponent } from './clique-form.component';

describe('CliqueFormComponent', () => {
  let component: CliqueFormComponent;
  let fixture: ComponentFixture<CliqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CliqueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CliqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

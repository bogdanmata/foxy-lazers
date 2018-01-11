import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlSpinnerComponent } from './fl-spinner.component';

describe('FlSpinnerComponent', () => {
  let component: FlSpinnerComponent;
  let fixture: ComponentFixture<FlSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

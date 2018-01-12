import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinalCountdownComponent} from './final-countdown.component';

describe('FinalCountdownComponent', () => {
  let component: FinalCountdownComponent;
  let fixture: ComponentFixture<FinalCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinalCountdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

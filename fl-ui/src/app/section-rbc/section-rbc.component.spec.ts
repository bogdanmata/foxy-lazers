import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRbcComponent } from './section-rbc.component';

describe('SectionRbcComponent', () => {
  let component: SectionRbcComponent;
  let fixture: ComponentFixture<SectionRbcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionRbcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionRbcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

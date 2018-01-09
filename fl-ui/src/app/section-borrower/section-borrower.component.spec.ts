import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionBorrowerComponent } from './section-borrower.component';

describe('SectionBorrowerComponent', () => {
  let component: SectionBorrowerComponent;
  let fixture: ComponentFixture<SectionBorrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

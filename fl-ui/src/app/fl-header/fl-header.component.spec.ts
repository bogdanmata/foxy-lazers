import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlHeaderComponent } from './fl-header.component';

describe('FlHeaderComponent', () => {
  let component: FlHeaderComponent;
  let fixture: ComponentFixture<FlHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

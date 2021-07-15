import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotheComponent } from './clothe.component';

describe('ClotheComponent', () => {
  let component: ClotheComponent;
  let fixture: ComponentFixture<ClotheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClotheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClotheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothesListComponent } from './clothes-list.component';

describe('ClothesListComponent', () => {
  let component: ClothesListComponent;
  let fixture: ComponentFixture<ClothesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClothesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClothesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

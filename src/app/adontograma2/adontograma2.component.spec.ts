import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adontograma2Component } from './adontograma2.component';

describe('Adontograma2Component', () => {
  let component: Adontograma2Component;
  let fixture: ComponentFixture<Adontograma2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adontograma2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adontograma2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

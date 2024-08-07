import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSimpleLoadComponent } from './model-simple-load.component';

describe('ModelSimpleLoadComponent', () => {
  let component: ModelSimpleLoadComponent;
  let fixture: ComponentFixture<ModelSimpleLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelSimpleLoadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelSimpleLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

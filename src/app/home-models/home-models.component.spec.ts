import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeModelsComponent } from './home-models.component';

describe('HomeModelsComponent', () => {
  let component: HomeModelsComponent;
  let fixture: ComponentFixture<HomeModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeModelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

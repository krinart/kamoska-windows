import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowItemComponent } from './window-item.component';

describe('WindowItemComponent', () => {
  let component: WindowItemComponent;
  let fixture: ComponentFixture<WindowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

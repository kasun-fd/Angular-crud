import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderContextComponent } from './order-context.component';

describe('OrderContextComponent', () => {
  let component: OrderContextComponent;
  let fixture: ComponentFixture<OrderContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderContextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

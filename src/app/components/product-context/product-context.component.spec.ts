import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductContextComponent } from './product-context.component';

describe('ProductContextComponent', () => {
  let component: ProductContextComponent;
  let fixture: ComponentFixture<ProductContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductContextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

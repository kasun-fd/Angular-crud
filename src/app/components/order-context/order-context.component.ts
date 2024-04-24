import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-order-context',
  standalone: true,
  imports: [
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatInput,
    MatButton,
    MatFabButton,
    MatIcon,
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe,
    AsyncPipe,
    MatProgressBar,
    NgIf,
    MatIconButton
  ],
  templateUrl: './order-context.component.html',
  styleUrl: './order-context.component.scss'
})
export class OrderContextComponent implements OnInit{
  constructor(
    private storage:AngularFireStorage,
    private db:AngularFirestore,
  ) {
  }


  form = new FormGroup({
    customerName:new FormControl('',Validators.required),
    productName:new FormControl('',Validators.required),
    qty:new FormControl('',Validators.required)
  })

  grandTotal:any;
  tableMain = false;
  loading = false;
  selectedCustomer:any;
  getQty:any;
  customerAllData:any;
  productAllData:any;
  customerData:any[] = [];

  productData:any[] = [];

  ordersData:any[] = [];

  ngOnInit(): void {
    this.db.collection('customers').get().subscribe(querySnapShot=>{
      querySnapShot.forEach(doc=>{
        this.customerData.push({id:doc.id, data:doc.data()});
      })
    })

    this.db.collection('products').get().subscribe(querySnapShot=>{
      querySnapShot.forEach(doc=>{
        this.productData.push({id:doc.id, data:doc.data()})
      })
    })
  }

  multiply(num1: number, num2: number): number {
    return num1 * num2;
  }

  order:any;

  arrayTotal(){
    for (let i = 0; i < this.ordersData.length; i++) {
      for (let j = 0; j < this.ordersData[i].totalCost; j++) {
        this.grandTotal += this.ordersData[i].totalCost;
      }
    }
    console.log(this.grandTotal);
  }

  addCart(){
    this.getQty = this.form.value.qty;
    let order = {
      customerName:this.customerAllData.fullName,
      customerAddress:this.customerAllData.address,
      des:this.productAllData.des,
      qty:this.form.value.qty,
      unitPrice:this.productAllData.price,
      totalCost:this.multiply(this.productAllData.price,this.getQty)
    }

    this.order = order;
      this.form.reset();

      this.customerAllData = '';
      this.productAllData = '';
      // Option 1: Using window.scroll() with behavior for smooth scrolling
      window.scroll({ top: 0, behavior: 'smooth' });

      // Option 2: Using document.documentElement.scrollTop for broader compatibility
      document.documentElement.scrollTop = 0;
      this.tableMain = true;
      this.loadTable();
      this.arrayTotal();
  }

  loadTable(){
    this.ordersData.push(this.order);
  }

  deleteRow(index:any){
    this.ordersData.splice(index,1);
    if (this.ordersData.length === 0){
      this.ordersData = [];
      this.tableMain = false;
      this.grandTotal = 0;
    }
  }

  getDataByID(id: any, type:any) {
    return this.db.collection(type).doc(id).ref.get().then((doc) => {
        if (doc.exists) {
          this.customerAllData = doc.data()
        } else {
          console.log('No such document!');
        }

    });
  }

  getProductDataByID(id: any, type:any) {
    return this.db.collection(type).doc(id).ref.get().then((doc) => {
      if (doc.exists) {
        this.productAllData = doc.data()
      } else {
        console.log('No such document!');
      }

    });
  }

  customerSelect(text:any){
    this.getDataByID(text.value,'customers')
  }

  productSelect(text:any){
    this.getProductDataByID(text.value,'products')
  }

}

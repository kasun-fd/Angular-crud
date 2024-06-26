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
import {MatSnackBar} from "@angular/material/snack-bar";
import {IdGeneratorService} from "../../services/id-generator.service";

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
    private snackBar:MatSnackBar,
    private generateId:IdGeneratorService
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

  orderTotalCost:any[] = [];

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
      this.grandTotal = 0;
      this.arrayTotal();
  }

  async placeOrder() {

    window.scrollTo({top: 0, behavior: 'smooth'});
    this.grandTotal = 0;

    this.loading = true;

    await this.addArrayDataToFirestore(this.ordersData).then(r => {
      this.loading = false;
      this.tableMain = false;

      this.snackBar.open('Order was Placed!','Close',{
        direction:'ltr',
        duration:4000,
        horizontalPosition:'start',
        verticalPosition:'bottom'
      })

    })

    this.ordersData = [];
  }
    async addArrayDataToFirestore(dataArray: any[]) {
    for (let i = 0; i < dataArray.length; i++) {
      let object = {
        customerName:dataArray[i].customerName,
        customerAddress:dataArray[i].customerAddress,
        des:dataArray[i].des,
        qty:dataArray[i].qty,
        unitPrice:dataArray[i].unitPrice,
        totalCost:dataArray[i].totalCost
      }
      try {
        // Use add() to generate a unique document ID
        await this.db.collection('orders').add(object);
        console.log('placed');
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  }


  arrayTotal(){
    for (let argument of this.ordersData) {
      this.grandTotal += argument.totalCost;
    }
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
    this.grandTotal = 0;
    this.arrayTotal()
  }

  async getDataByID(id: any, type: any) {
    const doc = await this.db.collection(type).doc(id).ref.get();
    if (doc.exists) {
      this.customerAllData = doc.data();
    } else {
      console.log('No such document!');
    }
  }

  async getProductDataByID(id: any, type: any) {
    const doc = await this.db.collection(type).doc(id).ref.get();
    if (doc.exists) {
      this.productAllData = doc.data();
    } else {
      console.log('No such document!');
    }
  }

  customerSelect(text:any){
    this.getDataByID(text.value, 'customers')
  }

  productSelect(text:any){
    this.getProductDataByID(text.value,'products')
  }

}

import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {NgForOf} from "@angular/common";

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
    NgForOf
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

  customerAllData:any;
  customerData:any[] = [];

  ngOnInit(): void {

    this.db.collection('customers').get().subscribe(querySnapShot=>{
      querySnapShot.forEach(doc=>{
        this.customerData.push({id:doc.id, data:doc.data()});
      })
    })
  }

  addCart(){

  }

  getDataByID(id: any) {
    return this.db.collection('customers').doc(id).ref.get().then((doc) => {
      if (doc.exists) {
        this.customerAllData = doc.data()
      } else {
        console.log('No such document!');
      }
    });
  }

  customerSelect(text:any){
    this.getDataByID(text.value)


  }


}

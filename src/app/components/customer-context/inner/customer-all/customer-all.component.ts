import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {and} from "@angular/fire/firestore";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {loadavg} from "os";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";

@Component({
  selector: 'app-customer-all',
  standalone: true,
  imports: [
    NgForOf,
    CurrencyPipe,
    MatButton,
    AsyncPipe,
    MatProgressBar,
    NgIf,
    MatIcon,
    MatIconButton,
    RouterLink
  ],
  templateUrl: './customer-all.component.html',
  styleUrl: './customer-all.component.scss'
})
export class CustomerAllComponent implements OnInit{

  loading = false;

  customers:any[] = [];

  constructor(private db:AngularFirestore,
              private storage:AngularFireStorage
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.db.collection('customers').get().subscribe(querySnapShot=>{
      querySnapShot.forEach(doc=>{
        this.customers.push({id:doc.id, data:doc.data()});
        this.loading = false;
        // console.log(this.customers)
      })
    });
  }

  deleteCustomer(id:any, avatar:any){
    if (confirm('Are You Sure?')){
      this.db.collection('customers').doc(id).delete();
      this.storage.storage.refFromURL(avatar).delete();
    }
  }

}

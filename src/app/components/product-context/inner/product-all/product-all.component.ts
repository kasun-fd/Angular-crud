import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {RouterLink} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-product-all',
  standalone: true,
    imports: [
        CurrencyPipe,
        MatIcon,
        MatIconButton,
        MatProgressBar,
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './product-all.component.html',
  styleUrl: './product-all.component.scss'
})
export class ProductAllComponent implements OnInit{
  loading = false;

  products:any[] = [];

  constructor(private db:AngularFirestore,
              private storage:AngularFireStorage
  ) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.db.collection('products').get().subscribe(querySnapShot=>{
      querySnapShot.forEach(doc=>{
        this.products.push({id:doc.id, data:doc.data()});
        this.loading = false;
      })
    })

  }

  deleteProduct(id:any, image:any){
    if(confirm('Are You Sure?')){
      this.db.collection('products').doc(id).delete();
      this.storage.storage.refFromURL(image).delete();

      this.products = [];

      this.loading = true;

      this.db.collection('products').get().subscribe(querySnapShot=>{
        querySnapShot.forEach(doc=>{
          this.products.push({id:doc.id, data:doc.data()});
          this.loading = false;
        })
      })

    }
  }

}

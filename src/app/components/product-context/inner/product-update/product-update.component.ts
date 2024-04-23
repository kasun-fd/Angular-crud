import { Component } from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {finalize, Observable} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss'
})
export class ProductUpdateComponent {

  selectedProductId:any;

  constructor(
    private storage:AngularFireStorage,
    private db:AngularFirestore,
    private snackBar:MatSnackBar,
    private activetedRoute:ActivatedRoute
  ) {
    activetedRoute.paramMap.subscribe(response=>{
      this.selectedProductId = response.get('id');
    })
  }
  // @ts-ignore
  uploadRate:Observable<number | undefined>;
  // @ts-ignore
  DownloadLink:Observable<string | undefined>;

  selectedImage:any;
  loading = false;
  form = new FormGroup({
    des:new FormControl('',Validators.required),
    qty:new FormControl('',Validators.required),
    price:new FormControl('',Validators.required),
    image:new FormControl('',Validators.required)
  })

  updateProduct(){
    this.loading = true;

    const path = 'product-image'+this.form.value.des+'/'+this.selectedImage.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path,this.selectedImage);

    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(()=>{
        this.DownloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(()=>{
      this.DownloadLink.subscribe(res=>{
        let product = {
          des:this.form.value.des,
          qty:this.form.value.qty,
          price:this.form.value.price,
          image:res
        }

        const productRef = this.db.collection('products').doc(this.selectedProductId);

        productRef.update(product).then(()=>{
          this.snackBar.open('Product Updated!','Close',{
            duration:5000,
            verticalPosition:'bottom',
            horizontalPosition:'start',
            direction:'ltr'
          })
          this.loading = false;
        }).catch(er=>{
          console.log(er);
          this.loading = false;
        })

      })
    //   test
    }).catch(er=>{
      console.log(er);
      this.loading = false;
    })

  }

  onChangeFile(event:any){
    this.selectedImage = event.target.files[0];
  }
}

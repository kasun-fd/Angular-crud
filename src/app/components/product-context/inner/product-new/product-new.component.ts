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

@Component({
  selector: 'app-product-new',
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
  templateUrl: './product-new.component.html',
  styleUrl: './product-new.component.scss'
})
export class ProductNewComponent {

  constructor(
    private storage:AngularFireStorage,
    private db:AngularFirestore,
    private snackBarService:MatSnackBar
  ) {
  }

  selectedImage:any;
  loading = false;
  // @ts-ignore
  uploadRate:Observable<number | undefined>;
  // @ts-ignore
  downloadLink:Observable<string | undefined>;

  form = new FormGroup({
    des:new FormControl(
      '',
      [Validators.required]
    ),
    qty:new FormControl(
      '',
      [Validators.required]
    ),
    price:new FormControl(
      '',
      [Validators.required]
    ),
    image:new FormControl(
      '',
      [Validators.required]
    )
  })

  saveProduct(){

    this.loading = true;

    const path = 'product-image/'+this.form.value.des+'/'+this.selectedImage.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path,this.selectedImage);

    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(()=>{
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(()=>{
      this.downloadLink.subscribe(res=>{
        let product = {
          des:this.form.value.des,
          qty:this.form.value.qty,
          price:this.form.value.price,
          image:res
        }

        this.db.collection('products').add(product).then(()=>{
          this.loading = false;
          this.snackBarService.open('Product Saved!','Close',{
            duration:5000,
            verticalPosition:"bottom",
            horizontalPosition:"left",
            direction:'ltr'
          })
          this.form.reset();
        }).catch(er=>{
          console.log(er)
          this.loading = false;
        })
      })
    }).catch(er=>{
      console.log(er)
      this.loading = false;
    })

  }

  onChangeFile(event:any){
    this.selectedImage = event.target.files[0];
  }
}

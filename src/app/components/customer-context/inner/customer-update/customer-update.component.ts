import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    MatProgressBar,
    MatInput,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.scss'
})
export class CustomerUpdateComponent {

  selectedCustomerId:any;

  constructor(private storage:AngularFireStorage,
              private activatedRoute:ActivatedRoute,
              private db:AngularFirestore,
              private snackBarService:MatSnackBar) {
    activatedRoute.paramMap.subscribe(response=>{
      this.selectedCustomerId = response.get('id');
    })
  }

  loading:boolean = false;
  selectedAvatar:any;
  // @ts-ignore
  uploadRate:Observable<number | undefined>;
  // @ts-ignore
  downloadLink:Observable<string | undefined>;


  form = new FormGroup({
    fullName:new FormControl('',[Validators.required]),
    address:new FormControl('',[Validators.required]),
    salary:new FormControl('',[Validators.required]),
    avatar:new FormControl('',[Validators.required])
  })
  updateCustomer(){

    this.loading = true;

    const path = 'avatar/'+this.form.value.fullName+'/'+this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path,this.selectedAvatar);

    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(()=>{
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(()=>{

      this.downloadLink.subscribe(res=>{
        let customer = {
          fullName:this.form.value.fullName,
          address:this.form.value.address,
          salary:this.form.value.salary,
          avatar:res
        }

        const customerRef = this.db.collection('customers').doc(this.selectedCustomerId)

        customerRef.update(customer).then((docRef)=>{

          this.snackBarService.open('Customer Updates!','Close',{
            duration:5000,
            verticalPosition:'bottom',
            horizontalPosition:'start',
            direction:'ltr'
          })
          this.loading = false;
        }).catch(er=>{
          console.log(er)
          this.loading = false;
        })

        // this.db.collection('customers').add(customer)

      })



    }).catch(error=>{
      console.log(error);
      this.loading = false;
    })
  }

  onChangeFile(event:any) {
    this.selectedAvatar = event.target.files[0];
  }
}

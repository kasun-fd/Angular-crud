import {Component} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatProgressBar,
    AsyncPipe,
    NgIf

  ],
  templateUrl: './customer-new.component.html',
  styleUrl: './customer-new.component.scss'
})
export class CustomerNewComponent {

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private snackBarService: MatSnackBar) {
  }

  loading: boolean = false;
  selectedAvatar: any;
  // @ts-ignore
  uploadRate: Observable<number | undefined>;
  // @ts-ignore
  downloadLink: Observable<string | undefined>;


  form = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required])
  })

  saveCustomer() {

    this.loading = true;
    //
    const path = 'avatar/' + this.form.value.fullName + '/' + this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, this.selectedAvatar);
    //
    this.uploadRate = task.percentageChanges();
    //
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(() => {

      this.downloadLink.subscribe(res => {
        let customer = {
          fullName: this.form.value.fullName,
          address: this.form.value.address,
          salary: this.form.value.salary,
          avatar: res
        }

        this.db.collection('customers').add(customer).then((docRef) => {
          this.loading = false;
          this.snackBarService.open('Customer Saved!', 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'start',
            direction: 'ltr'
          })
          this.form.reset();
        }).catch(er => {
          console.log(er)
          this.loading = false;
        })

      })


    }).catch(error => {
      console.log(error);
      this.loading = false;
    })



  }

  onChangeFile(event: any) {
    this.selectedAvatar = event.target.files[0];
  }
}

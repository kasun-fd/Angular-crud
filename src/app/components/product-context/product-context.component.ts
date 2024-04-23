import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-product-context',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './product-context.component.html',
  styleUrl: './product-context.component.scss'
})
export class ProductContextComponent {

}

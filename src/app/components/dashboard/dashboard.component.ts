import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

import {Component, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {

}

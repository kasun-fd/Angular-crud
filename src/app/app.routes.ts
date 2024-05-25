import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardHomeComponent} from "./components/dashboard-home/dashboard-home.component";
import {CustomerContextComponent} from "./components/customer-context/customer-context.component";
import {CustomerNewComponent} from "./components/customer-context/inner/customer-new/customer-new.component";
import {CustomerUpdateComponent} from "./components/customer-context/inner/customer-update/customer-update.component";
import {CustomerAllComponent} from "./components/customer-context/inner/customer-all/customer-all.component";
import {ProductContextComponent} from "./components/product-context/product-context.component";
import {ProductNewComponent} from "./components/product-context/inner/product-new/product-new.component";
import {ProductUpdateComponent} from "./components/product-context/inner/product-update/product-update.component";
import {ProductAllComponent} from "./components/product-context/inner/product-all/product-all.component";
import {OrderContextComponent} from "./components/order-context/order-context.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";

export const routes: Routes = [
  {path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
      {path: 'home', component: DashboardHomeComponent},
      {
        path: 'customers', component: CustomerContextComponent, children: [
          {path: '', redirectTo: '/dashboard/customers/new', pathMatch: 'full'},
          {path: 'new', component: CustomerNewComponent},
          {path: 'update/:id', component: CustomerUpdateComponent},
          {path: 'list', component: CustomerAllComponent}
        ]
      },
      {
        path: 'products', component: ProductContextComponent, children: [
          {path: '', redirectTo: '/dashboard/products/new', pathMatch: 'full'},
          {path: 'new', component: ProductNewComponent},
          {path: 'update/:id', component: ProductUpdateComponent},
          {path: 'list', component: ProductAllComponent}
        ]
      },
      {path: 'orders', component: OrderContextComponent}
    ]
  },
  {path:'**', component:PageNotFoundComponent}
];

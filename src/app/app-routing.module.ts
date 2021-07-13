import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { BusinessComponent } from './pages/business/business.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckInComponent } from './pages/check-in/check-in.component';
import { CategoryComponent } from './back/categories/category/category.component';


const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'about-us', component: AboutUsComponent }, 
  { path: 'business', component: BusinessComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'check-in', component: CheckInComponent },
  { path: 'new-category', component: CategoryComponent },
  { path: 'edit-category/:id', component: CategoryComponent },
  //{ path: 'categories', component:  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

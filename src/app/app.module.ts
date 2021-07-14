import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { BusinessComponent } from './pages/business/business.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckInComponent } from './pages/check-in/check-in.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PasswordRecoverComponent } from './shared/users/password-recover/password-recover.component';
import { ResetPasswordComponent } from './shared/users/reset-password/reset-password.component';
import { LoggedInGuard } from './shared/auth/logged-in-guard.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { AuthService } from './shared/auth/auth.service';
import { UsersService } from './shared/users/users.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiAuthInterceptor } from './app.api-auth-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './back/categories/category/category.component';
import { CategoryService } from './back/categories/category.service';
import { ClothingComponent } from './back/clothes/clothing/clothing.component';
import { ClothingService } from './back/clothes/clothing.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CategoriesListComponent } from './back/categories/categories-list/categories-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    BusinessComponent,
    LoginComponent,
    CheckInComponent,
    PasswordRecoverComponent,
    ResetPasswordComponent,
    CategoryComponent,
    CategoriesListComponent,
    ClothingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiAuthInterceptor,
      multi: true,
    },
    BsModalService,
    UsersService,
    AuthService,
    AuthGuard,
    LoggedInGuard,
    CategoryService,
    ClothingService,],
  bootstrap: [AppComponent]
})
export class AppModule { }

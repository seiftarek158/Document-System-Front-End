import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/productservice.service';
import { RippleModule } from 'primeng/ripple';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { FileUploadModule } from 'primeng/fileupload';
// import { WorkspaceFormComponent } from './workspace-form/workspace-form.component';
// import { SortModule } from 'primeng/sort';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    WorkspaceListComponent,
    DocumentListComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RippleModule,
    CommonModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    TableModule,
    DialogModule,
    FormsModule,
    FileUploadModule,

     // Add the WorkspaceFormComponent to the imports
  
  ],
  providers: [MessageService,ProductService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ReactiveFormsModule } from '@angular/forms';
// // PrimeNG Modules
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

// @NgModule({
//   declarations: [
//     AppComponent,
//     WorkspaceListComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     FormsModule,
//     HttpClientModule,
//     BrowserAnimationsModule,
//     TableModule,
//     ButtonModule,
//     DialogModule,
//     InputTextModule,
//     ToastModule,
//     ReactiveFormsModule
//   ],
//   providers: [MessageService],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
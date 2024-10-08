import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
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
import { RippleModule } from 'primeng/ripple';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { TokenInterceptorService } from './services/token-interceptor/token-interceptor.service';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BreadcrumbModule } from 'primeng/breadcrumb';;


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
    PdfViewerModule,
    BreadcrumbModule,
    DropdownModule,
     // Add the WorkspaceFormComponent to the imports
  
  ],
  providers: [MessageService,
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
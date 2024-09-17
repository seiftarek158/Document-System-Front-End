import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';
import { DocumentListComponent } from './document-list/document-list.component';

// import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'workspaceList',
    component: WorkspaceListComponent
  },
  {
    path: 'documentList',
    component: DocumentListComponent
  }
  
,
  {
    path: 'documentList/subWorkspace',
    component: DocumentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

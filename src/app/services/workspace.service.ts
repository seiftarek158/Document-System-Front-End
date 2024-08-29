import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workspace } from './Workspace';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  updateProduct(product: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/workspace/user'; // Replace with your API URL

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getWorkspaceData(): Observable<any> {
    console.log("inside workspace service");
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Workspace>(this.apiUrl,{ headers });
  }
}

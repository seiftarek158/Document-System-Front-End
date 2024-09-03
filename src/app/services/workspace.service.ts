import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workspace } from './Workspace';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  
  private apiUrl = 'http://localhost:8080/workspace'; // Replace with your API URL

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getWorkspaceData(): Observable<any> {
    console.log("inside workspace service");
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Workspace>(`${this.apiUrl}/user`,{ headers });

  }

  updateWorkspace(workspace: Workspace): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.apiUrl}/update/${workspace.id}`, workspace);
  }
  createWorkspace(workspace: Workspace): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.apiUrl}/create`, workspace);
  }
  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

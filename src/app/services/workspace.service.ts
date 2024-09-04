import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Directory } from './Workspace';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  
  private apiUrl = 'http://localhost:8080/directory'; // Replace with your API URL

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getWorkspaceData(): Observable<any> {
    console.log("inside workspace service");
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Directory>(`${this.apiUrl}/user`,{ headers });

  }

  updateWorkspace(directory: Directory): Observable<Directory> {
    return this.http.put<Directory>(`${this.apiUrl}/${directory.id}`, directory);
  }
  createWorkspace(directory: Directory): Observable<Directory> {
    return this.http.post<Directory>(`${this.apiUrl}/new`, directory);
  }
  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

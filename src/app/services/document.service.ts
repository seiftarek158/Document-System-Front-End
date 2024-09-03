import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentData } from './documentdata';
import { Workspace } from './Workspace';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/workspace'; // Replace with your API URL

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getDocumentData(): Observable<any> {
    console.log("inside workspace service");
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DocumentData>(`${this.apiUrl}/user`,{ headers });

  }


  uploadDocument(workspace: Workspace, file:File): Observable<DocumentData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DocumentData>(`${this.apiUrl}/${workspace.id}/upload`,file);
  }
  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

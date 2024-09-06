import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseData } from './basedata';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:8080/'; 

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getAllDocumentData(directory: BaseData): Observable<BaseData[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<BaseData[]>(`${this.apiUrl}directory/${directory.id}`);

  }


  uploadDocument(directory: BaseData, file:File): Observable<BaseData> {
    console.log("inside content service",directory);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<BaseData>(`${this.apiUrl}${directory.id}/upload`,formData);
  }
  deleteDocument(id: string): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}document/${id}`);
  }

  updateDocument(document: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(`${this.apiUrl}document/${document.id}`, document);
  }
  
  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}document/${id}`, { responseType: 'blob' });
  }


}

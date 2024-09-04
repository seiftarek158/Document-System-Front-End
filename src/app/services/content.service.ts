import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentData } from './documentdata';
import { Directory } from './Workspace';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:8080/'; 

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getAllDocumentData(directory: Directory): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DocumentData>(`${this.apiUrl}directory/${directory.id}`);

  }


  uploadDocument(directory: Directory, file:File): Observable<DocumentData> {
    console.log("inside content service",directory);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DocumentData>(`${this.apiUrl}${directory.id}/upload`,formData);
  }
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // getAllData(): Observable<CombinedData[]> {
  //   return forkJoin([this.getDirectories(), this.getDocuments()]).pipe(
  //     map(([directories, documents]) => [...directories, ...documents])
  //   );
  // }
}

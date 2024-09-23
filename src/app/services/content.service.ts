import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseData } from './basedata';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllDocumentData(id: String): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(
      `${this.apiUrl}directory/documents/${id}`
    );
  }

  getDirectoryData(id: String): Observable<BaseData> {
    return this.http.get<BaseData>(`${this.apiUrl}directory/${id}`);
  }
  getAllNestedWorkspaceData(id: String): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(
      `${this.apiUrl}directory/nested/${id}`
    );
  }

  uploadDocument(directory: BaseData, file: File): Observable<BaseData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<BaseData>(
      `${this.apiUrl}${directory.id}/upload`,
      formData
    );
  }
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}document/${id}`);
  }

  updateDocument(document: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(
      `${this.apiUrl}document/${document.id}`,
      document
    );
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}document/${id}`, {
      responseType: 'blob',
    });
  }

  searchDocuments(
    workspaceId: string,
    searchTerm: string
  ): Observable<BaseData[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<BaseData[]>(
      `${this.apiUrl}${workspaceId}/documents`,
      { params }
    );
  }
}

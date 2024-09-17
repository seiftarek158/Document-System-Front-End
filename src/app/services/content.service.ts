import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseData } from './basedata';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiUrls = ['http://localhost:8082/', 'http://localhost:8083/'];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllDocumentData(directory: BaseData): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(
      `${this.apiUrls[0]}directory/${directory.id}`
    );
  }
  getAllNestedWorkspaceData(id: String): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(
      `${this.apiUrls[0]}directory/nested/${id}`
    );
  }

  uploadDocument(directory: BaseData, file: File): Observable<BaseData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<BaseData>(
      `${this.apiUrls[1]}${directory.id}/upload`,
      formData
    );
  }
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrls[1]}document/${id}`);
  }

  updateDocument(document: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(
      `${this.apiUrls[1]}document/${document.id}`,
      document
    );
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrls[0]}document/${id}`, {
      responseType: 'blob',
    });
  }

  searchDocuments(
    workspaceId: string,
    searchTerm: string
  ): Observable<BaseData[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<BaseData[]>(
      `${this.apiUrls[0]}${workspaceId}/documents`,
      { params }
    );
  }
}

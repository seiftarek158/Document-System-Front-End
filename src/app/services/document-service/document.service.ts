import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseData } from '../basedata';
import { Directory } from '../directory';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllDocumentData(id: String): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(
      `${this.apiUrl}directories/${id}/documents`
    );
  }

  // getDirectoryData(id: String): Observable<BaseData> {
  //   return this.http.get<BaseData>(`${this.apiUrl}directories/${id}`);
  // }
  getDirectoryData(id: String): Observable<Directory> {
    return this.http.get<Directory>(`${this.apiUrl}directories/${id}`);
  }
  getAllNestedWorkspaceData(id: String): Observable<BaseData[]> {
    return this.http.get<BaseData[]>(`${this.apiUrl}directories/${id}/nested`);
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
    return this.http.delete<void>(`${this.apiUrl}documents/${id}`);
  }
  updateDocument(document: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(
      `${this.apiUrl}documents/${document.id}`,
      document
    );
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}documents/${id}`, {
      responseType: 'blob',
    });
  }

  searchDocuments(
    workspaceId: string,
    searchTerm: string
  ): Observable<BaseData[]> {
    let params = new HttpParams().set('searchTerm', searchTerm);
    params = params.append('workspaceId', workspaceId);

    return this.http.get<BaseData[]>(`${this.apiUrl}searchDocuments`, {
      params,
    });
  }
}

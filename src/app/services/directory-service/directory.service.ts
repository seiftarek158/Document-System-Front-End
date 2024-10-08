import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { BaseData } from '../basedata';
import { Directory } from '../directory';
import { LoadDirectory } from '../loadDirectory';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService {
  private apiUrl =
    'http://localhost:8082/directories'

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDirectoryData(): Observable<LoadDirectory[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<LoadDirectory[]>(`${this.apiUrl}`, { headers });
  }

  updateDirectory(directory: BaseData): Observable<BaseData> {
    
    return this.http.put<BaseData>(
      `${this.apiUrl}/${directory.id}`,
      directory
    );
  }
  createDirectory(
    directory: BaseData,
    parentDirectory?: BaseData
  ): Observable<BaseData> {
    if (parentDirectory != null) {
      directory.parentId = parentDirectory.id;
      if(parentDirectory.workspaceId != null){
        directory.workspaceId = parentDirectory.workspaceId;
      }
      else{
        directory.workspaceId = parentDirectory.id;
      }

    }
    return this.http.post<BaseData>(`${this.apiUrl}`, directory);
  }
  deleteDirectory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

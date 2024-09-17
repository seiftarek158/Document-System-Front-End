import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { BaseData } from './basedata';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiUrls = [
    'http://localhost:8082/directory',
    'http://localhost:8083/directory',
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getWorkspaceData(): Observable<BaseData[]> {
    console.log('inside workspace service');
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<BaseData[]>(`${this.apiUrls[0]}/user`, { headers });
  }

  updateWorkspace(directory: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(
      `${this.apiUrls[1]}/${directory.id}`,
      directory
    );
  }
  createWorkspace(
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
    return this.http.post<BaseData>(`${this.apiUrls[1]}/new`, directory);
  }
  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrls[1]}/${id}`);
  }
}

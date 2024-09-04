import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { BaseData } from './basedata';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  
  private apiUrl = 'http://localhost:8080/directory'; // Replace with your API URL

  constructor(private http: HttpClient,private authService: AuthService) { }
  
  getWorkspaceData(): Observable<BaseData[]> {
    console.log("inside workspace service");
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<BaseData[]>(`${this.apiUrl}/user`,{ headers });

  }

  updateWorkspace(directory: BaseData): Observable<BaseData> {
    return this.http.put<BaseData>(`${this.apiUrl}/${directory.id}`, directory);
  }
  createWorkspace(directory: BaseData): Observable<BaseData> {
    return this.http.post<BaseData>(`${this.apiUrl}/new`, directory);
  }
  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

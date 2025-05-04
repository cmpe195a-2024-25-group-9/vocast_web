import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  postBackendRequest(endpoint: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, payload);
  }
}

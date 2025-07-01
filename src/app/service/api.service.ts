import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewGameRequest, NewGameResponse } from '../models/app.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  getNewGame(payload: NewGameRequest): Observable<NewGameResponse> {
    return this.http.post<NewGameResponse>(`${this.apiUrl}/api/game`, payload);
  }
}
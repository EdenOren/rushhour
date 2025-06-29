import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewGameRequest, NewGameResponse, ValidateGameRequest, ValidateGameResponse } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  
  getNewGame(payload: NewGameRequest): Observable<NewGameResponse> {
    return this.http.post<NewGameResponse>(`${this.apiUrl}/api/game`, payload);
  }
}
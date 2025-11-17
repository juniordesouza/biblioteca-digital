import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; senha: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        const token = response.token; // já vem com "Bearer ..."
        if (token) {
          sessionStorage.setItem('token', token);
        }
      })
    );
  }

  register(payload: any) {
    return this.http.post('http://localhost:8080/pessoas', payload);
  }


  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLogged(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    sessionStorage.removeItem('token');
  }
}

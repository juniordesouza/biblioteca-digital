import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';

  // Estado global do usuário
  private userState = new BehaviorSubject<{
    token: string | null,
    username: string | null,
    pendingUser: string | null
  }>({
    token: sessionStorage.getItem('token'),
    username: sessionStorage.getItem('username'),
    pendingUser: sessionStorage.getItem('pendingUser')
  });

  userState$ = this.userState.asObservable();

  constructor(private http: HttpClient) {}

  // ============================
  // LOGIN
  // ============================

  login(credentials: { username: string; senha: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          const token = response.token.replace("Bearer ", "");
          this.setApprovedUser(token, credentials.username);
        }
      })
    );
  }

  // ============================
  // CADASTRO
  // ============================

  register(payload: any) {
    return this.http.post('http://localhost:8080/pessoas', payload);
  }

  // ============================
  // SET: Usuário aprovado
  // ============================

  setApprovedUser(token: string, username: string) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    sessionStorage.removeItem('pendingUser');

    this.userState.next({
      token,
      username,
      pendingUser: null
    });
  }

  // ============================
  // SET: Usuário pendente
  // ============================

  setPendingUser(username: string) {
    sessionStorage.setItem('pendingUser', username);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    this.userState.next({
      token: null,
      username: null,
      pendingUser: username
    });
  }

  // ============================
  // GETTERS SIMPLES
  // ============================

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLogged(): boolean {
    return this.getToken() !== null;
  }

  // ============================
  // LOGOUT
  // ============================

  logout() {
    sessionStorage.clear();
    this.userState.next({
      token: null,
      username: null,
      pendingUser: null
    });
  }
}

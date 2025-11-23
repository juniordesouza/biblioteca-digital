import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/login';

  private userState = new BehaviorSubject<{
    token: string | null,
    username: string | null,
    role: string | null,
    pendingUser: string | null
  }>({
    token: sessionStorage.getItem('token'),
    username: sessionStorage.getItem('username'),
    role: sessionStorage.getItem('role'),
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
          const role = this.extractRoleFromToken(token);
          this.setApprovedUser(token, credentials.username, role);
        }
      })
    );
  }

  // Extrair role do token JWT
  extractRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      return null;
    }
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

  setApprovedUser(token: string, username: string, role: string | null) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    if (role) sessionStorage.setItem('role', role);

    sessionStorage.removeItem('pendingUser');

    this.userState.next({
      token,
      username,
      role,
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
    sessionStorage.removeItem('role');

    this.userState.next({
      token: null,
      username: null,
      role: null,
      pendingUser: username
    });
  }

  // ============================
  // GETTERS
  // ============================

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role');
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
      role: null,
      pendingUser: null
    });
  }
}

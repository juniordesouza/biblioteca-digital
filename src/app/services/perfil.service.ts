import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = 'http://localhost:8080/pessoas';

  private perfilSubject = new BehaviorSubject<any>(
    sessionStorage.getItem('perfilData')
      ? JSON.parse(sessionStorage.getItem('perfilData')!)
      : null
  );

  perfil$ = this.perfilSubject.asObservable();

  constructor(private http: HttpClient) {}

  carregarPerfil(username: string) {
    return this.http.get<any>(`${this.apiUrl}/${username}`).pipe(
      tap(perfil => {
        sessionStorage.setItem('perfilData', JSON.stringify(perfil));
        this.perfilSubject.next(perfil);
      })
    );
  }

  // 🔥 Novo método: atualiza sessão + BehaviorSubject
  atualizarPerfilLocal(perfil: any) {
    sessionStorage.setItem('perfilData', JSON.stringify(perfil));
    this.perfilSubject.next(perfil);
  }

  limparCache() {
    sessionStorage.removeItem('perfilData');
    this.perfilSubject.next(null);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {

  private apiUrl = 'http://localhost:8080/emprestimos/historico';

  // 🔥 Inicializa o histórico a partir do cache (se existir)
  private historicoSubject = new BehaviorSubject<any[]>(
    sessionStorage.getItem('historicoEmprestimos')
      ? JSON.parse(sessionStorage.getItem('historicoEmprestimos')!)
      : []
  );

  historico$ = this.historicoSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 Carrega do backend e salva em cache
  carregarHistorico(username: string) {
    const token = sessionStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiUrl}/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(hist => {
        sessionStorage.setItem('historicoEmprestimos', JSON.stringify(hist));
        this.historicoSubject.next(hist);
      })
    );
  }

  // 🔥 Atualizar o histórico após novo empréstimo
  adicionarEmprestimo(item: any) {
    const atual = this.historicoSubject.value;
    const atualizado = [item, ...atual];

    sessionStorage.setItem('historicoEmprestimos', JSON.stringify(atualizado));
    this.historicoSubject.next(atualizado);
  }

  // 🔥 Limpa cache ao deslogar
  limparCache() {
    sessionStorage.removeItem('historicoEmprestimos');
    this.historicoSubject.next([]);
  }
}

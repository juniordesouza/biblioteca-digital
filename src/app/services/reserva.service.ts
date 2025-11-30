import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/reservas/historico';

  // 🔥 Inicializa com o cache da sessionStorage se existir
  private historicoReservaSubject = new BehaviorSubject<any[]>(
    sessionStorage.getItem('historicoReservas')
      ? JSON.parse(sessionStorage.getItem('historicoReservas')!)
      : []
  );

  historicoReservas$ = this.historicoReservaSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 Carrega do backend e salva no cache da sessão
  carregarHistorico(username: string) {
    const token = sessionStorage.getItem('token');

    return this.http.get<{ data: any[] }>(`${this.apiUrl}/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(resp => {
        const lista = resp.data ?? [];

        sessionStorage.setItem('historicoReservas', JSON.stringify(lista));
        this.historicoReservaSubject.next(lista);
      })
    );
  }

  // 🔥 Atualizar após nova reserva
  adicionarReserva(item: any) {
    const atual = this.historicoReservaSubject.value;
    const atualizado = [item, ...atual];

    sessionStorage.setItem('historicoReservas', JSON.stringify(atualizado));
    this.historicoReservaSubject.next(atualizado);
  }

  // 🔥 Limpar cache ao sair
  limparCache() {
    sessionStorage.removeItem('historicoReservas');
    this.historicoReservaSubject.next([]);
  }
}

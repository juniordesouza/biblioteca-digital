import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-dialog.component.html',
  styleUrls: ['./historico-dialog.component.css']
})
export class HistoricoDialogComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  username = '';
  loading = false;

  constructor(private http: HttpClient) {}

  buscar() {
    if (!this.username.trim()) return;

    this.loading = true;

    const token = sessionStorage.getItem('token');

    this.http.get(
      `http://localhost:8080/historico/${this.username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res: any) => {
        this.submitted.emit(res.mensagem || "Histórico carregado com sucesso.");
      },
      error: () => {
        this.submitted.emit("Erro ao buscar o histórico do usuário.");
      },
      complete: () => {
        this.loading = false;
        this.close.emit();
      }
    });
  }
}

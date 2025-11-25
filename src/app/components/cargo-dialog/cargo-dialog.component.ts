import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cargo-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cargo-dialog.component.html',
  styleUrls: ['./cargo-dialog.component.css']
})
export class CargoDialogComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>(); 

  username = '';
  cpf = '';
  role = 'usuario';

  loading = false;

  constructor(private http: HttpClient) {}

  submit() {
    this.loading = true;

    const token = sessionStorage.getItem('token');

    this.http.put(
      'http://localhost:8080/funcionarios/trocar-cargo',
      { username: this.username, cpf: this.cpf, role: this.role },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res: any) => {
        this.submitted.emit(res.mensagem || "Cargo alterado com sucesso.");
      },
      error: () => {
        this.submitted.emit("Erro ao alterar cargo.");
      },
      complete: () => {
        this.loading = false;
        this.close.emit();
      }
    });
  }
}

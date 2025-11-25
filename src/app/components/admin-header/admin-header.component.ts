import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CargoDialogComponent } from '../cargo-dialog/cargo-dialog.component';
import { HistoricoDialogComponent } from '../historico-dialog/historico-dialog.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, FormsModule, CargoDialogComponent, HistoricoDialogComponent],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  username: string | null = null;

  // popup genérico (mantido para compatibilidade com código já existente)
  popupVisible = false;
  popupTitle = '';
  inputValue = '';

  // novo: controle do dialog de trocar cargo
  showCargoDialog = false;
  showHistoricoDialog = false;

  // pequeno toast local para exibir resposta do backend
  showAlert = false;
  alertMessage = '';

  constructor(private router: Router) {
    this.username = sessionStorage.getItem('username');
    this.username = this.username ? this.username.toUpperCase() : null;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // abrir o dialog de trocar cargo (usa o componente criado)
  abrirPopupTrocarCargo() {
    // evita conflito com o popup genérico
    this.popupVisible = false;
    this.popupTitle = 'Trocar Cargo';
    this.showCargoDialog = true;
  }

  fecharPopup() {
    this.popupVisible = false;
  }

  confirmarPopup() {
    console.log("Valor digitado:", this.inputValue);
    this.popupVisible = false;
  }

  abrirPopupHistorico() {
    this.showHistoricoDialog = true;
  }

  onHistoricoSubmitted(msg: string) {
    this.showToast(msg);
  }

  // callback a partir do CargoDialogComponent quando o backend responder
  onCargoSubmitted(message: string) {
    // mostra um toast local sem depender de outros componentes
    this.showToast(message || 'Cargo alterado.');
    // fecha o dialog
    this.showCargoDialog = false;
  }

  // mostra um toast simples no header
  private showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3500);
  }
}

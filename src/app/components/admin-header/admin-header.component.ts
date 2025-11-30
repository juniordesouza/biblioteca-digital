import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// IMPORTAÇÃO DOS DIALOGS
import { CargoDialogComponent } from '../cargo-dialog/cargo-dialog.component';
import { HistoricoDialogComponent } from '../historico-dialog/historico-dialog.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CargoDialogComponent,
    HistoricoDialogComponent
  ],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  username: string | null = null;

  // popup genérico legado (ainda existe para compatibilidade)
  popupVisible = false;
  popupTitle = '';
  inputValue = '';

  // novos dialogs modernos
  showCargoDialog = false;
  showHistoricoDialog = false;

  // toast local
  showAlert = false;
  alertMessage = '';

  constructor(private router: Router) {
    this.username = sessionStorage.getItem('username');
    this.username = this.username ? this.username.toUpperCase() : null;
  }

  // sidebar
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  // logout
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // abrir dialog de cargo
  abrirPopupTrocarCargo() {
    // fecha o popup antigo se estiver aberto
    this.popupVisible = false;

    this.popupTitle = 'Trocar Cargo';
    this.showCargoDialog = true;
  }

  // popup legado
  fecharPopup() {
    this.popupVisible = false;
  }

  confirmarPopup() {
    console.log('Valor digitado:', this.inputValue);
    this.popupVisible = false;
  }

  // abrir dialog de histórico moderno
  abrirPopupHistorico() {
    this.showHistoricoDialog = true;
  }

  // callback do histórico (vem do HistoricoDialogComponent)
  onHistoricoSubmitted(message: string) {
    this.showToast(message);
    this.showHistoricoDialog = false;
  }

  // callback do cargo (vem do CargoDialogComponent)
  onCargoSubmitted(message: string) {
    this.showToast(message || 'Cargo alterado.');
    this.showCargoDialog = false;
  }

  // toast local
  private showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3500);
  }
}

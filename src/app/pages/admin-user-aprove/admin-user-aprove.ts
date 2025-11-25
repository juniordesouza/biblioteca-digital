import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-user-aprove',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, FormsModule,
    SidebarComponent, AdminHeaderComponent, ToastComponent
  ],
  templateUrl: './admin-user-aprove.html',
  styleUrl: './admin-user-aprove.css'
})
export class AdminUserAprove implements OnInit {

  sidebarOpen = true;
  usuarios: any[] = [];
  allSelected = false;

  // 🔥 Toast
  showAlert = false;
  alertMessage = '';

  // 🔥 Popup de confirmação
  popupRejectVisible = false;
  popupRejectUser: string | null = null;

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // ============================================================
  // 🔄 Carregar lista de pendentes
  // ============================================================
  loadUsers(): void {
    const token = sessionStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/pessoas/usuarios',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: response => {
        this.usuarios = response
          .filter(user => user.status === 'PENDENTE')
          .map(user => ({
            ...user,
            birthDate: this.formatDate(user.dtNascimento),
            selected: false
          }));

        this.allSelected = false;
      },
      error: err => console.error("Erro ao buscar usuários:", err)
    });
  }

  // ============================================================
  // 🔥 Toast global
  // ============================================================
  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // ============================================================
  // ✔ Aprovar usuário (individual)
  // ============================================================
  aprovarUsuario(username: string): void {
    const token = sessionStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/funcionarios/aprovar-usuario/${username}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res: any) => {
        this.showToast(res.mensagem || "Usuário aprovado.");
        this.loadUsers();
      },
      error: (err) => {
        this.showToast("Erro ao aprovar usuário.");
      }
    });
  }

  // ============================================================
  // 📅 Formatar datas
  // ============================================================
  formatDate(dateString: string): string {
    if (!dateString || dateString.length !== 8) return dateString;
    return `${dateString.substring(6,8)}/${dateString.substring(4,6)}/${dateString.substring(0,4)}`;
  }

  // ============================================================
  // 🔘 Selecionar tudo
  // ============================================================
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.usuarios.forEach(u => u.selected = checked);
  }

  updateSelectAllState(): void {
    this.allSelected = this.usuarios.length > 0 &&
                       this.usuarios.every(u => u.selected);
  }

  // ============================================================
  // ❌ POPUP — abrir para um usuário
  // ============================================================
  openRejectPopup(username: string) {
    this.popupRejectUser = username;
    this.popupRejectVisible = true;
  }

  // ============================================================
  // ❌ POPUP — fechar
  // ============================================================
  closeRejectPopup() {
    this.popupRejectVisible = false;
    this.popupRejectUser = null;
  }

  // ============================================================
  // ❌ Confirmar exclusão do usuário
  // ============================================================
  confirmReject() {
    if (!this.popupRejectUser) return;

    const token = sessionStorage.getItem('token');

    this.http.delete(
      `http://localhost:8080/pessoas/${this.popupRejectUser}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res: any) => {
        this.showToast(res.message || "Usuário deletado.");
        this.loadUsers();
      },
      error: err => {
        this.showToast("Erro ao deletar usuário.");
        console.error(err);
      },
      complete: () => {
        this.closeRejectPopup();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SidebarComponent,
    AdminHeaderComponent,
    ToastComponent
  ],
  templateUrl: './admin-user-list.html',
  styleUrl: './admin-user-list.css'
})
export class AdminUserList implements OnInit {

  sidebarOpen = true;
  usuarios: any[] = [];
  allSelected = false;

  showAlert = false;
  alertMessage = '';

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const token = sessionStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/pessoas/usuarios',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: response => {
        this.usuarios = response.map(user => ({
          ...user,
          birthDate: this.formatDate(user.dtNascimento),
          selected: false
        }));
        this.allSelected = false;
      },
      error: err => console.error('Erro ao buscar usuários:', err)
    });
  }

  /** 🔥 Toast */
  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3500);
  }

  /** 🔥 Banir */
  banirUsuario(username: string) {
    const token = sessionStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/pessoas/${username}/bloquear`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.showToast(`Usuário ${username} bloqueado.`);
        this.loadUsers();
      },
      error: err => this.showToast("Erro ao bloquear usuário.")
    });
  }

  /** 🔥 Desbanir */
  desbanirUsuario(username: string) {
    const token = sessionStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/pessoas/${username}/desbanir`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.showToast(`Usuário ${username} desbloqueado.`);
        this.loadUsers();
      },
      error: err => this.showToast("Erro ao desbloquear usuário.")
    });
  }

  /** 🔥 Banir em massa */
  banirSelecionados() {
    const selecionados = this.usuarios.filter(u => u.selected);

    if (selecionados.length === 0)
      return this.showToast("Nenhum usuário selecionado.");

    selecionados.forEach(u => this.banirUsuario(u.username));
  }

  /** 🔥 Desbanir em massa */
  desbanirSelecionados() {
    const selecionados = this.usuarios.filter(u => u.selected);

    if (selecionados.length === 0)
      return this.showToast("Nenhum usuário selecionado.");

    selecionados.forEach(u => this.desbanirUsuario(u.username));
  }

  /** Formatador */
  formatDate(dateString: string): string {
    if (!dateString || dateString.length !== 8) return dateString;

    return `${dateString.substring(6, 8)}/${dateString.substring(4, 6)}/${dateString.substring(0, 4)}`;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.usuarios.forEach(u => u.selected = checked);
  }

  updateSelectAllState(): void {
    this.allSelected = this.usuarios.length > 0 &&
                       this.usuarios.every(u => u.selected);
  }

}

import { Component, OnInit, signal } from '@angular/core';
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

  // 🔥 Toast signals
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

  /** 🔥 Toast reutilizável */
  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  /** 🔥 Aprovar usuário individual */
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
      error: () => {
        this.showToast("Erro ao aprovar usuário.");
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString.length !== 8) return dateString;
    return `${dateString.substring(6,8)}/${dateString.substring(4,6)}/${dateString.substring(0,4)}`;
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

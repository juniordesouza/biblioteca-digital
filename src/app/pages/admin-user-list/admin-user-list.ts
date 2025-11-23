import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-user-list.html',
  styleUrl: './admin-user-list.css'
})
export class AdminUserList implements OnInit {
  sidebarOpen = true;
  usuarios: any[] = [];
  allSelected = false; 

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  /** 🔹 Carrega usuários do backend Spring */
loadUsers(): void {
  const token = sessionStorage.getItem('token');

  this.http.get<any[]>(
    'http://localhost:8080/pessoas/usuarios',
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  .subscribe({
    next: response => {
      this.usuarios = response.map(user => ({
        username: user.username,
        fullName: user.nome,
        email: user.email,
        birthDate: this.formatDate(user.dtNascimento),
        cpf: user.cpf,
        endereco: user.endereco,
        telefone: user.telefone,
        sexo: user.sexo,
        role: user.roleString,
        status: user.status,
        selected: false
      }));

      this.allSelected = false;
    },
    error: err => console.error("Erro ao buscar usuários:", err)
  });
}


  /** 🔹 Converte "yyyyMMdd" em "dd/MM/yyyy" */
  formatDate(dateString: string): string {
    if (!dateString || dateString.length !== 8) return dateString;

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${day}/${month}/${year}`;
  }

  /** 🔹 Selecionar / desmarcar todos */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.usuarios.forEach((u) => (u.selected = checked));
  }

  /** 🔹 Atualiza checkbox principal */
  updateSelectAllState(): void {
    this.allSelected = this.usuarios.length > 0 && this.usuarios.every((u) => u.selected);
  }

  banirUsuario(username: string) {
    const token = sessionStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/pessoas/${username}/bloquear`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: () => this.loadUsers(),
      error: err => console.error("Erro ao banir:", err)
    });
  }

  desbanirUsuario(username: string) {
    const token = sessionStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/pessoas/${username}/desbanir`, // 🔥 você cria esse endpoint no backend
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: () => this.loadUsers(),
      error: err => console.error("Erro ao desbanir:", err)
    });
  }

  banirSelecionados() {
    const selecionados = this.usuarios.filter(u => u.selected);

    if (selecionados.length === 0) return;

    selecionados.forEach(u => this.banirUsuario(u.username));
  }

  desbanirSelecionados() {
    const selecionados = this.usuarios.filter(u => u.selected);

    if (selecionados.length === 0) return;

    selecionados.forEach(u => this.desbanirUsuario(u.username));
  }


}

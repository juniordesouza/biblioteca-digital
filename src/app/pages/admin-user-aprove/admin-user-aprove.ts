import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-aprove',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-user-aprove.html',
  styleUrl: './admin-user-aprove.css'
})
export class AdminUserAprove implements OnInit {
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

  loadUsers(): void {
    const token = sessionStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/pessoas/usuarios',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: response => {

        this.usuarios = response
          .filter(user => user.status === 'PENDENTE')   // <<< 🔥 SOMENTE PENDENTES
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
}

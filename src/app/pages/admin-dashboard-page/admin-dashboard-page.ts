import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css']
})
export class AdminDashboardPage implements OnInit {
  sidebarOpen = false;
  usuarios: any[] = [];
  currentPage = 1;
  totalPages = 10;
  allSelected = false; // ✅ controla o checkbox do cabeçalho

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }

  /** 🔹 Carrega usuários da API Random User */
  loadUsers(page: number): void {
    this.http
      .get<any>(`https://randomuser.me/api/?page=${page}&results=10&seed=adminSeed`)
      .subscribe({
        next: (response) => {
          this.usuarios = response.results.map((user: any) => ({
            username: user.login.username,
            fullName: `${user.name.first} ${user.name.last}`,
            email: user.email,
            birthDate: new Date(user.dob.date).toLocaleDateString(),
            cpf: user.id.value || 'N/A',
            cep: user.location.postcode || 'N/A',
            number: user.location.street.number,
            phone: user.phone,
            selected: false // ✅ adiciona propriedade local
          }));

          // reset do "selecionar todos" ao mudar de página
          this.allSelected = false;
        },
        error: (err) => console.error('Erro ao buscar usuários:', err),
      });
  }

  /** 🔹 Alterna "selecionar todos" */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.usuarios.forEach((u) => (u.selected = checked));
  }

  /** 🔹 Atualiza o estado do checkbox principal conforme seleção individual */
  updateSelectAllState(): void {
    this.allSelected = this.usuarios.length > 0 && this.usuarios.every((u) => u.selected);
  }

  /** 🔹 Navegação de páginas */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(this.currentPage);
    }
  }
}

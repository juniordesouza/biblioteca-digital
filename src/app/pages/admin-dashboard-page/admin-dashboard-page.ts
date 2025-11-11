import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css']
})
export class AdminDashboardPage implements OnInit {
  sidebarOpen = false;
  usuarios: any[] = [];
  currentPage = 1;
  totalPages = 10;

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }

  loadUsers(page: number): void {
    this.http.get<any>(`https://randomuser.me/api/?page=${page}&results=10&seed=adminSeed`).subscribe({
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
        }));
      },
      error: (err) => console.error('Erro ao buscar usuários:', err)
    });
  }

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

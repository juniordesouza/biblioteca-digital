import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule], // ✅ habilita *ngFor, *ngIf etc
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css']
})
export class AdminDashboardPage implements OnInit {
  usuarios: any[] = [];
  currentPage = 1;
  totalPages = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://randomuser.me/api/?results=10').subscribe({
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
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}

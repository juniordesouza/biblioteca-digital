import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.html',
  styleUrls: ['./admin-dashboard-page.css']
})
export class AdminDashboardPage implements OnInit {

  // Dados simulados (serão substituídos pela API depois)
  users: any[] = [];
  currentPage = 1;
  totalPages = 10;

  constructor() {}

  ngOnInit(): void {
    // Aqui futuramente vai a chamada da API
    this.loadUsers();
  }

  loadUsers(): void {
    // Simulação de dados (mock)
    this.users = Array.from({ length: 10 }, (_, i) => ({
      username: `Fulaninho${i + 1}`,
      fullName: 'Fulano da Silva',
      email: `fulano${i + 1}@gmail.com`,
      birthDate: '31/02/1982',
      cpf: '499.490.838-8',
      cep: '01234-567',
      number: '0123',
      phone: '(11)91234-5678'
    }));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}

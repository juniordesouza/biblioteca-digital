import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-list-books',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-list-books.html',
  styleUrls: ['./admin-list-books.css']
})
export class AdminListBooks implements OnInit {

  sidebarOpen = true;
  livros: any[] = [];
  allSelected = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /** 🔹 Carrega livros do backend Spring */
  loadBooks(): void {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(
      'http://localhost:8080/livros?page=0&size=100',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .subscribe({
      next: response => {

        // conteúdo real fica dentro de: response.data.content
        this.livros = response.data.content.map((book: any) => ({
          titulo: book.titulo,
          autor: book.autor ?? '—',
          editora: book.editora,
          tema: book.tema ?? '—',
          anoLancamento: book.anoLancamento,
          sinopse: book.sinopse,
          status: this.extractStatus(book.status),
          ativo: book.flagAtivo,
          selected: false
        }));

        this.allSelected = false;
      },
      error: err => console.error("Erro ao buscar livros:", err)
    });
  }

  /** 🔹 Extrai nome do status do formato esquisito "StatusLivro{id=1, nome='DISPONIVEL'}" */
  extractStatus(statusString: string): string {
    if (!statusString) return 'Desconhecido';

    const match = statusString.match(/nome='([^']+)'/);
    return match ? match[1] : statusString;
  }

  /** 🔹 Selecionar / desmarcar todos */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.livros.forEach(l => l.selected = checked);
  }

  /** 🔹 Atualiza checkbox principal */
  updateSelectAllState(): void {
    this.allSelected = this.livros.length > 0 && this.livros.every(l => l.selected);
  }
}

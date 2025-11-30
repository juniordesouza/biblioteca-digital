import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-list-books',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, FormsModule,
    SidebarComponent, AdminHeaderComponent, ToastComponent
  ],
  templateUrl: './admin-list-books.html',
  styleUrls: ['./admin-list-books.css']
})
export class AdminListBooks implements OnInit {

  sidebarOpen = true;
  livros: any[] = [];
  allSelected = false;

  // 🔥 TOAST GLOBAL
  showAlert = false;
  alertMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /** 🔥 Mostrar toast */
  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  /** 🔹 Carrega livros (EXCETO capa) */
  loadBooks(): void {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(
      'http://localhost:8080/livros?page=0&size=1000',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: res => {
        this.livros = res.data.content.map((b: any) => ({
          id: b.id,
          titulo: b.titulo,
          autor: b.autor ?? '—',
          editora: b.editora ?? '—',
          tema: b.tema ?? '—',
          obra: b.obra ?? '—',
          tags: Array.isArray(b.tags) ? b.tags.join(', ') : '—',
          anoLancamento: b.anoLancamento ?? '—',
          quantidadeDisponivel: b.quantidadeDisponivel ?? 0,
          status: b.status ?? '—',
          ativo: b.flagAtivo,
          selected: false
        }));

        this.allSelected = false;
      },
      error: err => {
        console.error("Erro ao carregar livros:", err);
        this.showToast("Erro ao carregar livros.");
      }
    });
  }

  /** Selecionar / desmarcar todos */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.livros.forEach(l => l.selected = checked);
  }

  updateSelectAllState(): void {
    this.allSelected = this.livros.length > 0 && this.livros.every(l => l.selected);
  }

  /** 🔥 Desativar livros selecionados */
  desativarSelecionados(): void {
    const selecionados = this.livros
      .filter(l => l.selected)
      .map(l => l.id);

    if (selecionados.length === 0) {
      this.showToast("Nenhum livro selecionado.");
      return;
    }

    const token = sessionStorage.getItem('token');

    this.http.post(
        "http://localhost:8080/livros/desativar-multiplos",
        selecionados,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .subscribe({
        next: (res: any) => {
          this.showToast(res.message || "Livros desativados com sucesso!");
          this.loadBooks();
        },
        error: err => {
          console.error(err);
          this.showToast("Erro ao desativar livros.");
        }
      });
  }
}

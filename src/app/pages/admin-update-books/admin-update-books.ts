import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-update-books',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SidebarComponent,
    AdminHeaderComponent,
    ToastComponent
  ],
  templateUrl: './admin-update-books.html',
  styleUrls: ['./admin-update-books.css']
})
export class AdminUpdateBooks implements OnInit {

  sidebarOpen = true;

  searchId = "";
  showAlert = false;
  alertMessage = "";

  livro: any = null;
  carregando = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3500);
  }

  buscarLivro() {
    const id = this.searchId.trim();
    if (!id) {
      this.showToast("Informe o ID do livro.");
      return;
    }

    const token = sessionStorage.getItem("token");
    this.carregando = true;

    this.http.get<any>(
      `http://localhost:8080/livros/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res) => {
        this.livro = res.data;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.showToast("❌ Livro não encontrado.");
      }
    });
  }

  salvarAlteracoes() {
    if (!this.livro) return;

    const token = sessionStorage.getItem("token");
    const id = this.livro.id;

    // Monta o DTO exatamente como o backend exige
    const dto = {
      titulo: this.livro.titulo || "",
      autor: this.livro.autor || "",
      editora: this.livro.editora || "",
      tema: this.livro.tema || "",
      obra: this.livro.obra || "",
      tags: Array.isArray(this.livro.tags)
        ? this.livro.tags
        : String(this.livro.tags).split(",").map(t => t.trim()).filter(Boolean),

      anoLancamento: this.livro.anoLancamento || "",
      sinopse: this.livro.sinopse || "",
      quantidadeDisponivel: Number(this.livro.quantidadeDisponivel ?? 0),

      // campo especial
      codObra: this.livro.codObra ?? null,

      dtValidade: this.livro.dtValidade || "",
      uriImgLivro: this.livro.uriImgLivro || "",
      uriArquivoLivro: this.livro.uriArquivoLivro || ""
    };

    this.http.put(`http://localhost:8080/livros/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: () => {
        this.showToast("✔️ Livro atualizado com sucesso.");
      },
      error: (err) => {
        console.error(err);
        this.showToast("❌ Erro ao atualizar livro.");
      }
    });
  }


  normalizeThumb(uri: string) {
    if (!uri) return null;
    const cleaned = uri.replace(/\\/g, "/");
    if (cleaned.startsWith("/uploads")) return `http://localhost:8080${cleaned}`;
    return cleaned;
  }
}

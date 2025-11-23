import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-register-book',
  standalone: true,
  templateUrl: './admin-register-book.html',
  styleUrls: ['./admin-register-book.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent, ToastComponent]
})
export class AdminRegisterBook implements OnInit {

  sidebarOpen = true;

  editoras: any[] = [];

  livro: any = {
    txt_titulo: '',
    autor: '',
    editora: '',
    tema: '',
    ano_lancamento: '',
    quantidade_disponivel: 1,
    txt_sinopse: ''
  };

  capaFile: File | null = null;
  pdfFile: File | null = null;
  previewCapa: string | null = null;

  // TOAST
  showAlert = false;
  alertMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadEditoras();
  }

  loadEditoras() {
    this.http.get<any[]>('http://localhost:8080/editoras')
      .subscribe(resp => this.editoras = resp);
  }

  // CAPA
  onCapaSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.capaFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewCapa = reader.result as string;
    reader.readAsDataURL(file);
  }

  // PDF
  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.pdfFile = file;
  }

  // TOAST FUNCTION
  showToast(message: string) {
    this.zone.run(() => {
      this.alertMessage = message;
      this.showAlert = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.zone.run(() => {
          this.showAlert = false;
          this.cdr.markForCheck();
        });
      }, 3500);
    });
  }

  // SALVAR
  salvarLivro() {
    const token = sessionStorage.getItem('token');

    const dto = {
      titulo: this.livro.txt_titulo,
      autor: this.livro.autor,
      editora: this.livro.editora,
      tema: this.livro.tema,
      tags: [],
      anoLancamento: this.livro.ano_lancamento,
      quantidadeDisponivel: this.livro.quantidade_disponivel,
      sinopse: this.livro.txt_sinopse
    };

    const formData = new FormData();
    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    if (this.capaFile) formData.append("capa", this.capaFile);
    if (this.pdfFile) formData.append("pdf", this.pdfFile);

    this.http.post(
      "http://localhost:8080/livros/upload",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: () => {
        this.showToast("📚 Livro cadastrado com sucesso!");
        this.resetForm();
      },
      error: err => {
        console.error(err);
        this.showToast("❌ Erro ao salvar o livro");
      }
    });
  }

  // RESET
  resetForm() {
    this.livro = {
      txt_titulo: '',
      autor: '',
      editora: '',
      tema: '',
      ano_lancamento: '',
      quantidade_disponivel: 1,
      txt_sinopse: ''
    };

    this.capaFile = null;
    this.pdfFile = null;
    this.previewCapa = null;
  }
}

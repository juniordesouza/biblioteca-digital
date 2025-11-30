import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-book-reader-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MenuComponent],
  templateUrl: './book-reader-page.html',
  styleUrls: ['./book-reader-page.css']
})
export class BookReaderPage implements OnInit {

  pdfUrl: SafeResourceUrl | null = null;
  bookTitle = '';
  acessoPermitido = false;

  username = ''; // pego da session
  livroId = 0;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    if (!user || !token) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = user;
    this.livroId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.livroId) {
      return;
    }

    this.validarAcesso();
  }

  /** ===============================
   * 1️⃣ VERIFICAR SE USUÁRIO TEM ACESSO
   ================================= */
  validarAcesso() {
    const token = sessionStorage.getItem("token");

    this.http.get<any[]>(
      `http://localhost:8080/emprestimos/usuario/${this.username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: emprestimos => {
        const ativo = emprestimos.some(e =>
          e.livroId === this.livroId && e.status === "ATIVO"
        );

        if (!ativo) {
          this.acessoPermitido = false;
          return;
        }

        this.acessoPermitido = true;
        this.carregarLivro();
      },
      error: () => this.acessoPermitido = false
    });
  }

  /** ===============================
   * 2️⃣ CARREGA O PDF PELO ID
   ================================= */
  carregarLivro() {
    const token = sessionStorage.getItem("token");

    this.http.get<any>(
      `http://localhost:8080/livros/${this.livroId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (resp) => {
        const livro = resp.data;
        this.bookTitle = livro.titulo;

        const pdf = `http://localhost:8080${livro.urlLivro}`;

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdf);
      },
      error: () => this.acessoPermitido = false
    });
  }

  /** ===============================
   * Bloqueio de teclas (Ctrl+C, Ctrl+S, Ctrl+P)
   ================================= */
  @HostListener('document:keydown', ['$event'])
  blockKeys(e: KeyboardEvent) {
    if (
      (e.ctrlKey && ['c', 's', 'p', 'u'].includes(e.key.toLowerCase())) ||
      e.key === 'PrintScreen'
    ) {
      e.preventDefault();
    }
  }

  /** ===============================
   * Bloqueio do botão direito
   ================================= */
  @HostListener('document:contextmenu', ['$event'])
  blockContextMenu(e: MouseEvent) {
    e.preventDefault();
  }
}

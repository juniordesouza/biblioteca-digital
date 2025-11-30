import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselNetflixComponent } from '../../components/carousel-netflix/carousel-netflix.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, CarouselNetflixComponent, MenuComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Ajuste aqui para os temas que você quer exibir (devem existir no banco)
  categories = signal<string[]>([
    'Tecnologia',
    'Ficção',
    'Fantasia',
    'História',
    'Aventura',
    'Mistério'
  ]);

  // guarda os livros por categoria (todos os livros retornados pelo endpoint)
  booksByCategory = signal<Record<string, Array<{ id: number; title: string; author: string; thumbnail: string }>>>({});

  ngOnInit() {
    this.loadBooksByThemes();
  }

  /**
   * Normaliza a URI de capa retornada pelo backend.
   * - Se for /uploads/... -> prefixa base do servidor
   * - Se for caminho Windows (C:\...) -> converte backslashes (pode não ser acessível do browser)
   * - Se for já um URL absoluto (http(s)://) -> retorna direto
   */
  private normalizeThumbnail(uri?: string): string {
    if (!uri) {
      return 'https://via.placeholder.com/150x220?text=Sem+Capa';
    }

    // converte backslashes para slash
    const cleaned = uri.replace(/\\/g, '/').trim();

    // já é uma URL absoluta
    if (/^https?:\/\//i.test(cleaned)) {
      return cleaned;
    }

    // caminho relativo público que começa com /uploads ou uploads
    if (cleaned.startsWith('/uploads') || cleaned.startsWith('uploads')) {
      // ajuste base se necessário (troque host/porta se o backend estiver em outro lugar)
      return `http://localhost:8080${cleaned.startsWith('/') ? cleaned : '/' + cleaned}`;
    }

    // caminho Windows convertido -> provavelmente não acessível via HTTP,
    // mas tentamos retornar como-is (com barras) caso você sirva arquivos por rota especial
    if (/^[a-zA-Z]:\//.test(cleaned)) {
      // opcional: se você tiver um endpoint que converte paths locais, adapte aqui
      return cleaned;
    }

    // fallback: placeholder
    return 'https://via.placeholder.com/150x220?text=Sem+Capa';
  }

  /**
   * Carrega, para cada tema listado em `categories`, todos os livros vindos do endpoint:
   * GET http://localhost:8080/livros/tema/{tema}
   */
  loadBooksByThemes() {
    const token = sessionStorage.getItem('token');

    this.categories().forEach((tema) => {
      const url = `http://localhost:8080/livros/tema/${encodeURIComponent(tema)}`;

      this.http.get<any>(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }).subscribe({
        next: (res) => {
          const arr: any[] = Array.isArray(res?.data) ? res.data : [];

          const books = arr.map(livro => ({
            id: livro.id,
            title: livro.titulo ?? 'Título não informado',
            author: livro.autor ?? (livro.autores ? livro.autores.join(', ') : 'Autor desconhecido'),
            thumbnail: this.normalizeThumbnail(livro.uriImgLivro)
          }));

          this.booksByCategory.update(prev => ({ ...prev, [tema]: books }));
        },
        error: (err) => {
          console.error(`Erro ao carregar tema ${tema}:`, err);
          // mantém a chave presente mesmo se der erro, evitando undefined no template
          this.booksByCategory.update(prev => ({ ...prev, [tema]: [] }));
        }
      });
    });
  }

  openBookDetails(bookId: number | string) {
    if (!bookId) return;
    this.router.navigate(['/livros', bookId]);
  }
}
  
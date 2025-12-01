import { Component, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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

  categories = signal<string[]>([
    'Fiction',
    'Computers',
    'History',
    'Science',
    'Juvenile Fiction',
    'Philosophy'
  ]);

  booksByCategory = signal<Record<string, any[]>>({});
  searchResults = signal<any[]>([]);
  searchText = signal('');

  private debounceTimer: any = null;

  // Quando searchText tem valor → estamos buscando
  isSearching = computed(() => this.searchText().trim().length > 0);

  constructor() {

    // 🔥 EVENTO GLOBAL DA BARRA DE BUSCA DO MENU
    window.addEventListener('catalog-search', (e: any) => {
      this.searchText.set(e.detail ?? '');
    });

    // 🔥 EFEITO PARA RODAR BUSCA COM DEBOUNCE
    effect(() => {
      const query = this.searchText().trim();

      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      if (query === '') {
        this.searchResults.set([]);
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.executeSearch(query);
      }, 800);
    });
  }

  ngOnInit() {
    this.loadBooksByThemes();
  }

  private normalizeThumbnail(uri?: string): string {
    if (!uri) return 'https://via.placeholder.com/150x220?text=Sem+Capa';
    const cleaned = uri.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    if (cleaned.startsWith('/uploads')) return `http://localhost:8080${cleaned}`;
    return 'https://via.placeholder.com/150x220?text=Sem+Capa';
  }

  // 🔥 BUSCA GLOBAL
  executeSearch(q: string) {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(
      `http://localhost:8080/livros/search?q=${encodeURIComponent(q)}&page=0&size=1000`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    .subscribe({
      next: (resp) => {
        const content = resp?.data?.content ?? [];
        this.searchResults.set(
          content.map((l: any) => ({
            id: l.id,
            title: l.titulo,
            author: l.autor ?? l.autores?.join(', ') ?? 'Autor desconhecido',
            thumbnail: this.normalizeThumbnail(l.uriImgLivro)
          }))
        );
      },
      error: () => this.searchResults.set([])
    });
  }

  // 🔥 CARREGAR CATEGORIAS
  loadBooksByThemes() {
    const token = sessionStorage.getItem('token');

    this.categories().forEach(tema => {
      this.http.get<any>(
        `http://localhost:8080/livros/tema/${encodeURIComponent(tema)}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      .subscribe({
        next: (res) => {
          const arr = res?.data ?? [];
          const books = arr.map((l: any) => ({
            id: l.id,
            title: l.titulo,
            author: l.autor ?? l.autores?.join(', ') ?? 'Autor desconhecido',
            thumbnail: this.normalizeThumbnail(l.uriImgLivro)
          }));

          this.booksByCategory.update(prev => ({ ...prev, [tema]: books }));
        },
        error: () =>
          this.booksByCategory.update(prev => ({ ...prev, [tema]: [] }))
      });
    });
  }

  openBookDetails(bookId: number | string) {
    if (!bookId) return;
    this.router.navigate(['/livros', bookId]);
  }
}

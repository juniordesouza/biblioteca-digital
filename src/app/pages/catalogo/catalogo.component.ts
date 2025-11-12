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

  categories = signal<string[]>([
    'Fiction',
    'Science',
    'Technology',
    'History',
    'Fantasy',
    'Mystery',
  ]);

  booksByCategory = signal<Record<string, any[]>>({});

  ngOnInit() {
    this.loadBooks();
  }

  /** Corrige URLs de imagens quebradas (HTTP → HTTPS + fallback) */
  private normalizeThumbnail(url?: string): string {
    if (!url) return 'https://via.placeholder.com/150x220?text=Sem+Capa';
    return url.startsWith('http://')
      ? url.replace('http://', 'https://')
      : url;
  }

  /** Busca livros reais da API do Google Books */
  loadBooks() {
    this.categories().forEach((category) => {
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=10`;

      this.http.get(apiUrl).subscribe({
        next: (data: any) => {
          const books = (data.items ?? []).map((item: any) => {
            const info = item.volumeInfo ?? {};
            const images = info.imageLinks ?? {};

            const thumbnail =
              this.normalizeThumbnail(images.thumbnail) ||
              this.normalizeThumbnail(images.smallThumbnail);

            return {
              id: item.id,
              title: info.title ?? 'Título não informado',
              author: info.authors?.join(', ') ?? 'Autor desconhecido',
              thumbnail,
            };
          });

          this.booksByCategory.update((prev) => ({
            ...prev,
            [category]: books,
          }));
        },
        error: (err) =>
          console.error(`Erro ao buscar livros de ${category}:`, err),
      });
    });
  }

  /** Navega para página de detalhes do livro */
  openBookDetails(bookId: string) {
    if (!bookId) {
      console.warn('ID do livro inválido:', bookId);
      return;
    }
    this.router.navigate(['/livros', bookId]);
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';


@Component({
  selector: 'app-livro-details',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './livro-details.component.html',
  styleUrls: ['./livro-details.component.css'],
})
export class LivroDetailsComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  // estado principal
  book = signal<any>({
    cover: '',
    title: '',
    author: '',
    publisher: '',
    theme: '',
    description: '',
    stock: 0,
    rating: 0,
  });

  loading = signal<boolean>(true);
  showFullDescription = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || 'zyTCAlFPjgYC';
      this.loadBook(id);
    });
  }

  loadBook(id: string) {
    this.loading.set(true);
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;

    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        const v = data.volumeInfo;

        // Simulando dados ausentes com fallback
        this.book.set({
          cover: v.imageLinks?.thumbnail ?? 'https://via.placeholder.com/300x450?text=Sem+Capa',
          title: v.title ?? 'Título não encontrado',
          author: v.authors?.join(', ') ?? 'Autor desconhecido',
          publisher: v.publisher ?? 'Editora não informada',
          theme: v.categories?.[0] ?? 'Sem tema definido',
          description: v.description ?? 'Sem descrição disponível.',
          stock: Math.floor(Math.random() * 10) + 1, // mock de estoque
          rating: Math.floor(Math.random() * 5) + 1, // mock de avaliação
        });

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar livro:', err);
        this.loading.set(false);
      },
    });
  }

  // getter calculado com truncamento
  truncatedDescription = computed(() => {
    const desc = this.book().description;
    if (!desc) return '';
    return this.showFullDescription() ? desc : desc.slice(0, 450);
  });

  toggleDescription() {
    this.showFullDescription.set(!this.showFullDescription());
  }
}

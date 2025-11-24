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

  book = signal<any>({
    cover: '',
    title: '',
    author: '',
    authors: [],
    publisher: '',
    obra: '',
    themes: [],
    theme: '',
    tags: [],
    year: '',
    description: '',
    stock: 0,
    status: '',
    pdf: '',
    rating: 4
  });

  loading = signal<boolean>(true);
  showFullDescription = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadBook(id);
    });
  }

  loadBook(id: string) {
    this.loading.set(true);

    const token = sessionStorage.getItem('token');
    const url = `http://localhost:8080/livros/${id}`;
    const base = 'http://localhost:8080';

    this.http.get<any>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {

        const d = resp.data;

      this.book.set({
        cover: d.uriImgLivro ? `http://localhost:8080${d.uriImgLivro}` : 'https://via.placeholder.com/300x450?text=Sem+Capa',
        title: d.titulo,
        author: d.autor,
        autores: d.autores,
        publisher: d.editora,
        obra: d.obra,
        theme: d.tema,
        temas: d.temas,
        tags: d.tags,
        anoLancamento: d.anoLancamento,
        description: d.sinopse,
        stock: d.quantidadeDisponivel,
        status: d.status?.nome || d.status,
        urlLivro: d.urlLivro,
        rating: 4
      });


        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  truncatedDescription = computed(() => {
    const desc = this.book()?.description || '';
    return this.showFullDescription() ? desc : desc.slice(0, 450);
  });

  toggleDescription() {
    this.showFullDescription.set(!this.showFullDescription());
  }
}

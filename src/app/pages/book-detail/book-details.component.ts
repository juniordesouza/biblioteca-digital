import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: any = null; // será preenchido pelo backend
  showFullDescription = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadBook(Number(id));
  }

  loadBook(id: number) {
    const token = sessionStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:8080/livros/${id}`, { headers })
      .subscribe({
        next: (res) => {
          const data = res.data;

          /** 
           * Mapeamento do backend → frontend 
           */
          this.book = {
            title: data.titulo,
            author: data.autor,
            publisher: data.editora,
            theme: data.tema,
            cover: data.uriImgLivro || 'assets/default-cover.png',
            rating: 4, // por enquanto fictício
            description: data.sinopse,
            stock: data.quantidadeDisponivel
          };
        },
        error: (err) => {
          console.error('Erro ao carregar livro:', err);
        }
      });
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  get truncatedDescription(): string {
    if (!this.book) return '';
    const maxLength = 450;
    if (this.book.description.length <= maxLength || this.showFullDescription) {
      return this.book.description;
    }
    return this.book.description.substring(0, maxLength) + '...';
  }
}

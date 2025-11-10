import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivroService } from '../../services/livro.service'; // Importação corrigida
import { Book } from '../../book';
import { MenuComponent } from '../../components/menu/menu.component';
import { CarouselNetflixComponent } from '../../components/carousel-netflix/carousel-netflix.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MenuComponent, CarouselNetflixComponent]
})
export class CatalogoComponent {
  private livroService = inject(LivroService); // Serviço injetado

  booksByCategory = signal<Record<string, Book[]>>({});
  categories = signal<string[]>([]);

  ngOnInit() {
    this.livroService.getBooks().subscribe(allBooks => {
      const groupedBooks = allBooks.reduce((acc, book) => {
        const category = book.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(book);
        return acc;
      }, {} as Record<string, Book[]>);
      
      this.booksByCategory.set(groupedBooks);
      this.categories.set(Object.keys(groupedBooks));
    });
  }
}

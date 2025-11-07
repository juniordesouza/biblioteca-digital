import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../book.service';
import { Book } from '../../book';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-livro',
  templateUrl: './livro.component.html',
  styleUrls: ['./livro.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuComponent]
})
export class LivroComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  book = signal<Book | undefined>(undefined);
  isExpanded = signal(false);

  constructor() {
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      if (bookId) {
        this.book.set(this.bookService.getBookById(bookId));
      }
    });
  }

  getStars(rating: number): any[] {
    return Array(rating).fill(0);
  }

  toggleDescription() {
    this.isExpanded.update(value => !value);
  }
}

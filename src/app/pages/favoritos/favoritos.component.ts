import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
import { RouterModule } from '@angular/router';
import { LivroCardComponent } from '../../components/livro-card/livro-card.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LivroCardComponent]
})
export class FavoritosComponent {
  private bookService = inject(BookService);
  favoriteBooks = this.bookService.getFavoriteBooks;
}

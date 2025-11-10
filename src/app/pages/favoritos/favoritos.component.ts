import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivroService } from '../../services/livro.service';
import { RouterModule } from '@angular/router';
import { LivroCardComponent } from '../../components/livro-card/livro-card.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { Book } from '../../book';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LivroCardComponent, MenuComponent]
})
export class FavoritosComponent {
  private livroService = inject(LivroService);
  favoriteBooks = signal<Book[]>([]);

  ngOnInit() {
    // Por enquanto, vamos carregar todos os livros.
    // A lógica de favoritos pode ser implementada em uma fase futura.
    this.livroService.getBooks().subscribe(books => {
      this.favoriteBooks.set(books);
    });
  }
}

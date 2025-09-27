import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
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
  private bookService = inject(BookService);

  booksByCategory = signal<Record<string, Book[]>>({});
  categories = signal<string[]>([]);

  ngOnInit() {
    this.bookService.getBooksByCategory().subscribe(data => {
      this.booksByCategory.set(data);
      this.categories.set(Object.keys(data));
    });
  }
}

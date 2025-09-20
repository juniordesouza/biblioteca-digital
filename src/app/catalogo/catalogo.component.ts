import { ChangeDetectionStrategy, Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { Book } from '../book';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CatalogoComponent {
  private bookService = inject(BookService);
  
  @ViewChildren('carousel') carousels!: QueryList<ElementRef<HTMLDivElement>>;

  booksByCategory = signal<Record<string, Book[]>>({});
  categories = signal<string[]>([]);

  ngOnInit() {
    this.bookService.getBooksByCategory().subscribe(data => {
      this.booksByCategory.set(data);
      this.categories.set(Object.keys(data));
    });
  }

  scroll(category: string, direction: 'left' | 'right') {
    const categoryIndex = this.categories().indexOf(category);
    const carousel = this.carousels.toArray()[categoryIndex].nativeElement;
    const scrollAmount = carousel.clientWidth;

    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}

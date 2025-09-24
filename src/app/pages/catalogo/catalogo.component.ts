import { ChangeDetectionStrategy, Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
import { Book } from '../../book';
import { LivroCardComponent } from '../../components/livro-card/livro-card.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LivroCardComponent, MenuComponent]
})
export class CatalogoComponent {
  private bookService = inject(BookService);

  @ViewChildren('carousel') carousels!: QueryList<ElementRef<HTMLDivElement>>;

  booksByCategory = signal<Record<string, Book[]>>({});
  categories = signal<string[]>([]);

  isDown = false;
  startX = 0;
  scrollLeft = 0;

  ngOnInit() {
    this.bookService.getBooksByCategory().subscribe(data => {
      this.booksByCategory.set(data);
      this.categories.set(Object.keys(data));
    });
  }

  onMouseDown(e: MouseEvent, category: string) {
    const carousel = this.getCarousel(category);
    this.isDown = true;
    carousel.classList.add('active');
    this.startX = e.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
  }

  onMouseLeave(category: string) {
    const carousel = this.getCarousel(category);
    this.isDown = false;
    carousel.classList.remove('active');
  }

  onMouseUp(category: string) {
    const carousel = this.getCarousel(category);
    this.isDown = false;
    carousel.classList.remove('active');
  }

  onMouseMove(e: MouseEvent, category: string) {
    if (!this.isDown) return;
    e.preventDefault();
    const carousel = this.getCarousel(category);
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - this.startX) * 3; //scroll-fast
    carousel.scrollLeft = this.scrollLeft - walk;
  }

  private getCarousel(category: string): HTMLDivElement {
    const categoryIndex = this.categories().indexOf(category);
    return this.carousels.toArray()[categoryIndex].nativeElement;
  }

  scroll(category: string, direction: 'left' | 'right') {
    const carousel = this.getCarousel(category);
    const scrollAmount = carousel.clientWidth;

    if (direction === 'right') {
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (carousel.scrollLeft === 0) {
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }
}

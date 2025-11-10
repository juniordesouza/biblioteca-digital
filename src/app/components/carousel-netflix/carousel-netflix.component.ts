
import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../book';
import { LivroCardComponent } from '../livro-card/livro-card.component';

@Component({
  selector: 'app-carousel-netflix',
  templateUrl: './carousel-netflix.component.html',
  styleUrls: ['./carousel-netflix.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, LivroCardComponent]
})
export class CarouselNetflixComponent {
  books = input<Book[]>([]);
  title = input<string>('');
  carousel = viewChild.required<ElementRef<HTMLDivElement>>('carousel');

  scrollLeft() {
    this.carousel().nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel().nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}

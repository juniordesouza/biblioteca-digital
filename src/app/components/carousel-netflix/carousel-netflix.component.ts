import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carousel-netflix',
  templateUrl: './carousel-netflix.component.html',
  styleUrls: ['./carousel-netflix.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule]
})
export class CarouselNetflixComponent {
  books = input.required<Book[]>();
  title = input.required<string>();
  carouselContainer = viewChild.required<ElementRef<HTMLDivElement>>('carouselContainer');
  carouselItems = viewChild.required<ElementRef<HTMLDivElement>>('carouselItems');

  scrollPosition = signal(0);

  maxScrollPosition = computed(() => {
    const container = this.carouselContainer()?.nativeElement;
    const items = this.carouselItems()?.nativeElement;
    if (!container || !items) {
      return 0;
    }
    return items.scrollWidth - container.clientWidth;
  });

  scrollLeft() {
    const container = this.carouselContainer().nativeElement;
    const newScrollPosition = this.scrollPosition() - container.clientWidth * 0.8;
    this.scrollPosition.set(Math.max(0, newScrollPosition));
    container.scrollTo({ left: this.scrollPosition(), behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.carouselContainer().nativeElement;
    const newScrollPosition = this.scrollPosition() + container.clientWidth * 0.8;
    this.scrollPosition.set(Math.min(this.maxScrollPosition(), newScrollPosition));
    container.scrollTo({ left: this.scrollPosition(), behavior: 'smooth' });
  }
}

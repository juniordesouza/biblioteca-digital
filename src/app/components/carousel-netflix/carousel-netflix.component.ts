import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivroCardComponent } from '../livro-card/livro-card.component';

@Component({
  selector: 'app-carousel-netflix',
  standalone: true,
  imports: [CommonModule, LivroCardComponent],
  templateUrl: './carousel-netflix.component.html',
  styleUrls: ['./carousel-netflix.component.css'],
})
export class CarouselNetflixComponent {
  @Input() title!: string;
  @Input() books: any[] = [];
  @Output() bookSelected = new EventEmitter<string>();

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
  }

  trackByBookId(index: number, book: any) {
    return book.id;
  }
}

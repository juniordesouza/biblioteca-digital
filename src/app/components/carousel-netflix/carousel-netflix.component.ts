import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
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
  carousel = viewChild.required<ElementRef<HTMLDivElement>>('carousel');

  isDown = false;
  startX = 0;
  scrollLeft = 0;

  onMouseDown(e: MouseEvent): void {
    const carouselEl = this.carousel().nativeElement;
    this.isDown = true;
    carouselEl.classList.add('active');
    this.startX = e.pageX - carouselEl.offsetLeft;
    this.scrollLeft = carouselEl.scrollLeft;
  }

  onMouseLeave(): void {
    if (!this.isDown) return;
    const carouselEl = this.carousel().nativeElement;
    this.isDown = false;
    carouselEl.classList.remove('active');
  }

  onMouseUp(): void {
    if (!this.isDown) return;
    const carouselEl = this.carousel().nativeElement;
    this.isDown = false;
    carouselEl.classList.remove('active');
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.isDown) return;
    e.preventDefault();
    const carouselEl = this.carousel().nativeElement;
    const x = e.pageX - carouselEl.offsetLeft;
    const walk = (x - this.startX) * 2; // Multiplicador para acelerar o arraste
    carouselEl.scrollLeft = this.scrollLeft - walk;
  }

  scroll(direction: 'left' | 'right'): void {
    const carouselEl = this.carousel().nativeElement;
    const scrollAmount = carouselEl.clientWidth * 0.8; // Rola 80% da largura visível

    if (direction === 'right') {
      carouselEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      carouselEl.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }
}

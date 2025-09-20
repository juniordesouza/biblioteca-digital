import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private location = inject(Location);

  private bookId$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );

  book = toSignal(this.bookId$.pipe(
    switchMap(id => {
      if (id) {
        return this.bookService.getBook(id);
      }
      return of(undefined);
    })
  ));

  isFavorite = computed(() => {
    const book = this.book();
    if (!book) return false;
    return this.bookService.isFavorite(book)();
  });

  toggleFavorite() {
    const book = this.book();
    if (book) {
      this.bookService.toggleFavorite(book);
    }
  }

  goBack(): void {
    this.location.back();
  }
}

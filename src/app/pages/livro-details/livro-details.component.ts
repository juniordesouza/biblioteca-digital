
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService } from '../../services/livro.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livro-details',
  templateUrl: './livro-details.component.html',
  styleUrls: ['./livro-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule] // Import CommonModule for @if
})
export class LivroDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private livroService = inject(LivroService);

  public book = signal<Book | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.livroService.getBookById(+id).subscribe(book => {
        this.book.set(book);
      });
    }
  }
}

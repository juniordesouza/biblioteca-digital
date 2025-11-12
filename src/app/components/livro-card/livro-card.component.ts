import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livro-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livro-card.component.html',
  styleUrls: ['./livro-card.component.css'],
})
export class LivroCardComponent {
  @Input() book!: {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
  };
}

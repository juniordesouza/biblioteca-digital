import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-reader-page',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './book-reader-page.html',
  styleUrls: ['./book-reader-page.css']
})
export class BookReaderPage implements OnInit {
  isDarkMode = false;
  bookTitle = 'Harry Potter e a Pedra Filosofal';
  pdfUrl: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulação de autenticação
    const isAuthenticated = localStorage.getItem('authToken');

    if (!isAuthenticated) {
      //alert('Acesso negado. Faça login para continuar.');
      //this.router.navigate(['/login']);
      //return;
    }

    // URL do livro hospedado (exemplo no S3)
    this.pdfUrl = 'https://meu-bucket-s3.s3.amazonaws.com/livros/harry-potter-1.pdf';
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleSidebar() {
    alert('Menu lateral ainda será implementado.');
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private mockBooks: Book[] = [
    // Ficção Científica
    { id: 1, title: 'Duna', author: 'Frank Herbert', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=1' },
    { id: 2, title: 'Fundação', author: 'Isaac Asimov', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=2' },
    { id: 3, title: 'Neuromancer', author: 'William Gibson', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=3' },
    { id: 4, title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=4' },
    { id: 5, title: '1984', author: 'George Orwell', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=5' },
    { id: 6, title: 'Admirável Mundo Novo', author: 'Aldous Huxley', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=6' },
    { id: 7, title: 'Fahrenheit 451', author: 'Ray Bradbury', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=7' },
    { id: 8, title: 'Snow Crash', author: 'Neal Stephenson', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=8' },
    { id: 9, title: 'Ubik', author: 'Philip K. Dick', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=9' },
    { id: 10, title: 'A Mão Esquerda da Escuridão', author: 'Ursula K. Le Guin', category: 'Ficção Científica', cover: 'https://picsum.photos/200/300?random=10' },

    // Fantasia
    { id: 11, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=11' },
    { id: 12, title: 'O Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=12' },
    { id: 13, title: 'As Crônicas de Nárnia', author: 'C.S. Lewis', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=13' },
    { id: 14, title: 'A Guerra dos Tronos', author: 'George R.R. Martin', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=14' },
    { id: 15, title: 'O Nome do Vento', author: 'Patrick Rothfuss', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=15' },
    { id: 16, title: 'Mistborn: O Império Final', author: 'Brandon Sanderson', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=16' },
    { id: 17, title: 'A Roda do Tempo', author: 'Robert Jordan', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=17' },
    { id: 18, title: 'O Feiticeiro de Terramar', author: 'Ursula K. Le Guin', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=18' },
    { id: 19, title: 'American Gods', author: 'Neil Gaiman', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=19' },
    { id: 20, title: 'Jonathan Strange & Mr Norrell', author: 'Susanna Clarke', category: 'Fantasia', cover: 'https://picsum.photos/200/300?random=20' },

    // Romance
    { id: 21, title: 'Orgulho e Preconceito', author: 'Jane Austen', category: 'Romance', cover: 'https://picsum.photos/200/300?random=21' },
    { id: 22, title: 'Outlander', author: 'Diana Gabaldon', category: 'Romance', cover: 'https://picsum.photos/200/300?random=22' },
    { id: 23, title: 'Como Eu Era Antes de Você', author: 'Jojo Moyes', category: 'Romance', cover: 'https://picsum.photos/200/300?random=23' },
    { id: 24, title: 'O Morro dos Ventos Uivantes', author: 'Emily Brontë', category: 'Romance', cover: 'https://picsum.photos/200/300?random=24' },
    { id: 25, title: 'A Culpa é das Estrelas', author: 'John Green', category: 'Romance', cover: 'https://picsum.photos/200/300?random=25' },
    { id: 26, title: 'Eleanor & Park', author: 'Rainbow Rowell', category: 'Romance', cover: 'https://picsum.photos/200/300?random=26' },
    { id: 27, title: 'O Amor nos Tempos do Cólera', author: 'Gabriel García Márquez', category: 'Romance', cover: 'https://picsum.photos/200/300?random=27' },
    { id: 28, title: 'Ps: Eu te amo', author: 'Cecelia Ahern', category: 'Romance', cover: 'https://picsum.photos/200/300?random=28' },
    { id: 29, title: 'Um Dia', author: 'David Nicholls', category: 'Romance', cover: 'https://picsum.photos/200/300?random=29' },
    { id: 30, title: 'Para Todos os Garotos que Já Amei', author: 'Jenny Han', category: 'Romance', cover: 'https://picsum.photos/200/300?random=30' },
    {
      id: 31,
      title: 'Harry Potter e a Pedra Filosofal',
      author: 'J.K. Rowling',
      category: 'Fantasia',
      cover: 'https://m.media-amazon.com/images/I/81a4kCNuH+L._AC_UF1000,1000_QL80_.jpg',
      description: 'Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. Até os 10 anos, Harry foi uma espécie de gata borralheira: maltratado pelos tios, herdava roupas velhas do primo gorducho, tinha óculos remendados e era tratado como um estorvo. No dia de seu aniversário de 11 anos, entretanto, ele parece deslizar por um buraco sem fundo, como o de Alice no país das maravilhas, que o conduz a um mundo mágico. Descobre sua verdadeira história e seu destino: ser um aprendiz de feiticeiro até o dia em que terá que enfrentar a pior força do mal, o homem que assassinou seus pais.',
      publisher: 'Rocco',
      rating: 5,
      quantity: 3,
    },
  ];

  private favoriteBooksSignal = signal<Book[]>([]);

  public getFavoriteBooks = this.favoriteBooksSignal.asReadonly();

  getBooksByCategory() {
    const booksByCategory = this.mockBooks.reduce((acc, book) => {
      if (!acc[book.category]) {
        acc[book.category] = [];
      }
      acc[book.category].push(book);
      return acc;
    }, {} as Record<string, Book[]>);

    return of(booksByCategory);
  }

  getBook(id: number) {
    return of(this.mockBooks.find(book => book.id === id));
  }

  getBookById(id: string): Book | undefined {
    return this.mockBooks.find(book => book.id === parseInt(id, 10));
  }

  isFavorite(book: Book) {
    return computed(() => this.favoriteBooksSignal().some(fav => fav.id === book.id));
  }

  toggleFavorite(book: Book) {
    const isFav = this.isFavorite(book)();
    if (isFav) {
      this.favoriteBooksSignal.update(books => books.filter(fav => fav.id !== book.id));
    } else {
      this.favoriteBooksSignal.update(books => [...books, book]);
    }
  }
}

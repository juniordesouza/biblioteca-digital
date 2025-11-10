import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private books: Book[] = [
    // Ficção Científica
    { 
      id: 1, 
      title: 'Duna', 
      author: 'Frank Herbert', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/duna/200/300', 
      description: 'Uma aventura épica em um futuro distante, onde casas nobres lutam pelo controle do planeta deserto Arrakis, a única fonte da especiaria Melange.', 
      publisher: 'Editora Aleph', 
      rating: 4.8, 
      quantity: 10 
    },
    { 
      id: 2, 
      title: 'Neuromancer', 
      author: 'William Gibson', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/neuromancer/200/300', 
      description: 'O livro que definiu o gênero cyberpunk. Um hacker decadente é contratado para uma última missão que o levará ao coração do ciberespaço.', 
      publisher: 'Editora Aleph', 
      rating: 4.5, 
      quantity: 15 
    },
    { 
      id: 3, 
      title: 'O Guia do Mochileiro das Galáxias', 
      author: 'Douglas Adams', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/mochileiro/200/300',
      description: 'A jornada intergaláctica de Arthur Dent, um britânico comum, após a destruição da Terra. Uma comédia de ficção científica hilária e inteligente.',
      publisher: 'Editora Arqueiro',
      rating: 4.7,
      quantity: 20
    },

    // Fantasia
    { 
      id: 4, 
      title: 'O Senhor dos Anéis', 
      author: 'J.R.R. Tolkien', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/senhor-dos-aneis/200/300', 
      description: 'A primeira parte da épica jornada de Frodo Bolseiro para destruir o Um Anel e derrotar o Senhor do Escuro, Sauron.', 
      publisher: 'HarperCollins', 
      rating: 4.9, 
      quantity: 12 
    },
    { 
      id: 5, 
      title: 'O Nome do Vento', 
      author: 'Patrick Rothfuss', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/nome-do-vento/200/300', 
      description: 'A história de Kvothe, um jovem com um passado trágico que se torna o mago mais notório de seu tempo. Uma narrativa poética e envolvente.', 
      publisher: 'Editora Arqueiro', 
      rating: 4.8, 
      quantity: 8 
    },
    {
      id: 6,
      title: 'As Crônicas de Nárnia',
      author: 'C.S. Lewis',
      category: 'Fantasia',
      cover: 'https://picsum.photos/seed/narnia/200/300',
      description: 'Uma série de sete livros de fantasia que transporta os leitores para o mundo mágico de Nárnia, cheio de criaturas míticas e batalhas épicas entre o bem e o mal.',
      publisher: 'WMF Martins Fontes',
      rating: 4.7,
      quantity: 18
    },

    // Mistério
    { 
      id: 7, 
      title: 'Assassinato no Expresso do Oriente',
      author: 'Agatha Christie', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/expresso-oriente/200/300', 
      description: 'O famoso detetive Hercule Poirot precisa resolver um assassinato a bordo do luxuoso trem Expresso do Oriente, onde todos os passageiros são suspeitos.', 
      publisher: 'HarperCollins', 
      rating: 4.6, 
      quantity: 25 
    },
    { 
      id: 8, 
      title: 'Garota Exemplar', 
      author: 'Gillian Flynn', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/garota-exemplar/200/300', 
      description: 'No dia de seu quinto aniversário de casamento, Amy Dunne desaparece. Seu marido, Nick, se torna o principal suspeito neste thriller psicológico cheio de reviravoltas.', 
      publisher: 'Editora Intrínseca', 
      rating: 4.4, 
      quantity: 14 
    },
    {
      id: 9,
      title: 'O Código Da Vinci',
      author: 'Dan Brown',
      category: 'Mistério',
      cover: 'https://picsum.photos/seed/da-vinci/200/300',
      description: 'O simbologista Robert Langdon se envolve em uma caça ao tesouro para desvendar um segredo milenar que pode abalar os alicerces do cristianismo.',
      publisher: 'Editora Arqueiro',
      rating: 4.5,
      quantity: 30
    },

    // Clássicos
    { 
      id: 10, 
      title: '1984', 
      author: 'George Orwell', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/1984/200/300', 
      description: 'Uma distopia sombria sobre um futuro totalitário, onde o Grande Irmão está sempre vigiando e a verdade é constantemente manipulada.', 
      publisher: 'Companhia das Letras', 
      rating: 4.9, 
      quantity: 22 
    },
    { 
      id: 11, 
      title: 'O Grande Gatsby', 
      author: 'F. Scott Fitzgerald', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/gatsby/200/300', 
      description: 'Um retrato da Era do Jazz nos Estados Unidos, explorando temas de riqueza, excesso e o sonho americano através da história do misterioso milionário Jay Gatsby.', 
      publisher: 'Penguin Books', 
      rating: 4.3, 
      quantity: 17 
    },
    {
      id: 12,
      title: 'Dom Quixote de la Mancha',
      author: 'Miguel de Cervantes',
      category: 'Clássicos',
      cover: 'https://picsum.photos/seed/quixote/200/300',
      description: 'A história de um fidalgo que, após ler muitos romances de cavalaria, enlouquece e decide se tornar um cavaleiro andante, vivendo aventuras cômicas e trágicas.',
      publisher: 'Penguin Companhia',
      rating: 4.8,
      quantity: 10
    }
  ];

  getBooks() {
    return of(this.books);
  }

  getBookById(id: number) {
    const book = this.books.find(b => b.id === id);
    return of(book);
  }
}

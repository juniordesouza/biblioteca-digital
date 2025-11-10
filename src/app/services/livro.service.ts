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
    { 
      id: 13, 
      title: 'Fahrenheit 451', 
      author: 'Ray Bradbury', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/fahrenheit/200/300', 
      description: 'Em uma sociedade futura, os livros são proibidos e queimados por bombeiros. Guy Montag, um bombeiro, começa a questionar essa realidade.', 
      publisher: 'Biblioteca Azul', 
      rating: 4.6, 
      quantity: 18 
    },
    { 
      id: 14, 
      title: 'O Jogo do Exterminador', 
      author: 'Orson Scott Card', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/exterminador/200/300', 
      description: 'A Terra está em guerra com uma raça alienígena. Andrew \'Ender\' Wiggin é treinado desde criança para se tornar o futuro comandante da frota.', 
      publisher: 'Editora Aleph', 
      rating: 4.7, 
      quantity: 13 
    },
    { 
      id: 15, 
      title: 'A Máquina do Tempo', 
      author: 'H.G. Wells', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/maquinadotempo/200/300', 
      description: 'Um cientista vitoriano constrói uma máquina que o permite viajar no tempo, levando-o a um futuro distante onde a humanidade se dividiu.', 
      publisher: 'Principis', 
      rating: 4.5, 
      quantity: 20 
    },
    { 
      id: 25, 
      title: 'Snow Crash', 
      author: 'Neal Stephenson', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/snowcrash/200/300', 
      description: 'Hiro Protagonist, entregador de pizza no mundo real e príncipe guerreiro no Metaverso, investiga um novo vírus que afeta tanto computadores quanto seres humanos.', 
      publisher: 'Editora Aleph', 
      rating: 4.6, 
      quantity: 11 
    },
    { 
      id: 26, 
      title: 'Hyperion', 
      author: 'Dan Simmons', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/hyperion/200/300', 
      description: 'Sete peregrinos viajam para o planeta Hyperion para encontrar o Shrike, uma criatura enigmática que pode conceder um desejo ou trazer a morte.', 
      publisher: 'Editora Aleph', 
      rating: 4.8, 
      quantity: 9 
    },
    { 
      id: 27, 
      title: 'Um Cântico para Leibowitz', 
      author: 'Walter M. Miller Jr.', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/leibowitz/200/300', 
      description: 'Após um apocalipse nuclear, uma ordem de monges tenta preservar o conhecimento científico da humanidade, aguardando o renascimento da civilização.', 
      publisher: 'Editora Aleph', 
      rating: 4.7, 
      quantity: 7 
    },
    { 
      id: 28, 
      title: 'Eu, Robô', 
      author: 'Isaac Asimov', 
      category: 'Ficção Científica', 
      cover: 'https://picsum.photos/seed/eurobo/200/300', 
      description: 'Uma coleção de contos que explora a relação entre humanos, robôs e as Três Leis da Robótica, definindo o futuro da inteligência artificial.', 
      publisher: 'Editora Aleph', 
      rating: 4.8, 
      quantity: 21 
    },

    // Fantasia
    { 
      id: 4, 
      title: 'O Senhor dos Anéis', 
      author: 'J.R.R. Tolkien', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/senhor-dos-aneis/200/300', 
      description: 'A épica jornada de Frodo Bolseiro para destruir o Um Anel e derrotar o Senhor do Escuro, Sauron.', 
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
      description: 'A história de Kvothe, um jovem com um passado trágico que se torna o mago mais notório de seu tempo.', 
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
      description: 'Uma série de sete livros de fantasia que transporta os leitores para o mundo mágico de Nárnia.',
      publisher: 'WMF Martins Fontes',
      rating: 4.7,
      quantity: 18
    },
    { 
      id: 16, 
      title: 'Mistborn: O Império Final', 
      author: 'Brandon Sanderson', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/mistborn/200/300', 
      description: 'Em um mundo coberto por cinzas, um grupo de ladrões com poderes mágicos tenta derrubar um império opressor.', 
      publisher: 'Leya', 
      rating: 4.8, 
      quantity: 9 
    },
    { 
      id: 17, 
      title: 'A Bússola de Ouro', 
      author: 'Philip Pullman', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/bussola/200/300', 
      description: 'A jovem Lyra Belacqua embarca em uma jornada para o Norte para resgatar seu amigo sequestrado e descobre uma conspiração.', 
      publisher: 'Objetiva', 
      rating: 4.6, 
      quantity: 14 
    },
    { 
      id: 18, 
      title: 'O Hobbit', 
      author: 'J.R.R. Tolkien', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/hobbit/200/300', 
      description: 'A aventura de Bilbo Bolseiro, um hobbit pacato que é arrastado para uma jornada épica com um grupo de anões.', 
      publisher: 'HarperCollins', 
      rating: 4.8, 
      quantity: 25 
    },
    { 
      id: 29, 
      title: 'A Guerra dos Tronos', 
      author: 'George R.R. Martin', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/got/200/300', 
      description: 'Nos Sete Reinos de Westeros, famílias nobres lutam pelo controle do Trono de Ferro, enquanto uma antiga ameaça ressurge.', 
      publisher: 'Leya', 
      rating: 4.8, 
      quantity: 10 
    },
    { 
      id: 30, 
      title: 'O Olho do Mundo', 
      author: 'Robert Jordan', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/olhodomundo/200/300', 
      description: 'A Roda do Tempo gira e as Eras vêm e passam. Três jovens de uma aldeia isolada são arrastados para uma luta contra o Tenebroso.', 
      publisher: 'Intrínseca', 
      rating: 4.7, 
      quantity: 8 
    },
    { 
      id: 31, 
      title: 'Deuses Americanos', 
      author: 'Neil Gaiman', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/deusesamericanos/200/300', 
      description: 'Uma guerra se aproxima entre os deuses antigos da mitologia e os novos deuses da tecnologia moderna. Shadow Moon se encontra no meio de tudo.', 
      publisher: 'Intrínseca', 
      rating: 4.6, 
      quantity: 13 
    },
    { 
      id: 32, 
      title: 'Jonathan Strange & Mr Norrell', 
      author: 'Susanna Clarke', 
      category: 'Fantasia', 
      cover: 'https://picsum.photos/seed/strange/200/300', 
      description: 'Na Inglaterra do século XIX, a magia retorna com dois magos rivais: o recluso Mr. Norrell e o audacioso Jonathan Strange.', 
      publisher: 'Companhia das Letras', 
      rating: 4.7, 
      quantity: 6 
    },

    // Mistério
    { 
      id: 7, 
      title: 'Assassinato no Expresso do Oriente',
      author: 'Agatha Christie', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/expresso-oriente/200/300', 
      description: 'O detetive Hercule Poirot precisa resolver um assassinato a bordo do luxuoso trem Expresso do Oriente.', 
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
      description: 'No dia de seu aniversário de casamento, Amy Dunne desaparece, e seu marido, Nick, se torna o principal suspeito.', 
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
      description: 'O simbologista Robert Langdon se envolve em uma caça ao tesouro para desvendar um segredo milenar.',
      publisher: 'Editora Arqueiro',
      rating: 4.5,
      quantity: 30
    },
    { 
      id: 19, 
      title: 'E Não Sobrou Nenhum', 
      author: 'Agatha Christie', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/naosobrounenhum/200/300', 
      description: 'Dez estranhos são convidados para uma ilha isolada, onde um a um começam a ser assassinados.', 
      publisher: 'HarperCollins', 
      rating: 4.7, 
      quantity: 22 
    },
    { 
      id: 20, 
      title: 'O Silêncio dos Inocentes', 
      author: 'Thomas Harris', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/silencio/200/300', 
      description: 'A agente do FBI Clarice Starling busca a ajuda do psicopata Hannibal Lecter para capturar outro serial killer.', 
      publisher: 'Record', 
      rating: 4.8, 
      quantity: 19 
    },
    { 
      id: 21, 
      title: 'O Falcão Maltês', 
      author: 'Dashiell Hammett', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/falcao/200/300', 
      description: 'O detetive Sam Spade se envolve em uma busca perigosa por uma estatueta de falcão cravejada de joias.', 
      publisher: 'Companhia das Letras', 
      rating: 4.5, 
      quantity: 11 
    },
    { 
      id: 33, 
      title: 'O Sono Eterno', 
      author: 'Raymond Chandler', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/sonoeterno/200/300', 
      description: 'O detetive Philip Marlowe é contratado para lidar com um chantagista e se vê em uma teia de mistério e assassinato em Los Angeles.', 
      publisher: 'Companhia das Letras', 
      rating: 4.6, 
      quantity: 10 
    },
    { 
      id: 34, 
      title: 'A Garota no Trem', 
      author: 'Paula Hawkins', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/garotatrem/200/300', 
      description: 'Rachel, uma mulher alcoólatra, fantasia sobre um casal que vê da janela do trem. Um dia, ela testemunha algo chocante e se envolve na investigação.', 
      publisher: 'Record', 
      rating: 4.3, 
      quantity: 15 
    },
    { 
      id: 35, 
      title: 'A Garota com a Tatuagem de Dragão', 
      author: 'Stieg Larsson', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/dragao/200/300', 
      description: 'O jornalista Mikael Blomkvist e a hacker Lisbeth Salander investigam o desaparecimento de uma herdeira há 40 anos.', 
      publisher: 'Companhia das Letras', 
      rating: 4.7, 
      quantity: 12 
    },
    { 
      id: 36, 
      title: 'No Bosque da Memória', 
      author: 'Tana French', 
      category: 'Mistério', 
      cover: 'https://picsum.photos/seed/bosque/200/300', 
      description: 'Vinte anos após dois de seus amigos desaparecerem em um bosque, um detetive investiga o assassinato de uma menina no mesmo local.', 
      publisher: 'Rocco', 
      rating: 4.5, 
      quantity: 9 
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
      description: 'Um retrato da Era do Jazz nos Estados Unidos, explorando temas de riqueza, excesso e o sonho americano.', 
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
      description: 'A história de um fidalgo que, após ler muitos romances de cavalaria, enlouquece e decide se tornar um cavaleiro andante.',
      publisher: 'Penguin Companhia',
      rating: 4.8,
      quantity: 10
    },
    { 
      id: 22, 
      title: 'Admirável Mundo Novo', 
      author: 'Aldous Huxley', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/admiravelmundonovo/200/300', 
      description: 'Uma visão de um futuro onde a sociedade é controlada através de tecnologia reprodutiva e condicionamento psicológico.', 
      publisher: 'Biblioteca Azul', 
      rating: 4.7, 
      quantity: 16 
    },
    { 
      id: 23, 
      title: 'Cem Anos de Solidão', 
      author: 'Gabriel García Márquez', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/cem-anos/200/300', 
      description: 'A saga da família Buendía na cidade fictícia de Macondo. Uma obra-prima do realismo mágico.', 
      publisher: 'Record', 
      rating: 4.8, 
      quantity: 14 
    },
    { 
      id: 24, 
      title: 'O Morro dos Ventos Uivantes', 
      author: 'Emily Brontë', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/morrodosventosuivantes/200/300', 
      description: 'Uma história de amor e vingança que atravessa gerações na propriedade rural de Wuthering Heights.', 
      publisher: 'Principis', 
      rating: 4.6, 
      quantity: 12 
    },
    { 
      id: 37, 
      title: 'Moby Dick', 
      author: 'Herman Melville', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/mobydick/200/300', 
      description: 'A obsessiva caçada do Capitão Ahab pela grande baleia branca Moby Dick, em uma jornada épica pelos oceanos.', 
      publisher: 'Editora 34', 
      rating: 4.5, 
      quantity: 8 
    },
    { 
      id: 38, 
      title: 'Guerra e Paz', 
      author: 'Léon Tolstói', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/guerrapaz/200/300', 
      description: 'Um retrato panorâmico da sociedade russa durante a era napoleônica, entrelaçando as vidas de famílias aristocráticas com os eventos históricos.', 
      publisher: 'Companhia das Letras', 
      rating: 4.9, 
      quantity: 5 
    },
    { 
      id: 39, 
      title: 'Os Irmãos Karamázov', 
      author: 'Fiódor Dostoiévski', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/karamazov/200/300', 
      description: 'Um drama familiar que explora fé, dúvida, razão e livre-arbítrio através da história dos três irmãos Karamázov e seu pai.', 
      publisher: 'Editora 34', 
      rating: 4.8, 
      quantity: 7 
    },
    { 
      id: 40, 
      title: 'Orgulho e Preconceito', 
      author: 'Jane Austen', 
      category: 'Clássicos', 
      cover: 'https://picsum.photos/seed/orgulho/200/300', 
      description: 'A espirituosa Elizabeth Bennet e o orgulhoso Mr. Darcy superam as barreiras sociais e seus próprios preconceitos para encontrar o amor.', 
      publisher: 'Martin Claret', 
      rating: 4.7, 
      quantity: 15 
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

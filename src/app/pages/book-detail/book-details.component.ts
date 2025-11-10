import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book = {
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling (Autor)',
    publisher: 'Rocco - 19 de Agosto de 2017',
    theme: 'Fantasia',
    cover: 'assets/harry-potter-capa.jpg', // mock
    rating: 4,
    description: `Harry Potter é um garoto cujos pais, feiticeiros, foram assassinados por um poderosíssimo bruxo quando ele ainda era um bebê. 
    Ele foi levado, então, para a casa dos tios que nada tinham a ver com o sobrenatural. Pelo contrário. Até os 10 anos, 
    Harry foi uma espécie de gata borralheira: maltratado pelos tios, herdava roupas velhas do primo gorducho, tinha óculos remendados 
    e era tratado como um estorvo. No dia de seu aniversário de 11 anos, entretanto, ele parece deslizar por um buraco sem fundo, 
    como o de Alice no país das maravilhas, que o conduz a um mundo mágico. Descobre sua verdadeira história e seu destino: 
    ser um aprendiz de feiticeiro até o dia em que terá que enfrentar a pior força do mal.`,
    stock: 3
  };

  showFullDescription = false;

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  get truncatedDescription(): string {
    const maxLength = 450;
    if (this.book.description.length <= maxLength || this.showFullDescription) {
      return this.book.description;
    }
    return this.book.description.substring(0, maxLength) + '...';
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  topBooks = [
    { title: 'One Piece', image: 'assets/01.png' },
    { title: 'A Arte da Guerra', image: 'assets/02.png' },
    { title: 'Diário de um Banana', image: 'assets/03.png' },
    { title: 'It - A Coisa', image: 'assets/04.png' },
    { title: 'Duna', image: 'assets/05.png' }
  ];
}

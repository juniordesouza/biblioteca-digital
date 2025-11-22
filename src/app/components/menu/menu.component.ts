import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public isSearchVisible = signal(false);
  public username = signal<string | null>(null); // 🔥 nome para exibir

  constructor() {
    const storedUser = sessionStorage.getItem('username');
    this.username.set(storedUser); // 🔥 carrega no signal
  }

  public toggleSearch(): void {
    this.isSearchVisible.set(!this.isSearchVisible());
  }
}

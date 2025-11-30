import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public isSearchVisible = signal(false);
  public username = signal<string | null>(null);
  public isPending = signal(false);
  public isBanned = signal(false);

  constructor(private router: Router) {
    const storedUser = sessionStorage.getItem('username');
    this.username.set(storedUser);

    this.isPending.set(sessionStorage.getItem('pendingUser') !== null);
    this.isBanned.set(sessionStorage.getItem('bannedUser') !== null);
  }

  public toggleSearch(): void {
    this.isSearchVisible.set(!this.isSearchVisible());
  }

  // 🔥 REDIRECIONAR PARA CONFIGURAÇÕES / ALTERAR PERFIL
  public goToConfig(): void {
    this.router.navigate(['/atualizar-perfil']);
  }

  public logout(): void {
    sessionStorage.clear();
    location.href = '/login';
  }
}

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
    this.username.set(sessionStorage.getItem('username'));
    this.isPending.set(!!sessionStorage.getItem('pendingUser'));
    this.isBanned.set(!!sessionStorage.getItem('bannedUser'));
  }

  toggleSearch() {
    this.isSearchVisible.set(!this.isSearchVisible());
  }

  // 🔥 Emite o evento que o catálogo escuta
  search(ev: any) {
    const value = ev.target.value;
    window.dispatchEvent(new CustomEvent('catalog-search', { detail: value }));
  }

  goToConfig() {
    this.router.navigate(['/atualizar-perfil']);
  }

  logout() {
    sessionStorage.clear();
    location.href = '/login';
  }
}

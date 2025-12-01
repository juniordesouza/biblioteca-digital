import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CarouselNetflixComponent } from '../../components/carousel-netflix/carousel-netflix.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-historico-emprestimos',
  standalone: true,
  imports: [CommonModule, CarouselNetflixComponent, MenuComponent],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil {
  private router = inject(Router);
  private http = inject(HttpClient);

  historicoFormatado = signal<any[]>([]);
  reservasMock = signal<any[]>([]);
  seusLivrosMock = signal<any[]>([]);
  slotsLivres = 0;

  // buffers seguros que NÃO se sobrescrevem
  private emprestimosAtivos: any[] = [];
  private reservasAtivas: any[] = [];

  ngOnInit() {
    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("Usuário não encontrado na sessão.");
      return;
    }

    this.loadPerfil(username);
    this.loadEmprestimos(username);
    this.loadReservas(username);
  }

  // ============================================================
  // PERFIL
  // ============================================================
  loadPerfil(username: string) {
    const perfilRaw = sessionStorage.getItem("perfilData");
    let perfilData: any = null;

    try { perfilData = perfilRaw ? JSON.parse(perfilRaw) : null; }
    catch { perfilData = null; }

    const limiteSlots = perfilData?.limiteSlots ?? 3;
    this.slotsLivres = limiteSlots;
  }

// ============================================================
// EMPRESTIMOS
// ============================================================
loadEmprestimos(username: string) {
  const token = sessionStorage.getItem("token");

  this.http.get<any>(`http://localhost:8080/emprestimos/historico/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .subscribe({
    next: resp => {

      // aceita array puro OU objeto data:
      const historico = Array.isArray(resp) ? resp : (resp.data ?? []);

      const convertidos = historico.map((item: any) => ({
        id: item.livroId,
        title: item.tituloLivro,
        author: item.usuarioId,
        thumbnail: this.normalizeThumb(item.uriImgLivro),
        status: item.status
      }));

      this.historicoFormatado.set(convertidos);

      this.emprestimosAtivos = convertidos.filter((c: any) => c.status === "ATIVO");

      this.rebuildSeusLivros();
    },
    error: err => {
      console.error("Erro ao carregar histórico de empréstimos", err);
    }
  });
}

// ============================================================
// RESERVAS
// ============================================================
loadReservas(username: string) {
  const token = sessionStorage.getItem("token");

  this.http.get<any>(`http://localhost:8080/reservas/historico/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .subscribe({
    next: resp => {

      // aceita array OU objeto com data
      const reservas = Array.isArray(resp) ? resp : (resp.data ?? []);

      const reservasConvertidas = reservas
        .filter((r: any) => r.status === 'ATIVA')
        .map((item: any) => ({
          id: item.livroId,
          title: item.tituloLivro ?? `Livro ${item.livroId}`,
          thumbnail: this.normalizeThumb(item.uriImgLivro),
          status: 'RESERVADO',
          posicaoFila: item.posicaoFila ?? 0
        }));

      this.reservasMock.set(reservasConvertidas);

      this.reservasAtivas = reservasConvertidas;

      this.rebuildSeusLivros();
    },
    error: err => {
      console.error("Erro ao carregar reservas", err);
    }
  });
}

  // ============================================================
  // 🔥 RECONSTRÓI LISTA SEM RACE CONDITION
  // ============================================================
  rebuildSeusLivros() {
    const seusLivros = [
      ...this.emprestimosAtivos,
      ...this.reservasAtivas
    ];

    this.seusLivrosMock.set(seusLivros);

    // recalcula slots
    const perfilRaw = sessionStorage.getItem("perfilData");
    let perfilData: any = null;
    try { perfilData = perfilRaw ? JSON.parse(perfilRaw) : null; } catch {}

    const limiteSlots = perfilData?.limiteSlots ?? 3;
    this.slotsLivres = Math.max(limiteSlots - seusLivros.length, 0);
  }

  // ============================================================
  // UTIL
  // ============================================================
  normalizeThumb(uri: string): string {
    if (!uri) return 'https://via.placeholder.com/150x220?text=Sem+Capa';

    const cleaned = uri.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    if (cleaned.startsWith('/uploads')) return `http://localhost:8080${cleaned}`;

    return 'https://via.placeholder.com/150x220?text=Sem+Capa';
  }

  openBookDetails(id: number | string) {
    if (id) this.router.navigate(['/livros', id]);
  }

  goToCatalog() {
    this.router.navigate(['/catalogo']);
  }
}

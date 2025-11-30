import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  historicoFormatado = signal<any[]>([]);
  reservasMock = signal<any[]>([]);
  seusLivrosMock = signal<any[]>([]);
  slotsLivres = 0;

  ngOnInit() {

    // ========= PERFIL PARA PEGAR limiteSlots
    const perfilRaw = sessionStorage.getItem("perfilData");
    let perfilData: any = null;

    try { perfilData = perfilRaw ? JSON.parse(perfilRaw) : null; }
    catch { perfilData = null; }

    const limiteSlots = perfilData?.limiteSlots ?? 3;


    // ========= HISTÓRICO DE EMPRÉSTIMOS
    const raw = sessionStorage.getItem('historicoEmprestimos');
    let historico = [];

    try { historico = raw ? JSON.parse(raw) : []; }
    catch { historico = []; }

    const convertidos = historico.map((item: any) => ({
      id: item.livroId,
      title: item.tituloLivro,
      author: item.usuarioId,
      thumbnail: this.normalizeThumb(item.uriImgLivro),
    }));

    this.historicoFormatado.set(convertidos);


    // ========= RESERVAS DA SESSION
    const reservasRaw = sessionStorage.getItem('historicoReservas');
    let reservas = [];

    try { reservas = reservasRaw ? JSON.parse(reservasRaw) : []; }
    catch { reservas = []; }

    const reservasConvertidas = reservas
    .filter((r: any) => r.status === 'ATIVA')   // 👈 só reservas ativas!
    .map((item: any) => ({
      id: item.livroId,
      title: `Livro ${item.livroId}`,
      thumbnail: this.normalizeThumb(item.uriImgLivro),
      status: 'RESERVADO',
      posicaoFila: 0
    }));


    this.reservasMock.set(reservasConvertidas);


    // ========= LIVROS ATIVOS (empréstimos)
    const ativosConvertidos = historico
      .filter((item: any) => item.status === 'ATIVO')
      .map((item: any) => ({
        id: item.livroId,
        title: item.tituloLivro,
        thumbnail: this.normalizeThumb(item.uriImgLivro),
        status: 'EM_ABERTO'
      }));


    // ========= SEUS LIVROS = ativos + reservas
    const seusLivros = [
      ...ativosConvertidos,
      ...this.reservasMock()
    ];

    this.seusLivrosMock.set(seusLivros);

    // ========= CALCULA SLOTS
    const usados = seusLivros.length;
    this.slotsLivres = Math.max(limiteSlots - usados, 0);
  }


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

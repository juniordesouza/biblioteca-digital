import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-livro-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, ToastComponent],
  templateUrl: './livro-details.component.html',
  styleUrls: ['./livro-details.component.css'],
})
export class LivroDetailsComponent {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  book = signal<any>({
    id: null,
    cover: '',
    title: '',
    author: '',
    autores: [],
    publisher: '',
    obra: '',
    temas: [],
    theme: '',
    tags: [],
    anoLancamento: '',
    description: '',
    stock: 0,
    status: '',
    urlLivro: '',
    rating: 4
  });

  loading = signal<boolean>(true);
  showFullDescription = signal<boolean>(false);
  livroObtido = signal<boolean>(false);

  toastMessage = '';
  toastShow = false;

  emprestimosUser: any[] = [];
  reservasUser: any[] = [];

  livroReservado = signal<boolean>(false);
  idReservaAtiva = signal<number | null>(null);

  // ======================================================
  // 🔥 NOVO: Status final exibido (Emprestado se stock = 0)
  // ======================================================
  statusFinal = computed(() => {
    const b = this.book();
    if (b.stock === 0) return "EMPRESTADO";
    return b.status || "DESCONHECIDO";
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadPage(id);
      else this.loading.set(false);
    });
  }

  loadPage(id: string) {
    this.loading.set(true);
    this.loadBook(id);

    const username = sessionStorage.getItem("username");
    if (!username) return;

    this.loadEmprestimos(username, Number(id));
    this.loadReservas(username);
  }

  private normalizeThumbnail(uri?: string): string {
    if (!uri) {
      return 'https://via.placeholder.com/300x450?text=Sem+Capa';
    }

    const cleaned = uri.replace(/\\/g, '/').trim();

    if (/^https?:\/\//i.test(cleaned)) {
      return cleaned;
    }

    if (cleaned.startsWith('/uploads') || cleaned.startsWith('uploads')) {
      return `http://localhost:8080${cleaned.startsWith('/') ? cleaned : '/' + cleaned}`;
    }

    if (/^[a-zA-Z]:\//.test(cleaned)) {
      return cleaned;
    }

    return 'https://via.placeholder.com/300x450?text=Sem+Capa';
  }

  loadEmprestimos(username: string, livroId: number) {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(`http://localhost:8080/emprestimos/historico/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {
        const lista = Array.isArray(resp) ? resp : (resp.data ?? []);
        this.emprestimosUser = lista;

        const temAtivo = lista.some(
          (e: any) => e.livroId === livroId && e.status === "ATIVO"
        );

        this.livroObtido.set(temAtivo);
      }
    });
  }

  loadReservas(username: string) {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(`http://localhost:8080/reservas/historico/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {
        const lista = Array.isArray(resp) ? resp : (resp.data ?? []);
        this.reservasUser = lista;

        const livroId = Number(this.book().id);

        const reserva = lista.find(
          (r: any) => r.livroId === livroId && r.status === "ATIVA"
        );

        if (reserva) {
          this.livroReservado.set(true);
          this.idReservaAtiva.set(reserva.id);
        } else {
          this.livroReservado.set(false);
          this.idReservaAtiva.set(null);
        }
      }
    });
  }

  loadBook(id: string) {
    const token = sessionStorage.getItem('token');

    this.http.get<any>(`http://localhost:8080/livros/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {
        const d = Array.isArray(resp) ? resp[0] : resp.data;

        this.book.set({
          id: d.id ?? id,
          cover: this.normalizeThumbnail(d.uriImgLivro),
          title: d.titulo,
          author: d.autor,
          autores: d.autores ?? [],
          publisher: d.editora,
          obra: d.obra,
          theme: d.tema,
          temas: d.temas ?? [],
          tags: d.tags ?? [],
          anoLancamento: d.anoLancamento,
          description: d.sinopse,
          stock: d.quantidadeDisponivelEmprestar ?? 0,
          status: d.status?.nome || d.status,
          urlLivro: d.urlLivro,
          rating: 4
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showToast("Erro ao carregar os detalhes do livro.");
      }
    });
  }

  obterLivro() {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');
    const livroId = Number(this.book().id);

    this.http.post(`http://localhost:8080/emprestimos`, { username, livroId }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.showToast("Livro obtido com sucesso!");
        this.livroObtido.set(true);
        this.loadEmprestimos(username!, livroId);
      },
      error: err => {
        const msg = err?.error?.mensagem || "Erro ao processar.";
        this.showToast(msg);
      }
    });
  }

  devolverLivro() {
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');
    const livroId = Number(this.book().id);

    const emprestimo = this.emprestimosUser.find(
      e => e.livroId === livroId && e.status === "ATIVO"
    );

    if (!emprestimo) {
      this.showToast("Nenhum empréstimo ativo encontrado.");
      return;
    }

    this.http.put(
      `http://localhost:8080/emprestimos/${emprestimo.id}/devolver`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.showToast("Livro devolvido com sucesso!");
        this.livroObtido.set(false);
        this.loadEmprestimos(username!, livroId);
      }
    });
  }

  reservarLivro() {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    this.http.post(
      `http://localhost:8080/reservas`,
      { username, livroId: this.book().id },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.showToast("Reserva realizada com sucesso!");
        this.loadReservas(username!);
      },
      error: err => {
        const msg = err?.error?.mensagem || "Erro ao realizar reserva.";
        this.showToast(msg);
      }
    });
  }

  cancelarReserva() {
    const token = sessionStorage.getItem("token");
    const id = this.idReservaAtiva();

    if (!id) {
      this.showToast("Nenhuma reserva ativa encontrada.");
      return;
    }

    this.http.put(
      `http://localhost:8080/reservas/${id}/cancelar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.showToast("Reserva cancelada com sucesso!");
        this.livroReservado.set(false);

        const username = sessionStorage.getItem("username")!;
        this.loadReservas(username);
      },
      error: err => {
        const msg = err?.error?.mensagem || "Erro ao cancelar reserva.";
        this.showToast(msg);
      }
    });
  }

  truncatedDescription = computed(() => {
    const d = this.book()?.description || '';
    return this.showFullDescription() ? d : d.slice(0, 450);
  });

  toggleDescription() {
    this.showFullDescription.set(!this.showFullDescription());
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    this.toastShow = true;
    setTimeout(() => this.toastShow = false, 3000);
  }
}

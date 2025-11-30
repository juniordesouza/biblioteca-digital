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

  toastMessage = '';
  toastShow = false;

  livroObtido = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBook(id);
        this.verificarEmprestimoAtivo(Number(id));
      } else {
        this.loading.set(false);
      }
    });
  }

  verificarEmprestimoAtivo(livroId: number) {
    const cache = sessionStorage.getItem('historicoEmprestimos');
    if (!cache) return;

    let historico = [];
    try { historico = JSON.parse(cache); } catch { historico = []; }

    const ativo = historico.some(
      (item: any) => item.livroId === livroId && item.status === 'ATIVO'
    );

    this.livroObtido.set(ativo);
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    this.toastShow = true;
    setTimeout(() => this.toastShow = false, 3000);
  }

  loadBook(id: string) {
    this.loading.set(true);

    const token = sessionStorage.getItem('token');
    const url = `http://localhost:8080/livros/${id}`;

    this.http.get<any>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {
        const d = resp.data;

        this.book.set({
          id: d.id ?? id,
          cover: d.uriImgLivro ? `http://localhost:8080${d.uriImgLivro}` : 'https://via.placeholder.com/300x450?text=Sem+Capa',
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
          stock: d.quantidadeDisponivel ?? 0,
          status: d.status?.nome || d.status,
          urlLivro: d.urlLivro,
          rating: 4
        });

        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
        this.showToast('Erro ao carregar os detalhes do livro.');
      }
    });
  }

  obterLivro() {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    if (!username) {
      this.showToast("Erro: usuário não encontrado na sessão.");
      return;
    }

    const payload = {
      username: username,
      livroId: Number(this.route.snapshot.paramMap.get('id'))
    };

    this.http.post(`http://localhost:8080/emprestimos`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: resp => {
        this.showToast("Livro obtido com sucesso!");
        this.livroObtido.set(true);
      },

      error: (err) => {
        const mensagemBackend =
          err?.error?.mensagem ||
          err?.error?.detalhes ||
          'Erro ao processar a requisição.';

        this.showToast(mensagemBackend);
      }

    });
  }

  devolverLivro() {
    const token = sessionStorage.getItem('token');
    const livroId = Number(this.book().id);

    const cache = sessionStorage.getItem('historicoEmprestimos');
    if (!cache) {
      this.showToast("Erro: histórico não encontrado.");
      return;
    }

    let historico = [];
    try { historico = JSON.parse(cache); } catch { historico = []; }

    const emprestimo = historico.find(
      (e: any) => e.livroId === livroId && e.status === 'ATIVO'
    );

    if (!emprestimo) {
      this.showToast("Nenhum empréstimo ativo encontrado.");
      return;
    }

    const url = `http://localhost:8080/emprestimos/${emprestimo.id}/devolver`;

    this.http.put(url, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.showToast("Livro devolvido com sucesso!");
        this.livroObtido.set(false);

        emprestimo.status = "FINALIZADO";
        sessionStorage.setItem('historicoEmprestimos', JSON.stringify(historico));
      },
      error: () => {
        this.showToast("Erro ao devolver livro.");
      }
    });
  }

  truncatedDescription = computed(() => {
    const desc = this.book()?.description || '';
    return this.showFullDescription() ? desc : desc.slice(0, 450);
  });

  toggleDescription() {
    this.showFullDescription.set(!this.showFullDescription());
  }

  reservarLivro() {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    const payload = {
      username: username,
      livroId: this.book().id
    };

    this.http.post(`http://localhost:8080/reservas`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: resp => {
        this.showToast("Reserva realizada com sucesso!");
      },
      error: err => {
        const mensagem =
          err?.error?.mensagem || 'Erro ao realizar reserva.';
        this.showToast(mensagem);
      }
    });
  }

}

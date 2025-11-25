import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-livro-details',
  standalone: true,
  imports: [CommonModule, MenuComponent, ToastComponent],
  templateUrl: './livro-details.component.html',
  styleUrls: ['./livro-details.component.css'],
})
export class LivroDetailsComponent {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  book = signal<any>({
    cover: '',
    title: '',
    author: '',
    authors: [],
    publisher: '',
    obra: '',
    themes: [],
    theme: '',
    tags: [],
    year: '',
    description: '',
    stock: 0,
    status: '',
    pdf: '',
    rating: 4
  });

  loading = signal<boolean>(true);
  showFullDescription = signal<boolean>(false);

  // 🔥 Toast padrão do sistema
  toastMessage = '';
  toastShow = false;

  // 🔥 Controla troca do botão
  livroObtido = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadBook(id);
      this.verificarEmprestimoAtivo(Number(id));
    });
  }

  verificarEmprestimoAtivo(livroId: number) {
    const cache = sessionStorage.getItem('historicoEmprestimos');
    if (!cache) return;

    const historico = JSON.parse(cache);

    const ativo = historico.some(
      (item: any) => item.livroId === livroId && item.status === 'ATIVO'
    );

    if (ativo) {
      this.livroObtido.set(true);
    }
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
          cover: d.uriImgLivro ? `http://localhost:8080${d.uriImgLivro}` : 'https://via.placeholder.com/300x450?text=Sem+Capa',
          title: d.titulo,
          author: d.autor,
          autores: d.autores,
          publisher: d.editora,
          obra: d.obra,
          theme: d.tema,
          temas: d.temas,
          tags: d.tags,
          anoLancamento: d.anoLancamento,
          description: d.sinopse,
          stock: d.quantidadeDisponivel,
          status: d.status?.nome || d.status,
          urlLivro: d.urlLivro,
          rating: 4
        });

        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
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
        this.livroObtido.set(true);  // troca o botão
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

  truncatedDescription = computed(() => {
    const desc = this.book()?.description || '';
    return this.showFullDescription() ? desc : desc.slice(0, 450);
  });

  toggleDescription() {
    this.showFullDescription.set(!this.showFullDescription());
  }
}

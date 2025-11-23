import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-admin-register-book',
  standalone: true,
  templateUrl: './admin-register-book.html',
  styleUrls: ['./admin-register-book.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SidebarComponent,
    AdminHeaderComponent,
    ToastComponent
  ]
})
export class AdminRegisterBook implements OnInit {

  sidebarOpen = true;

  // =====================
  // SUGESTÕES DO BACKEND
  // =====================
  suggestions = {
    editoras: [] as string[],
    autores: [] as string[],
    temas: [] as string[],
    obras: [] as string[],
    tags: [] as string[],
  };

  dropdownVisible: any = {
    editoras: false,
    autores: false,
    temas: false,
    obras: false,
    tags: false
  };

  // =====================
  // FORM DATA
  // =====================
  livro: any = {
    txt_titulo: '',
    autor: '',
    editora: '',
    tema: '',
    obra: '',
    ano_lancamento: '',
    dt_validade: '',
    num_total_licencas: 1,
    url_livro: '',
    txt_sinopse: '',
    tags: [] as string[]
  };

  // arquivos
  capaFile: File | null = null;
  pdfFile: File | null = null;
  previewCapa: string | null = null;

  // tags
  tagBuffer = '';

  // toast
  showAlert = false;
  alertMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadAllSuggestions();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ==========================================
  // LOAD METADADOS (backend → /metadados)
  // ==========================================
  loadAllSuggestions() {
    const token = sessionStorage.getItem("token");

    this.http.get<any>('http://localhost:8080/metadados', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe(resp => {
      const data = resp.data;

      this.suggestions = {
        editoras: data.editoras.map((e: any) => e.nome),
        autores: data.autores.map((a: any) => a.nome),
        temas: data.temas.map((t: any) => t.nome),
        obras: data.obras.map((o: any) => o.nome),
        tags: data.tags.map((tg: any) => tg.nome)
      };

      this.cdr.markForCheck();
    });
  }

  // ==========================================
  // AUTOCOMPLETE
  // ==========================================
  filterSuggestions(kind: keyof typeof this.suggestions, value: string) {
    if (!value.trim()) {
      this.dropdownVisible[kind] = true;
      this.cdr.markForCheck();
      return;
    }

    const q = value.toLowerCase();
    const fullList = this.suggestions[kind];
    const filtered = fullList.filter(s => s.toLowerCase().includes(q));

    this.suggestions[kind] = filtered.length ? filtered : fullList;
    this.dropdownVisible[kind] = true;
    this.cdr.markForCheck();
  }

  selectSuggestion(field: string, value: string) {
    (this.livro as any)[field] = value;
    this.dropdownVisible[field + "s"] = false;
    this.cdr.markForCheck();
  }

  hideDropdownDelayed(kind: string) {
    setTimeout(() => {
      this.dropdownVisible[kind] = false;
      this.cdr.markForCheck();
    }, 150);
  }

  // ==========================================
  // TAGS
  // ==========================================
  onTagKeydown(ev: KeyboardEvent) {
    if (ev.key === ',' || ev.key === 'Enter') {
      ev.preventDefault();
      this.addTagFromBuffer();
    }
  }

  addTagFromBuffer(event?: Event) {
    const raw = this.tagBuffer.trim();
    if (!raw) return;

    const tags = raw.split(',').map(t => t.trim()).filter(t => t);
    tags.forEach(t => this.addTag(t));

    this.tagBuffer = '';
    this.cdr.markForCheck();
  }

  addTag(tag: string) {
    if (!this.livro.tags.includes(tag)) {
      this.livro.tags.push(tag);
    }
  }

  removeTag(i: number) {
    this.livro.tags.splice(i, 1);
  }

  addTagSuggestion(tag: string) {
    this.addTag(tag);
    this.dropdownVisible.tags = false;
    this.cdr.markForCheck();
  }

  showDropdown(kind: string) {
    this.dropdownVisible[kind] = true;
    this.cdr.markForCheck();
  }

  // ==========================================
  // FILES
  // ==========================================
  onCapaSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.capaFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewCapa = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  onPdfSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.pdfFile = file;
  }

  // ==========================================
  // TOAST
  // ==========================================
  showToast(msg: string) {
    this.zone.run(() => {
      this.alertMessage = msg;
      this.showAlert = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.showAlert = false;
        this.cdr.markForCheck();
      }, 3500);
    });
  }

  // ==========================================
  // SUBMIT
  // ==========================================
  salvarLivro() {
    if (!this.livro.txt_titulo.trim()) {
      this.showToast("❌ O título é obrigatório");
      return;
    }

    const token = sessionStorage.getItem('token');

    const dto = {
      titulo: this.livro.txt_titulo,
      autor: this.livro.autor,
      editora: this.livro.editora,
      tema: this.livro.tema,
      obra: this.livro.obra,
      tags: this.livro.tags,
      anoLancamento: this.livro.ano_lancamento,
      dtValidade: this.livro.dt_validade || "20401230",
      quantidadeDisponivel: this.livro.num_total_licencas,
      sinopse: this.livro.txt_sinopse,
      urlLivro: this.livro.url_livro || null
    };

    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.capaFile) formData.append('capa', this.capaFile);
    if (this.pdfFile) formData.append('pdf', this.pdfFile);

    this.http.post('http://localhost:8080/livros/upload', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: () => {
        this.showToast("📚 Livro cadastrado com sucesso!");
        this.resetForm();
      },
      error: err => {
        const msg = err?.error?.mensagem || "Erro ao salvar o livro";
        this.showToast(`❌ ${msg}`);
      }
    });
  }

  resetForm() {
    this.livro = {
      txt_titulo: '',
      autor: '',
      editora: '',
      tema: '',
      obra: '',
      ano_lancamento: '',
      dt_validade: '',
      num_total_licencas: 1,
      url_livro: '',
      txt_sinopse: '',
      tags: []
    };

    this.capaFile = null;
    this.pdfFile = null;
    this.previewCapa = null;
    this.tagBuffer = '';

    this.cdr.markForCheck();
  }
}

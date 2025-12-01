import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ToastComponent } from '../../components/toast.component/toast.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-history',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SidebarComponent,
    AdminHeaderComponent,
    ToastComponent
  ],
  templateUrl: './admin-user-history.html',
  styleUrl: './admin-user-history.css'
})
export class AdminUserHistory implements OnInit {

  sidebarOpen = true;

  historico: any[] = [];
  historicoFiltrado: any[] = [];

  usernameFromUrl = "";
  usernameSearch = "";

  showAlert = false;
  alertMessage = "";

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const username = params.get("id") ?? "";

      if (!username) {
        this.showToast("⚠️ Nenhum usuário informado.");
        return;
      }

      this.usernameFromUrl = username;
      this.usernameSearch = username;

      this.buscarHistorico();
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  showToast(msg: string) {
    this.alertMessage = msg;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3500);
  }

  /** ===============================
   *  🔥 Buscar Histórico Real
   *  =============================== */
  buscarHistorico() {

    const username = this.usernameFromUrl.trim();
    const token = sessionStorage.getItem("token");

    this.http.get<any[]>(
      `http://localhost:8080/emprestimos/usuario/${username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (data) => {
        this.historico = (data || []).map(item => ({
          ...item,
          uriImgLivro: this.normalizeThumb(item.uriImgLivro)
        }));

        this.filtrarLocal();
      },
      error: (err) => {
        console.error(err);
        this.showToast("❌ Erro ao carregar histórico.");
      }
    });
  }

  /** ============================================
   *  🔥 Filtro LOCAL — pesquisa em todos atributos
   *  ============================================ */
  filtrarLocal() {
    const termo = this.usernameSearch.toLowerCase().trim();

    if (!termo) {
      this.historicoFiltrado = [...this.historico];
      return;
    }

    this.historicoFiltrado = this.historico.filter(h => {

      const campos = [
        h.id,
        h.usuarioId,
        h.livroId,
        h.tituloLivro,
        h.dtInicio,
        h.dtPrevistaDevolucao,
        h.status
      ];

      return campos.some(c =>
        c !== null &&
        c !== undefined &&
        c.toString().toLowerCase().includes(termo)
      );
    });
  }

  /** 🔥 Normaliza caminhos de capa */
  normalizeThumb(uri: string) {
    if (!uri) return null;

    const cleaned = uri.replace(/\\/g, "/");

    if (cleaned.startsWith("/uploads"))
      return `http://localhost:8080${cleaned}`;

    if (/^https?:\/\//i.test(cleaned))
      return cleaned;

    return null;
  }
}

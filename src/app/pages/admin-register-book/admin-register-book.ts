import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-register-book',
  standalone: true,
  templateUrl: './admin-register-book.html',
  styleUrls: ['./admin-register-book.css'],
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, AdminHeaderComponent]
})
export class AdminRegisterBook implements OnInit {

  sidebarOpen = true;

  editoras: any[] = [];
  obras: any[] = [];
  statusList: any[] = [];

  livro: any = {
    txt_titulo: '',
    ano_lancamento: '',
    num_total_licencas: 0,
    dt_validade: '',
    url_livro: '',
    uri_img_livro: '',
    txt_sinopse: '',
    cod_editora: null,
    cod_obra: null,
    cod_status: 1
  };

  constructor(private http: HttpClient) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    this.loadEditoras();
    this.loadObras();
    this.loadStatus();
  }

  loadEditoras() {
    this.http.get<any[]>('http://localhost:8080/editoras')
      .subscribe(resp => this.editoras = resp);
  }

  loadObras() {
    this.http.get<any[]>('http://localhost:8080/obras')
      .subscribe(resp => this.obras = resp);
  }

  loadStatus() {
    this.http.get<any[]>('http://localhost:8080/status-livro')
      .subscribe(resp => this.statusList = resp);
  }

  salvarLivro() {
    const token = sessionStorage.getItem('token');

    this.http.post(
      'http://localhost:8080/livros',
      this.livro,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    .subscribe({
      next: () => {
        alert('Livro cadastrado com sucesso!');
        this.resetForm();
      },
      error: err => {
        console.error(err);
        alert('Erro ao salvar.');
      }
    });
  }

  resetForm() {
    this.livro = {
      txt_titulo: '',
      ano_lancamento: '',
      num_total_licencas: 0,
      dt_validade: '',
      url_livro: '',
      uri_img_livro: '',
      txt_sinopse: '',
      cod_editora: null,
      cod_obra: null,
      cod_status: 1
    };
  }
}

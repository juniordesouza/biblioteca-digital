import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username: string;
  nomeCompleto: string;
  email: string;
  dtNasc: string;
  cpf: string;
  cep: string;
  numero: string;
  telefone: string;
  imagemUrl?: string; // <- se vier a imagem
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.seuservidor.com/usuarios'; // URL da sua API

  constructor(private http: HttpClient) {}

  getUsuarios(page: number = 1): Observable<{ data: User[]; totalPages: number }> {
    return this.http.get<{ data: User[]; totalPages: number }>(`${this.apiUrl}?page=${page}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetaDadosService {

  private cache$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  carregarMetadados() {
    if (!this.cache$) {
      const token = sessionStorage.getItem("token");

      this.cache$ = this.http.get("http://localhost:8080/metadados", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(shareReplay(1)); // CACHE: guarda a resposta
    }

    return this.cache$;
  }
}

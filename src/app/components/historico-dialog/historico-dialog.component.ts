import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-dialog.component.html',
  styleUrls: ['./historico-dialog.component.css']
})
export class HistoricoDialogComponent {

  @Output() close = new EventEmitter<void>();

  username = '';
  loading = false;

  constructor(private router: Router) {}

  buscar() {
    if (!this.username.trim()) return;

    this.loading = true;

    // 🔥 ROTA CORRETA
    this.router.navigate([`/admin/historico/${this.username}`])
      .then(() => {
        this.loading = false;
        this.close.emit();
      });
  }
}

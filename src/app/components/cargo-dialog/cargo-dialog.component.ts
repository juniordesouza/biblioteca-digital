import { Component, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-cargo-dialog',
  standalone: true,
  templateUrl: './cargo-dialog.component.html',
  styleUrls: ['./cargo-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ToastComponent
  ]
})
export class CargoDialogComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  username = "";
  cpf = "";
  role = "";
  loading = false;

  success = false;
  responseData: any = null;

  showAlert = false;
  alertMessage = "";

  invalid = {
    username: false,
    cpf: false,
    role: false
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

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

  validateFields(): boolean {
    this.invalid.username = !this.username.trim();
    this.invalid.cpf = !this.cpf.trim();
    this.invalid.role = !this.role.trim();

    const hasErrors = this.invalid.username || this.invalid.cpf || this.invalid.role;

    if (hasErrors) {
      this.showToast("⚠️ Preencha todos os campos obrigatórios");
      this.cdr.markForCheck();
    }

    return !hasErrors;
  }

  submit() {
    if (!this.validateFields()) return;

    this.loading = true;

    const token = sessionStorage.getItem("token");

    const payload = {
      username: this.username,
      cpf: this.cpf,
      novoRole: this.role
    };

    this.http.put<any>(
      'http://localhost:8080/admin/trocar-cargo',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loading = false;
          this.responseData = res;
          this.success = true;

          this.submitted.emit(res?.mensagem || "Cargo atualizado com sucesso.");

          this.cdr.markForCheck();

          // FECHA SOMENTE AQUI — AdminHeader não fecha mais
          setTimeout(() => {
            this.close.emit();
          }, 2500);
        });
      },

      error: (err) => {
        this.zone.run(() => {
          this.loading = false;
          const msg = err?.error?.mensagem || "Erro ao atualizar cargo";
          this.showToast("❌ " + msg);
          this.cdr.markForCheck();
        });
      }
    });
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { ToastComponent } from '../../components/toast.component/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HomeHeaderComponent,
    ToastComponent
  ]
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  showAlert = false;
  alertMessage = '';

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    senha: ['', Validators.required]
  });

  ngOnInit(): void {

    // Usuário aprovado já logado
    if (this.authService.isLogged()) {

      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));

          if (payload.role === "ADMIN" || payload.role === "FUNCIONARIO") {
            this.router.navigate(['/admin/aprovacoes']);
            return;
          }

        } catch {}
      }

      this.router.navigate(['/catalogo']);
      return;
    }

    // Usuário pendente
    if (sessionStorage.getItem('pendingUser')) {
      this.router.navigate(['/sala-de-espera']);
      return;
    }
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    const credentials = {
      username: this.loginForm.value.username,
      senha: this.loginForm.value.senha
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {

        // ============================
        // Trata usuário pendente
        // ============================
        if (response?.aguardandoAprovacao === true) {
          this.authService.setPendingUser(credentials.username);
          this.router.navigate(['/sala-de-espera']);
          return;
        }

        // ============================
        // Trata token
        // ============================
        const token = response.token?.replace("Bearer ", "");
        if (!token) {
          this.showToast("Token inválido.");
          return;
        }

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const role = payload.role;

          // ============================
          // REDIRECIONAMENTO POR CARGO
          // ============================

          if (role === "ADMIN") {
            this.router.navigate(['/admin/dashboard']);
            return;
          }

          if (role === "FUNCIONARIO") {
            this.router.navigate(['/admin/aprovacoes']);
            return;
          }

          // Usuário normal
          this.router.navigate(['/catalogo']);
          return;

        } catch (err) {
          console.error("Erro ao decodificar token:", err);
          this.showToast("Erro ao processar autenticação.");
        }
      },

      error: (err) => {

        if (err.status === 403 && err.error?.aguardandoAprovacao === true) {
          this.authService.setPendingUser(credentials.username);
          this.router.navigate(['/sala-de-espera']);
          return;
        }

        this.showToast("Usuário ou senha inválidos.");
      }
    });
  }

  showToast(message: string) {
    this.zone.run(() => {
      this.alertMessage = message;
      this.showAlert = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.zone.run(() => {
          this.showAlert = false;
          this.cdr.markForCheck();
        });
      }, 3500);
    });
  }
}

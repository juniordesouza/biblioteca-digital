import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AuthGuard } from '../../auth.guard';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HomeHeaderComponent]
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);

  showAlert = false;
  alertMessage = '';

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    senha: ['', Validators.required]
  });

  ngOnInit(): void {
    // 🔥 Se já estiver logado, redireciona imediatamente
    if (this.authService.isLogged()) {
      this.router.navigate(['/catalogo']);
    }

    // Se está pendente → só pode esperar
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
      next: () => {
        this.router.navigate(['/catalogo']);
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

      setTimeout(() => {
        this.zone.run(() => {
          this.showAlert = false;
        });
      }, 3500);
    });
  }
}

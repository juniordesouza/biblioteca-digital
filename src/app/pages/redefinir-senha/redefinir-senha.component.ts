import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent, HttpClientModule],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  isTokenSent = signal(false);
  animateCard1 = signal(false);
  feedbackMessage = signal('');

  API_URL = 'http://localhost:8080/pessoas';

  // ============================================================
  // STEP 1 - ENVIAR CÓDIGO
  // ============================================================
  sendToken(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = (form.querySelector('#email') as HTMLInputElement).value.trim();

    if (!email) {
      this.feedbackMessage.set('Informe seu e-mail ou username.');
      return;
    }

    this.feedbackMessage.set('Enviando código...');

    this.http.post(`${this.API_URL}/recuperar-senha`, { email }).subscribe({
      next: () => {
        this.feedbackMessage.set('Código enviado!');
        this.isTokenSent.set(true);
        this.animateCard1.set(true);
        setTimeout(() => this.feedbackMessage.set(''), 2000);
      },
      error: () => {
        this.feedbackMessage.set('Erro ao enviar o código.');
        setTimeout(() => this.feedbackMessage.set(''), 2000);
      }
    });
  }

  // ============================================================
  // VALIDAR SENHA EM TEMPO REAL
  // ============================================================
  validatePasswordLive(password: string, confirm: string) {
    const rules = this.validatePassword(password);

    const ruleLength = document.querySelector('#rule-length');
    const ruleUpper = document.querySelector('#rule-upper');
    const ruleLower = document.querySelector('#rule-lower');
    const ruleNumber = document.querySelector('#rule-number');
    const ruleSpecial = document.querySelector('#rule-special');
    const matchBox = document.querySelector('#password-match');

    if (!ruleLength || !ruleUpper || !ruleLower || !ruleNumber || !ruleSpecial) return;

    ruleLength.classList.toggle('valid', rules.length);
    ruleUpper.classList.toggle('valid', rules.upper);
    ruleLower.classList.toggle('valid', rules.lower);
    ruleNumber.classList.toggle('valid', rules.number);
    ruleSpecial.classList.toggle('valid', rules.special);

    // Senhas diferentes
    if (confirm.length > 0 && password !== confirm) {
      matchBox?.classList.add('visible');
    } else {
      matchBox?.classList.remove('visible');
    }
  }

  // ============================================================
  // STEP 2 - RESETAR SENHA
  // ============================================================
  resetPassword(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const token = (form.querySelector('#token') as HTMLInputElement).value.trim();
    const password = (form.querySelector('#password') as HTMLInputElement).value.trim();
    const confirmPassword = (form.querySelector('#confirm-password') as HTMLInputElement).value.trim();
    const email = (document.querySelector('#email') as HTMLInputElement).value.trim();

    if (!token) {
      this.feedbackMessage.set('Código obrigatório.');
      return;
    }

    if (!password || !confirmPassword) {
      this.feedbackMessage.set('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      this.feedbackMessage.set('As senhas não coincidem.');
      return;
    }

    this.feedbackMessage.set('Redefinindo senha...');

    this.http
      .post(`${this.API_URL}/resetar-senha`, {
        email: email,
        token: token,
        novaSenha: password,
      })
      .subscribe({
        next: () => {
          this.feedbackMessage.set('Senha redefinida!');
          setTimeout(() => {
            this.feedbackMessage.set('');
            this.router.navigate(['/']);
          }, 2000);
        },
        error: () => {
          this.feedbackMessage.set('Código inválido ou expirado.');
          setTimeout(() => this.feedbackMessage.set(''), 2000);
        },
      });
  }

  // ============================================================
  // FUNÇÃO DE VALIDAÇÃO
  // ============================================================
  validatePassword(password: string) {
    return {
      length: password.length >= 6,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }
}

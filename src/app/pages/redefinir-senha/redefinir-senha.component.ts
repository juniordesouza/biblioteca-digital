import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private router = inject(Router);

  isTokenSent = signal(false);
  animateCard1 = signal(false);
  feedbackMessage = signal('');

  sendToken(event: Event): void {
    event.preventDefault();
    
    // 1. Mostra o banner e inicia a animação do card imediatamente
    this.feedbackMessage.set('código enviado!');
    this.isTokenSent.set(true);
    this.animateCard1.set(true);
    
    // 2. Define um timer para esconder o banner após 2 segundos, sem bloquear a animação
    setTimeout(() => {
      this.feedbackMessage.set('');
    }, 2000);
  }

  resetPassword(event: Event): void {
    event.preventDefault();
    this.feedbackMessage.set('senha redefinida');

    setTimeout(() => {
      this.feedbackMessage.set('');
      this.router.navigate(['/']);
    }, 2000);
  }
}

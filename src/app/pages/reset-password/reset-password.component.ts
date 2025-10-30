import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private router = inject(Router);

  isTokenSent = signal(false);
  animateCard1 = signal(false);
  feedbackMessage = signal('');

  sendToken(event: Event): void {
    event.preventDefault();
    this.feedbackMessage.set('código enviado!');
    
    setTimeout(() => {
      this.feedbackMessage.set('');
      this.isTokenSent.set(true);
      this.animateCard1.set(true);
    }, 2000); // A mensagem some e o card transiciona após 2s
  }

  resetPassword(event: Event): void {
    event.preventDefault();
    this.feedbackMessage.set('senha redefinida');

    setTimeout(() => {
      this.feedbackMessage.set('');
      this.router.navigate(['/']);
    }, 2000); // A mensagem some e o usuário é redirecionado após 2s
  }
}

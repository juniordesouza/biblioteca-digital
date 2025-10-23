import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  isTokenSent = signal(false);

  sendToken(event: Event) {
    event.preventDefault();
    // Aqui você adicionaria a lógica para enviar o email de recuperação
    // Por enquanto, vamos apenas ativar a animação
    this.isTokenSent.set(true);
  }
}

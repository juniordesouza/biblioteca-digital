import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  isTokenSent = signal(false);
  animateCard1 = signal(false);

  sendToken(event: Event) {
    event.preventDefault();
    this.isTokenSent.set(true);
    this.animateCard1.set(true);
  }
}

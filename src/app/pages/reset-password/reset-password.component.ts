import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  isTokenSent = signal(false);
  animateCard1 = signal(false);

  sendToken(event: Event): void {
    event.preventDefault();
    this.isTokenSent.set(true);
    this.animateCard1.set(true);
  }

  resetPassword(event: Event): void {
    event.preventDefault();
    alert('senha redefinida');
  }
}

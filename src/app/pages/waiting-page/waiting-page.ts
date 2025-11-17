import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

@Component({
  selector: 'app-espera',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent],
  templateUrl: './waiting-page.html',
  styleUrls: ['./waiting-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitingPageComponent {}

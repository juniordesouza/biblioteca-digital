import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  username: string | null = null; // 🔥 Nome do usuário

  constructor() {
    this.username = sessionStorage.getItem('username');
    this.username = this.username ? this.username.toUpperCase() : null;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}

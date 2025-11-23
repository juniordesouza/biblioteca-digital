import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  username: string | null = null;

  constructor(private router: Router) {
    this.username = sessionStorage.getItem('username');
    this.username = this.username ? this.username.toUpperCase() : null;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}

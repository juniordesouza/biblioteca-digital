import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-register-user.html',
  styleUrls: ['./admin-register-user.css']
})
export class AdminRegisterUserPage {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  user = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    cep: '',
    number: '',
    birthDate: ''
  };

  onSubmit() {
    console.log('Usuário cadastrado:', this.user);
    alert(`Usuário ${this.user.fullName} cadastrado com sucesso!`);
  }
}

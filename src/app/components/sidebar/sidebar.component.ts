import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  @Input() isOpen = true;

  // 🔥 Flags de permissão
  isAdmin = false;
  isFuncionario = false;

  ngOnInit() {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      // Decodificação simples do JWT
      const payload = JSON.parse(atob(token.split('.')[1]));

      // O JWT do backend tem "role" (ex: "ADMIN" ou "FUNCIONARIO")
      const role =
        payload.role ||
        payload.authorities ||
        payload.perfil ||
        payload.roles ||
        "";

      this.isAdmin = role === "ADMIN";
      this.isFuncionario = role === "FUNCIONARIO";

      // (Opcional) console para debug
      // console.log("Cargo detectado:", role);

    } catch (e) {
      console.error("Erro ao decodificar token:", e);
    }
  }
}

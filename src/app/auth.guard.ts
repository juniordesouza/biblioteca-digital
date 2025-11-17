import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const token = sessionStorage.getItem('token');
    const pending = sessionStorage.getItem('pendingUser');

    // =========================================
    // 1️⃣ Usuário APROVADO → pode tudo
    // =========================================
    if (token) return true;

    // =========================================
    // 2️⃣ Usuário PENDENTE → só pode /sala-de-espera
    // =========================================
    if (pending) {
      if (state.url === '/sala-de-espera') return true;

      this.router.navigate(['/sala-de-espera']);
      return false;
    }

    // =========================================
    // 3️⃣ Não logado → rota pública? deixa passar
    // =========================================

    const publicRoutes = ['/home', '/login', '/cadastro', '/redefinir-senha'];

    if (publicRoutes.includes(state.url)) {
      return true; // rota pública → deixa entrar
    }

    // Rota privada → mandar para login
    this.router.navigate(['/login']);
    return false;
  }
}

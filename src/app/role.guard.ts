import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const userRole = this.authService.getUserRole();
    const allowedRoles = route.data['roles'] as string[];

    // Se rota não definiu roles → permitir
    if (!allowedRoles) return true;

    // Se usuário não tiver role → negar
    if (!userRole) {
      this.router.navigate(['/catalogo']);
      return false;
    }

    // Se tiver permissão
    if (allowedRoles.includes(userRole)) return true;

    // Acesso negado
    this.router.navigate(['/catalogo']);
    return false;
  }
}

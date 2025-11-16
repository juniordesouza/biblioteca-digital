import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {

    const token = this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // opcional: validar expiração do JWT
    if (this.isTokenExpired(token)) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const jwt = token.replace("Bearer ", "");
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch (e) {
      return true;
    }
  }
}

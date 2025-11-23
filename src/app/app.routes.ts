import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { AdminDashboardPage } from './pages/admin-dashboard-page/admin-dashboard-page';
import { AdminListBooks } from './pages/admin-list-books/admin-list-books';
import { AdminRegisterUserPage } from './pages/admin-register-user/admin-register-user';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ResetPasswordComponent } from './pages/redefinir-senha/redefinir-senha.component';
import { LivroDetailsComponent } from './pages/livro-details/livro-details.component';
import { WaitingPageComponent } from './pages/waiting-page/waiting-page';
import { AuthGuard } from './auth.guard';
import { AdminUserAprove } from './pages/admin-user-aprove/admin-user-aprove';
import { AdminUserList } from './pages/admin-user-list/admin-user-list';
import { AdminRegisterBook } from './pages/admin-register-book/admin-register-book';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'redefinir-senha', component: ResetPasswordComponent },
    { path: 'catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
    { path: 'sala-de-espera', component: WaitingPageComponent, canActivate: [AuthGuard] },
    { path: 'livros/:id', component: LivroDetailsComponent, canActivate: [AuthGuard] },
    { path: 'sobre', component: SobreComponent, canActivate: [AuthGuard] },
    { path: 'admin/dashboard', component: AdminDashboardPage, canActivate: [AuthGuard] },
    { path: 'admin/usuarios', component: AdminUserList, canActivate: [AuthGuard] },
    { path: 'admin/aprovacoes', component: AdminUserAprove, canActivate: [AuthGuard] },
    { path: 'admin/livros', component: AdminListBooks, canActivate: [AuthGuard] },
    { path: 'admin/cadastrar-livros', component: AdminRegisterBook, canActivate: [AuthGuard] },
    { path: 'admin/register-user', component: AdminRegisterUserPage, canActivate: [AuthGuard] },
    {
    path: 'livro/ler/:id',
    loadComponent: () => import('./pages/book-reader-page/book-reader-page').then(m => m.BookReaderPage),
    canActivate: [AuthGuard]
    }

];

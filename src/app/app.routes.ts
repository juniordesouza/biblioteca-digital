
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { BookDetailsComponent } from './pages/book-detail/book-details.component';
import { AdminDashboardPage } from './pages/admin-dashboard-page/admin-dashboard-page';
import { AdminRegisterUserPage } from './pages/admin-register-user/admin-register-user';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ResetPasswordComponent } from './pages/redefinir-senha/redefinir-senha.component';
import { LivroDetailsComponent } from './pages/livro-details/livro-details.component';
import { WaitingPageComponent } from './pages/waiting-page/waiting-page';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'redefinir-senha', component: ResetPasswordComponent },
    { path: 'sala-de-espera', component: WaitingPageComponent },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'livros/:id', component: LivroDetailsComponent }, // Rota de detalhes do livro
    { path: 'sobre', component: SobreComponent },
    { path: 'admin/dashboard', component: AdminDashboardPage },
    { path: 'admin/register-user', component: AdminRegisterUserPage },
    { path: 'livro/ler/:id', loadComponent: () => import('./pages/book-reader-page/book-reader-page').then(m => m.BookReaderPage) }
];

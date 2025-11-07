import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { LivroComponent } from './pages/book-detail/livro.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ResetPasswordComponent } from './pages/redefinir-senha/redefinir-senha.component'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'livro/:id', component: LivroComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'favoritos', component: FavoritosComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'redefinir-senha', component: ResetPasswordComponent }
];

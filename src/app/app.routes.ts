import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SobreComponent } from './sobre/sobre.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'livro/:id', component: BookDetailComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'favoritos', component: FavoritosComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent }
];

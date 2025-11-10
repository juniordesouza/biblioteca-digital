
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { BookDetailsComponent } from './pages/book-detail/book-details.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'livro/:id', component: BookDetailsComponent }, // Rota de detalhes do livro
    { path: 'sobre', component: SobreComponent },
];

# Blueprint da Aplicação Biblioteca Digital

## Visão Geral

O objetivo deste projeto é criar uma aplicação de biblioteca digital moderna e interativa usando as últimas funcionalidades do Angular. A aplicação permitirá aos usuários navegar por um catálogo de livros, ver detalhes de cada livro, adicionar livros aos seus favoritos e se cadastrar para ter uma experiência personalizada.

## Estilo, Design e Funcionalidades

* **Arquitetura Standalone:** Todos os componentes, diretivas e pipes são standalone para uma arquitetura mais limpa e modular.
* **Change Detection OnPush:** Todos os componentes usam a estratégia `ChangeDetectionStrategy.OnPush` para um melhor desempenho.
* **Controle de Fluxo Nativo:** Utiliza a nova sintaxe `@` para todo o controle de fluxo nos templates.
* **CSS Moderno e Responsivo:** A aplicação utiliza CSS nativo e moderno para um design visualmente atraente e responsivo.
* **Componentes Reutilizáveis:** Criação de componentes reutilizáveis, como o `livro-card` e o `menu`, para manter um código limpo e consistente.
* **Roteamento:** O roteamento da aplicação é configurado no arquivo `app.routes.ts`.
* **Menu de Navegação:** Um menu de navegação horizontal está presente nas páginas de Catálogo, Favoritos e Detalhes do Livro.

## Plano de Desenvolvimento Atual

O plano atual foi adicionar o componente de menu horizontal nas páginas de favoritos e de detalhes do livro.

### Passos:

1.  **Adicionar Menu aos Favoritos:**
    *   Importar o `MenuComponent` em `favoritos.component.ts`.
    *   Adicionar `MenuComponent` aos `imports` do componente.
    *   Adicionar o seletor `<app-menu>` em `favoritos.component.html`.
2.  **Adicionar Menu aos Detalhes do Livro:**
    *   Importar o `MenuComponent` em `book-details.component.ts`.
    *   Adicionar `MenuComponent` aos `imports` do componente.
    *   Adicionar o seletor `<app-menu>` em `book-details.component.html`.
3.  **Verificar e Finalizar:**
    *   Executar o `ng build`.
    *   Atualizar o `blueprint.md`.

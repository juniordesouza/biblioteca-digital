
# Blueprint da Aplicação: Biblioteca Digital

## Visão Geral

A "Biblioteca Digital" é uma aplicação web moderna, construída com a versão mais recente do Angular, projetada para ser uma plataforma visualmente atraente e interativa para explorar uma coleção de livros. A aplicação utiliza os recursos mais recentes do Angular, como componentes standalone, signals para gerenciamento de estado reativo e a nova sintaxe de controle de fluxo, garantindo uma experiência de usuário rápida e fluida.

## Design e Estilo

- **Tema Escuro e Imersivo**: A aplicação utiliza uma paleta de cores escura, com `#141414` como cor de fundo principal e texto em branco (`#fff`), criando um ambiente de leitura confortável e focado.
- **Tipografia Moderna**: Fontes limpas e legíveis são usadas para garantir uma ótima experiência de leitura.
- **Layout Responsivo**: O design se adapta a diferentes tamanhos de tela, funcionando perfeitamente em desktops e dispositivos móveis.
- **Efeitos Visuais**: Cards de livros com cantos arredondados, sombras sutis e um efeito de "zoom" ao passar o mouse criam uma sensação de profundidade e interatividade.
- **Navegação Intuitiva**: Um menu de navegação fixo no topo (`app-menu`) permite acesso fácil às principais seções: Catálogo, Sobre e Home.

## Funcionalidades Implementadas

- **Página de Catálogo**:
  - Exibe livros organizados por categorias em carrosséis horizontais, semelhante à interface da Netflix.
  - Títulos de categoria são exibidos acima de cada carrossel.
  - Setas de navegação (visíveis no desktop ao passar o mouse) permitem a rolagem horizontal dos livros.
  - O fundo da página de catálogo é consistente com o tema escuro do resto da aplicação.
  - Os cards de livro no catálogo exibem apenas a imagem da capa para um visual mais limpo e focado.
- **Componente de Card de Livro (`LivroCardComponent`)**:
  - Apresenta a capa de um livro.
  - Ao passar o mouse, um efeito de escala e sombra é aplicado.
- **Serviço de Livros (`LivroService`)**:
  - Fornece dados de livros mockados para a aplicação, simulando uma chamada de API.
- **Páginas de "Sobre" e "Home"**:
  - Páginas estáticas com conteúdo informativo e um design consistente com o tema geral.

## Plano para a Próxima Funcionalidade: Página de Detalhes do Livro

### Objetivo

Criar uma página dedicada para cada livro, que será acessada ao clicar em um livro na página de catálogo. Esta página exibirá informações detalhadas sobre o livro selecionado.

### Passos da Implementação

1.  **Fase 1: Criação da Página e Rota de Detalhes**
    - **Gerar o Componente**: Criar o `LivroDetailsComponent` para a página de detalhes.
    - **Configurar a Rota Dinâmica**: Adicionar a rota `livro/:id` no arquivo `app.routes.ts`.

2.  **Fase 2: Lógica de Busca e Exibição**
    - **Buscar Livro por ID**: Adicionar o método `getBookById(id)` ao `LivroService`.
    - **Carregar Dados na Página**: Implementar a lógica no `LivroDetailsComponent` para buscar e exibir os dados do livro com base no `id` da URL.
    - **Layout da Página**: Desenvolver o HTML e CSS para apresentar as informações do livro de forma clara e atraente.

3.  **Fase 3: Habilitando a Navegação**
    - **Tornar o Card Clicável**: Modificar o `LivroCardComponent` para navegar para a página de detalhes do livro ao ser clicado.

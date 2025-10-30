# Blueprint do Projeto: App de Catálogo de Livros

## Visão Geral

Este documento descreve o plano de desenvolvimento para um aplicativo de catálogo de livros, detalhando os recursos, design e etapas de implementação.

## Recursos e Design Implementados

- **Página Inicial**: Apresenta o aplicativo e seus recursos.
- **Catálogo de Livros**: Exibe uma lista de livros com imagens e títulos.
- **Detalhes do Livro**: Mostra informações detalhadas sobre um livro selecionado.
- **Favoritos**: Permite ao usuário salvar e visualizar seus livros favoritos.
- **Página "Sobre"**: Fornece informações sobre o projeto.
- **Páginas de Login e Cadastro**: Interfaces para gerenciamento de contas de usuário.
- **Navegação**: Barra de navegação para acessar as diferentes seções do app.
- **Página de Usuário**: Exibe uma foto de perfil aleatória e uma descrição do usuário.
- **Página de Redefinição de Senha**:
    - Interface de dois cards para solicitação de token e redefinição de senha.
    - **Animação Paralela**: A animação de transição dos cards ocorre em paralelo com a exibição do banner de feedback, proporcionando uma experiência de usuário mais fluida e responsiva.
    - **Banner de Feedback Flutuante**: Uma faixa verde no topo da página exibe mensagens de status (ex: "código enviado", "senha redefinida") sem afetar o layout da página.

## Plano de Implementação Atual

### Concluído: Otimização da Experiência de Redefinição de Senha

1.  **Animações em Paralelo**: A lógica foi refatorada para permitir que a animação de transição do card e a exibição do banner de feedback ocorram simultaneamente, eliminando atrasos na interface.
2.  **Banner de Feedback Flutuante**: O banner usa `position: fixed` para garantir que ele flutue sobre o conteúdo sem deslocar outros elementos da página.
3.  **Lógica Simplificada**: A gestão das mensagens e animações foi aprimorada para maior clareza e eficiência.

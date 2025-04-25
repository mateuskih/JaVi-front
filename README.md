# Frontend - JáVí

Este é o frontend do projeto de gerenciamento de filmes assistidos. Desenvolvido em HTML, CSS e JavaScript puro, consome a API REST do backend para exibir, adicionar, editar e remover filmes.

## Funcionalidades
- Listagem de filmes assistidos
- Busca e filtro de filmes
- Adição de novos filmes
- Edição de filmes existentes
- Visualização de detalhes
- Exclusão de filmes com confirmação
- Interface responsiva

## Estrutura de Pastas
```
frontend/
├── adicionar.html    # Formulário para adicionar filme
├── detalhes.html     # Página de detalhes do filme
├── editar.html       # Formulário para editar filme
├── index.html        # Página principal (listagem de filmes)
├── css/              # Estilos CSS
├── images/           # Imagens e logo
└── js/               # Scripts JavaScript
    ├── adicionar.js
    ├── config.js     # Configuração da URL da API
    ├── detalhes.js
    ├── editar.js
    └── script.js
```

## Requisitos
- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Backend rodando e acessível (consulte o README do backend)

## Configuração da URL da API

A URL da API está definida diretamente no arquivo `frontend/js/config.js`:

```js
export const API_URL = 'http://localhost:3001/api/filmes';
```


## Execução
Abra o arquivo `index.html` em seu navegador ou utilize um servidor local para evitar problemas de CORS:

```bash
cd frontend
npx serve
```

## Observações
- O frontend depende do backend para funcionar corretamente.
- Para ambientes de produção, ajuste a variável `API_URL` conforme necessário.
- Todos os scripts JS estão modularizados e usam import/export (certifique-se de servir os arquivos via servidor local para que os imports funcionem).

import { API_URL } from './config.js';

let listaFilmes;
let buscaInput;
let modalConfirmacao;
let btnConfirmarExclusao;
let btnCancelarExclusao;
let filmes = [];
let filmeParaExcluir = null;

document.addEventListener('DOMContentLoaded', () => {
    listaFilmes = document.getElementById('lista-filmes');
    buscaInput = document.getElementById('busca');
    modalConfirmacao = document.getElementById('modal-confirmacao');
    btnConfirmarExclusao = document.getElementById('confirmar-exclusao');
    btnCancelarExclusao = document.getElementById('cancelar-exclusao');

    carregarFilmes();

    if (buscaInput) {
        buscaInput.addEventListener('input', filtrarFilmes);
    }

    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
    }

    if (btnCancelarExclusao) {
        btnCancelarExclusao.addEventListener('click', fecharModal);
    }
});

async function carregarFilmes() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        filmes = await response.json();
        renderizarFilmes(filmes);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        exibirMensagemErro('Não foi possível carregar os filmes. Verifique se o servidor está rodando.');
    }
}

function renderizarFilmes(filmesParaExibir) {
    if (!listaFilmes) return;

    listaFilmes.innerHTML = '';

    if (filmesParaExibir.length === 0) {
        listaFilmes.innerHTML = '<div class="no-results">Nenhum filme encontrado</div>';
        return;
    }

    const template = document.getElementById('template-filme');

    filmesParaExibir.forEach(filme => {
        const filmeElement = document.importNode(template.content, true);

        const imagem = filmeElement.querySelector('.filme-imagem img');
        imagem.src = filme.imagem || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
        imagem.alt = `Poster de ${filme.titulo}`;

        filmeElement.querySelector('.filme-titulo').textContent = filme.titulo;
        filmeElement.querySelector('.filme-genero').textContent = `Gênero: ${filme.genero}`;
        filmeElement.querySelector('.filme-ano').textContent = `Ano: ${filme.ano}`;

        const notaElement = filmeElement.querySelector('.filme-nota');
        const estrelasElement = notaElement.querySelector('.estrelas');
        const valorNotaElement = notaElement.querySelector('.valor-nota');

        const notaEmEstrelas = Math.round(filme.nota / 2);
        estrelasElement.textContent = '★'.repeat(notaEmEstrelas) + '☆'.repeat(5 - notaEmEstrelas);
        valorNotaElement.textContent = filme.nota;

        const statusElement = filmeElement.querySelector('.assistido');
        if (filme.assistido) {
            statusElement.textContent = 'Assistido';
            statusElement.classList.add('assistido');
        } else {
            statusElement.textContent = 'Não assistido';
            statusElement.classList.add('nao-assistido');
        }

        const btnDetalhes = filmeElement.querySelector('.btn-detalhes');
        btnDetalhes.href = `detalhes.html?id=${filme.id}`;

        const btnEditar = filmeElement.querySelector('.btn-editar');
        btnEditar.href = `editar.html?id=${filme.id}`;

        const btnExcluir = filmeElement.querySelector('.btn-excluir');
        btnExcluir.addEventListener('click', () => abrirModalExclusao(filme));

        listaFilmes.appendChild(filmeElement);
    });
}

function filtrarFilmes() {
    const termoBusca = buscaInput.value.toLowerCase();

    const filmesFiltered = filmes.filter(filme => {
        return (
            filme.titulo.toLowerCase().includes(termoBusca) ||
            filme.genero.toLowerCase().includes(termoBusca)
        );
    });

    renderizarFilmes(filmesFiltered);
}

function abrirModalExclusao(filme) {
    filmeParaExcluir = filme;
    modalConfirmacao.classList.remove('hidden');
    modalConfirmacao.classList.add('active');
}

function fecharModal() {
    modalConfirmacao.classList.remove('active');
    modalConfirmacao.classList.add('hidden');
    filmeParaExcluir = null;
}

async function confirmarExclusao() {
    if (!filmeParaExcluir) return;

    try {
        const response = await fetch(`${API_URL}/${filmeParaExcluir.id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        filmes = filmes.filter(f => f.id !== filmeParaExcluir.id);
        renderizarFilmes(filmes);

        fecharModal();
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        exibirMensagemErro('Não foi possível excluir o filme.');
    }
}

function exibirMensagemErro(mensagem) {
    if (!listaFilmes) return;

    listaFilmes.innerHTML = `<div class="error-message">${mensagem}</div>`;
}
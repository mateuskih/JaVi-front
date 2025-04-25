import { API_URL } from './config.js';

const loadingElement = document.querySelector('.loading');
const detalhesFilmeElement = document.getElementById('detalhes-filme');
const modalConfirmacao = document.getElementById('modal-confirmacao');
const btnConfirmarExclusao = document.getElementById('confirmar-exclusao');
const btnCancelarExclusao = document.getElementById('cancelar-exclusao');
const btnExcluir = document.getElementById('btn-excluir');

let filmeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    filmeId = params.get('id');

    if (!filmeId) {
        exibirMensagem('ID do filme não especificado', 'erro');
        return;
    }

    carregarFilme(filmeId);

    btnExcluir.addEventListener('click', abrirModalExclusao);
    btnConfirmarExclusao.addEventListener('click', excluirFilme);
    btnCancelarExclusao.addEventListener('click', fecharModal);
});

async function carregarFilme(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const filme = await response.json();
        exibirDetalhesFilme(filme);

    } catch (error) {
        console.error('Erro ao carregar filme:', error);
        exibirMensagem('Não foi possível carregar os detalhes do filme. Verifique se o servidor está rodando.', 'erro');
    }
}

function exibirDetalhesFilme(filme) {
    document.getElementById('filme-imagem').src = filme.imagem || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
    document.getElementById('filme-imagem').alt = `Poster de ${filme.titulo}`;
    document.getElementById('filme-titulo').textContent = filme.titulo;
    document.getElementById('filme-genero').textContent = `Gênero: ${filme.genero}`;
    document.getElementById('filme-ano').textContent = `Ano: ${filme.ano}`;

    const notaEmEstrelas = Math.round(filme.nota / 2);
    document.getElementById('filme-estrelas').textContent = '★'.repeat(notaEmEstrelas) + '☆'.repeat(5 - notaEmEstrelas);
    document.getElementById('filme-nota').textContent = filme.nota;

    const statusElement = document.getElementById('filme-assistido');
    if (filme.assistido) {
        statusElement.textContent = 'Assistido';
        statusElement.classList.add('assistido');
    } else {
        statusElement.textContent = 'Não assistido';
        statusElement.classList.add('nao-assistido');
    }

    document.getElementById('btn-editar').href = `editar.html?id=${filme.id}`;

    loadingElement.style.display = 'none';
    detalhesFilmeElement.style.display = 'block';
}

function abrirModalExclusao() {
    modalConfirmacao.classList.add('active');
}

function fecharModal() {
    modalConfirmacao.classList.remove('active');
}

async function excluirFilme() {
    try {
        const response = await fetch(`${API_URL}/${filmeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        exibirMensagem('Não foi possível excluir o filme.', 'erro');
        fecharModal();
    }
}

function exibirMensagem(texto, tipo) {
    const mensagemAnterior = document.querySelector('.mensagem');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    const mensagem = document.createElement('div');
    mensagem.className = `mensagem ${tipo}`;
    mensagem.textContent = texto;

    const detalhesContainer = document.querySelector('.detalhes-container');
    detalhesContainer.insertBefore(mensagem, loadingElement);

    if (tipo === 'sucesso') {
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }
}
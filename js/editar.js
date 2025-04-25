import { API_URL } from './config.js';

const form = document.getElementById('form-editar-filme');
const loadingElement = document.querySelector('.loading');

let filmeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    filmeId = params.get('id');

    if (!filmeId) {
        exibirMensagem('ID do filme não especificado', 'erro');
        return;
    }

    carregarFilme(filmeId);

    if (form) {
        form.addEventListener('submit', atualizarFilme);
    }
});

async function carregarFilme(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const filme = await response.json();
        preencherFormulario(filme);

        loadingElement.style.display = 'none';
        form.style.display = 'block';

    } catch (error) {
        console.error('Erro ao carregar filme:', error);
        exibirMensagem('Não foi possível carregar os dados do filme. Verifique se o servidor está rodando.', 'erro');
        loadingElement.style.display = 'none';
    }
}

function preencherFormulario(filme) {
    document.getElementById('titulo').value = filme.titulo;
    document.getElementById('genero').value = filme.genero;
    document.getElementById('ano').value = filme.ano;
    document.getElementById('nota').value = filme.nota;
    document.getElementById('imagem').value = filme.imagem || '';
    document.getElementById('assistido').checked = filme.assistido;
}

async function atualizarFilme(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const ano = parseInt(document.getElementById('ano').value);
    const nota = parseFloat(document.getElementById('nota').value);
    const imagem = document.getElementById('imagem').value.trim();
    const assistido = document.getElementById('assistido').checked;

    if (!titulo || !genero || isNaN(ano) || isNaN(nota)) {
        exibirMensagem('Preencha todos os campos obrigatórios', 'erro');
        return;
    }

    const filmeAtualizado = {
        titulo,
        genero,
        ano,
        nota,
        assistido,
        imagem: imagem || null
    };

    try {
        const response = await fetch(`${API_URL}/${filmeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filmeAtualizado)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const filmeAtualizadoResponse = await response.json();

        exibirMensagem(`Filme "${filmeAtualizadoResponse.titulo}" atualizado com sucesso!`, 'sucesso');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        exibirMensagem('Não foi possível atualizar o filme. Verifique se o servidor está rodando.', 'erro');
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

    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(mensagem, loadingElement);

    if (tipo === 'sucesso') {
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }
}
import { API_URL } from './config.js';

const form = document.getElementById('form-adicionar-filme');

document.addEventListener('DOMContentLoaded', () => {
    if (form) {
        form.addEventListener('submit', adicionarFilme);
    }
});

async function adicionarFilme(event) {
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

    const novoFilme = {
        titulo,
        genero,
        ano,
        nota,
        assistido,
        imagem: imagem || null
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoFilme)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const filmeAdicionado = await response.json();

        exibirMensagem(`Filme "${filmeAdicionado.titulo}" adicionado com sucesso!`, 'sucesso');

        form.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        exibirMensagem('Não foi possível adicionar o filme. Verifique se o servidor está rodando.', 'erro');
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
    formContainer.insertBefore(mensagem, form);

    if (tipo === 'sucesso') {
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }
}
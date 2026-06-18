/***********************************************************************************
 * Objetivo: Arquivo de manipulação do painel administrativo - Cargos
 * Data: 16/06/2026
 * Autor: Diego de Padua
 * Versão: 1.0
 ***********************************************************************************/
'use strict'

// Defina a URL base da sua API
const BASE_URL = 'http://localhost:3000/v1/fynix/deliciagelada'

// ==========================================
// 1. CADASTRAR CARGO (POST)
// ==========================================
window.salvarNovoCargo = async function(event) {
    if (event) event.preventDefault();

    const nomeInput = document.getElementById('nomeCargo');
    const nomeValor = nomeInput ? nomeInput.value.trim() : '';

    if (!nomeValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Por favor, preencha o nome do cargo!',
            confirmButtonColor: '#FF9800'
        });
        return;
    }

    const novoCargo = { nome: nomeValor };

    try {
        const resposta = await fetch(`${BASE_URL}/cargo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoCargo)
        });

        const dados = await resposta.json();

        if (resposta.status === 201 || resposta.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Cargo cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (nomeInput) {
                nomeInput.value = '';
                nomeInput.focus(); 
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.message || 'Erro ao cadastrar. Verifique os dados.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na API:', erro);
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Falha ao conectar com o servidor.',
            confirmButtonColor: '#005A9C'
        });
    }
}

// ==========================================
// 2. LISTAR TODOS OS CARGOS (GET)
// ==========================================
window.listarCargos = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/cargo`);
        const dados = await resposta.json();

        if (resposta.ok && dados.response) {
            const lista = dados.response;
            const tabelaBody = document.getElementById('tabela-cargos')

            if (!tabelaBody) return;

            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild);
            }

            lista.forEach(cargo => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition';

                const tdNome = document.createElement('td');
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C]';
                tdNome.textContent = cargo.nome;
                tr.appendChild(tdNome);

                const tdAcoes = document.createElement('td');
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200';
                
                const divAcoes = document.createElement('div');
                divAcoes.className = 'flex items-center justify-center gap-5';

                const btnEditar = document.createElement('button');
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition';
                btnEditar.innerHTML = `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
                btnEditar.title = "Editar";
                btnEditar.addEventListener('click', () => abrirModalEdicaoCargo(cargo.id, cargo.nome));
                divAcoes.appendChild(btnEditar);

                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition';
                btnExcluir.innerHTML = `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
                btnExcluir.title = "Excluir";
                btnExcluir.addEventListener('click', () => deletarCargo(cargo.id));
                divAcoes.appendChild(btnExcluir);

                tdAcoes.appendChild(divAcoes);
                tr.appendChild(tdAcoes);
                tabelaBody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar cargos:', erro);
    }
}

// ==========================================
// 3. ATUALIZAR (PUT)
// ==========================================
window.atualizarCargo = async function(id) {
    const nomeInput = document.getElementById('editCargoNome');
    const nomeValor = nomeInput ? nomeInput.value.trim() : '';

    if (!nomeValor) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'O nome do cargo não pode ser vazio!',
            confirmButtonColor: '#FF9800'
        });
        return;
    }

    try {
        const resposta = await fetch(`${BASE_URL}/cargo/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeValor })
        });

        if (resposta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'Cargo atualizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            fecharModal();
            listarCargos();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao atualizar o cargo.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro);
    }
}

// ==========================================
// 4. DELETAR (DELETE) - Com SweetAlert2 Confirm
// ==========================================
window.deletarCargo = async function(id) {
    // Substituindo o confirm nativo pelo SweetAlert2
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const resposta = await fetch(`${BASE_URL}/cargo/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                Swal.fire(
                    'Excluído!',
                    'O cargo foi removido com sucesso.',
                    'success'
                );
                listarCargos(); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Não foi possível excluir',
                    text: 'Este cargo pode estar vinculado a um usuário.',
                    confirmButtonColor: '#005A9C'
                });
            }
        } catch (erro) {
            console.error('Erro ao deletar:', erro);
        }
    }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
window.abrirModalEdicaoCargo = function(id, nomeAtual) {
    const modal = document.getElementById('modal-editar-cargo');
    const inputNome = document.getElementById('editCargoNome');
    const btnSalvar = document.getElementById('btnSalvarEdicaoCargo');
    
    if (modal && inputNome) {
        inputNome.value = nomeAtual;
        if (btnSalvar) {
            btnSalvar.onclick = () => atualizarCargo(id);
        }
        modal.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabela-cargos')) {
        listarCargos()
    }
})

window.fecharModal = function() {
    const modal = document.getElementById('modal-editar-cargo');
    if (modal) {
        modal.classList.add('hidden');
    }
}
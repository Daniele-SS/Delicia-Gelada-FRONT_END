'use strict'

// Defina a URL base da sua API
const BASE_URL = 'http://localhost:3000/v1/fynix/deliciagelada'

// 1. CADASTRAR (POST)
window.salvarNovoTipoBebida = async function(event) {
    if (event) event.preventDefault();

    const nomeInput = document.getElementById('nomeTipo')
    const volumeInput = document.getElementById('volumeTipo')
    const teorInput = document.getElementById('teorTipo')
    const preparoInput = document.getElementById('preparoTipo')
    const ingredientesInput = document.getElementById('ingredientesTipo')
    const perfilInput = document.getElementById('perfilTipo')
    const dicaInput = document.getElementById('dicaTipo')

    const novoTipo = {
        nome: nomeInput ? nomeInput.value.trim() : null,
        volume: volumeInput ? volumeInput.value.trim() : null,
        teor_alcoolico: teorInput ? teorInput.value.trim() : null,
        modo_preparo: preparoInput ? preparoInput.value.trim() : null,
        ingredientes: ingredientesInput ? ingredientesInput.value.trim() : null,
        perfil_sabor: perfilInput ? perfilInput.value.trim() || null : null,
        dica_delicia: dicaInput ? dicaInput.value.trim() || null : null
    }

    // Validação 
    if (!novoTipo.nome || !novoTipo.volume || !novoTipo.teor_alcoolico || !novoTipo.modo_preparo || !novoTipo.ingredientes) {
        alert('Preencha todos os campos obrigatórios!')
        return
    }

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoTipo)
        })

        const dados = await resposta.json()

        if (resposta.status === 201) {
            alert('Tipo de Bebida cadastrado com sucesso!')
        } else {
            alert(`Erro ao cadastrar: ${dados.message || 'Verifique os dados.'}`)
        }
    } catch (erro) {
        console.error('Erro na API:', erro)
        alert('Falha de conexão com o servidor.')
    }
}

// 2. LISTAR TODOS (GET) - Construção Segura do DOM
window.listarTiposBebida = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida`)
        const dados = await resposta.json()

        if (resposta.ok && dados.response) {
            const lista = dados.response
            const tabelaBody = document.querySelector('#tabelaTiposBebida tbody')
            
            if (!tabelaBody) return
            
            // Limpa a tabela de forma segura
            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild)
            }

            lista.forEach(tipo => {
                // Cria a linha (tr)
                const tr = document.createElement('tr')

                // Cria a célula do Nome
                const tdNome = document.createElement('td')
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C]'
                tdNome.textContent = tipo.nome
                tr.appendChild(tdNome)

                // Cria a célula do Volume
                const tdVolume = document.createElement('td')
                tdVolume.className = 'py-4 px-6 text-sm text-gray-600'
                tdVolume.textContent = tipo.volume
                tr.appendChild(tdVolume)

                // Cria a célula de Ações
                const tdAcoes = document.createElement('td')
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200'
                
                const divAcoes = document.createElement('div')
                divAcoes.className = 'flex items-center justify-center gap-5'

                // Botão Editar
                const btnEditar = document.createElement('button');
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition';
                btnEditar.textContent = 'Editar';
                btnEditar.addEventListener('click', () => abrirModalEdicaoTipo(tipo.id))
                divAcoes.appendChild(btnEditar)

                // Botão Excluir
                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition'
                btnExcluir.textContent = 'Excluir';
                btnExcluir.addEventListener('click', () => deletarTipoBebida(tipo.id))
                divAcoes.appendChild(btnExcluir)

                tdAcoes.appendChild(divAcoes)
                tr.appendChild(tdAcoes)

                // Anexa a linha completa ao corpo da tabela
                tabelaBody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar tipos de bebida:', erro)
    }
}

// 3. ATUALIZAR (PUT)
window.atualizarTipoBebida = async function(id) {
    const nomeInput = document.getElementById('editNomeTipo')
    const volumeInput = document.getElementById('editVolumeTipo')
    const teorInput = document.getElementById('editTeorTipo')
    const preparoInput = document.getElementById('editPreparoTipo')
    const ingredientesInput = document.getElementById('editIngredientesTipo')
    const perfilInput = document.getElementById('editPerfilTipo')
    const dicaInput = document.getElementById('editDicaTipo')

    const tipoAtualizado = {
        nome: nomeInput ? nomeInput.value : '',
        volume: volumeInput ? volumeInput.value : '',
        teor_alcoolico: teorInput ? teorInput.value : '',
        modo_preparo: preparoInput ? preparoInput.value : '',
        ingredientes: ingredientesInput ? ingredientesInput.value : '',
        perfil_sabor: perfilInput && perfilInput.value ? perfilInput.value : null,
        dica_delicia: dicaInput && dicaInput.value ? dicaInput.value : null
    }

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoAtualizado)
        })

        if (resposta.ok) {
            alert('Atualizado com sucesso!');
            if (typeof fecharModal === 'function') fecharModal();
            listarTiposBebida() 
        } else {
            alert('Erro ao atualizar.')
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro)
    }
}

// 4. DELETAR (DELETE)
window.deletarTipoBebida = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este Tipo de Bebida?')) return

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Excluído com sucesso!')
            listarTiposBebida()
        } else {
            alert('Erro ao excluir. Pode estar vinculado a uma bebida.')
        }
    } catch (erro) {
        console.error('Erro ao deletar:', erro)
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaTiposBebida')) {
        listarTiposBebida();
    }
})
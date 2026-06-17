'use strict'

// Defina a URL base da sua API (ajuste a porta se necessário)
const BASE_URL = 'http://localhost:8080/v1/fynix/deliciagelada/tipo_bebida'

// 1. CADASTRAR (POST)
window.salvarNovoTipoBebida = async function(event) {
    if (event) event.preventDefault();

    const novoTipo = {
        nome: document.getElementById('nomeTipo')?.value.trim(),
        volume: document.getElementById('volumeTipo')?.value.trim(),
        teor_alcoolico: document.getElementById('teorTipo')?.value.trim(),
        modo_preparo: document.getElementById('preparoTipo')?.value.trim(),
        ingredientes: document.getElementById('ingredientesTipo')?.value.trim(),
        perfil_sabor: document.getElementById('perfilTipo')?.value.trim() || null,
        dica_delicia: document.getElementById('dicaTipo')?.value.trim() || null
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
            window.location.href = '../pages/lista-tipo-bebida.html'
        } else {
            alert(`Erro ao cadastrar: ${dados.message || 'Verifique os dados.'}`)
        }
    } catch (erro) {
        console.error('Erro na API:', erro)
        alert('Falha de conexão com o servidor.')
    }
}

// 2. LISTAR TODOS (GET)
window.listarTiposBebida = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida`)
        const dados = await resposta.json()

        if (resposta.ok && dados.response) {
            // dados.response contém o array de tipos de bebida vindo do seu backend
            const lista = dados.response; 
            const tabelaBody = document.querySelector('#tabelaTiposBebida tbody')
            
            if (!tabelaBody) return
            
            tabelaBody.innerHTML = '' // Limpa a tabela antes de preencher

            lista.forEach(tipo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="py-4 px-6 text-sm font-semibold text-[#005A9C]">${tipo.nome}</td>
                    <td class="py-4 px-6 text-sm text-gray-600">${tipo.volume}</td>
                    <td class="py-4 px-6 border-l border-gray-200">
                        <div class="flex items-center justify-center gap-5">
                            <button onclick="abrirModalEdicaoTipo(${tipo.id})" class="text-gray-800 hover:text-[#005A9C] transition">Editar</button>
                            <button onclick="deletarTipoBebida(${tipo.id})" class="text-gray-800 hover:text-red-600 transition">Excluir</button>
                        </div>
                    </td>
                `
                tabelaBody.appendChild(tr)
            })
        }
    } catch (erro) {
        console.error('Erro ao buscar tipos de bebida:', erro)
    }
}

// 3. ATUALIZAR (PUT)
window.atualizarTipoBebida = async function(id) {
    const tipoAtualizado = {
        nome: document.getElementById('editNomeTipo').value,
        volume: document.getElementById('editVolumeTipo').value,
        teor_alcoolico: document.getElementById('editTeorTipo').value,
        modo_preparo: document.getElementById('editPreparoTipo').value,
        ingredientes: document.getElementById('editIngredientesTipo').value,
        perfil_sabor: document.getElementById('editPerfilTipo').value || null,
        dica_delicia: document.getElementById('editDicaTipo').value || null
    }

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoAtualizado)
        })

        if (resposta.ok) {
            alert('Atualizado com sucesso!');
            fecharModal();
            listarTiposBebida() // Recarrega a tabela para mostrar o dado novo
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

// Chama a listagem automaticamente se estiver na página da tabela
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaTiposBebida')) {
        listarTiposBebida();
    }
})
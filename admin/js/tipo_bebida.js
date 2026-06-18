'use strict'

// Defina a URL base da sua API
const BASE_URL = 'https://delicia-gelada-api.cleverapps.io/v1/fynix/deliciagelada'

// ==========================================
// 1. CADASTRAR (POST)
// ==========================================
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

    // Validação usando SweetAlert2
    if (!novoTipo.nome || !novoTipo.volume || !novoTipo.teor_alcoolico || !novoTipo.modo_preparo || !novoTipo.ingredientes) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Obrigatórios',
            text: 'Por favor, preencha todos os campos sinalizados com * !',
            confirmButtonColor: '#FF9800'
        });
        return
    }

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoTipo)
        })

        const dados = await resposta.json()

        if (resposta.status === 201 || resposta.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Tipo de Bebida cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            
            // LIMPA OS CAMPOS PARA O PRÓXIMO CADASTRO
            if (nomeInput) nomeInput.value = '';
            if (volumeInput) volumeInput.value = '';
            if (teorInput) teorInput.value = '';
            if (preparoInput) preparoInput.value = '';
            if (ingredientesInput) ingredientesInput.value = '';
            if (perfilInput) perfilInput.value = '';
            if (dicaInput) dicaInput.value = '';

            // O input volta a ter o foco piscando para a pessoa já começar a digitar o próximo
            if (nomeInput) nomeInput.focus();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.message || 'Erro ao cadastrar. Verifique os dados.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na API:', erro)
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão',
            text: 'Falha ao conectar com o servidor.',
            confirmButtonColor: '#005A9C'
        });
    }
}

// ==========================================
// 2. LISTAR TODOS (GET)
// ==========================================
window.listarTiposBebida = async function() {
    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida`)
        const dados = await resposta.json()

        if (resposta.ok && dados.response) {
            const lista = dados.response
            const tabelaBody = document.querySelector('#tabelaTiposBebida tbody')
            
            if (!tabelaBody) return
            
            while (tabelaBody.firstChild) {
                tabelaBody.removeChild(tabelaBody.firstChild)
            }

            lista.forEach(tipo => {
                const tr = document.createElement('tr')
                tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition'

                const tdNome = document.createElement('td')
                tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C]'
                tdNome.textContent = tipo.nome
                tr.appendChild(tdNome)

                const tdVolume = document.createElement('td')
                tdVolume.className = 'py-4 px-6 text-sm text-gray-600'
                tdVolume.textContent = tipo.volume
                tr.appendChild(tdVolume)

                const tdTeor = document.createElement('td')
                tdTeor.className = 'py-4 px-6 text-sm text-gray-600'
                tdTeor.textContent = tipo.teor_alcoolico || '-' 
                tr.appendChild(tdTeor)

                const tdAcoes = document.createElement('td')
                tdAcoes.className = 'py-4 px-6 border-l border-gray-200'
                
                const divAcoes = document.createElement('div')
                divAcoes.className = 'flex items-center justify-center gap-5'

                const btnEditar = document.createElement('button');
                btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition';
                btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`;
                btnEditar.title = "Editar";
                btnEditar.addEventListener('click', () => abrirModalEdicaoTipo(tipo))
                divAcoes.appendChild(btnEditar)

                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'text-gray-800 hover:text-red-600 transition'
                btnExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;
                btnExcluir.title = "Excluir";
                btnExcluir.addEventListener('click', () => deletarTipoBebida(tipo.id))
                divAcoes.appendChild(btnExcluir)

                tdAcoes.appendChild(divAcoes)
                tr.appendChild(tdAcoes)
                tabelaBody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar tipos de bebida:', erro)
    }
}

// ==========================================
// 3. ATUALIZAR (PUT)
// ==========================================
window.atualizarTipoBebida = async function(id) {
    const tipoAtualizado = {
        nome: document.getElementById('editTipoNome')?.value || '',
        volume: document.getElementById('editTipoVolume')?.value || '',
        teor_alcoolico: document.getElementById('editTipoTeor')?.value || '',
        modo_preparo: document.getElementById('editTipoPreparo')?.value || '',
        ingredientes: document.getElementById('editTipoIngredientes')?.value || '',
        perfil_sabor: document.getElementById('editTipoPerfil')?.value || null,
        dica_delicia: document.getElementById('editTipoDica')?.value || null
    }

    try {
        const resposta = await fetch(`${BASE_URL}/tipobebida/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoAtualizado)
        })

        if (resposta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'Tipo de Bebida atualizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            fecharModal();
            listarTiposBebida() 
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao atualizar o Tipo de Bebida.',
                confirmButtonColor: '#005A9C'
            });
        }
    } catch (erro) {
        console.error('Erro na atualização:', erro)
    }
}

// ==========================================
// 4. DELETAR (DELETE) - Com SweetAlert2
// ==========================================
window.deletarTipoBebida = async function(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter a exclusão deste Tipo de Bebida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const resposta = await fetch(`${BASE_URL}/tipobebida/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                Swal.fire(
                    'Excluído!',
                    'O Tipo de Bebida foi removido com sucesso.',
                    'success'
                );
                listarTiposBebida()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Não foi possível excluir',
                    text: 'Este tipo pode estar vinculado a uma bebida já cadastrada.',
                    confirmButtonColor: '#005A9C'
                });
            }
        } catch (erro) {
            console.error('Erro ao deletar:', erro)
        }
    }
}

// ==========================================
// FUNÇÕES AUXILIARES (MODAL)
// ==========================================
window.fecharModal = function() {
    const modal = document.getElementById('modal-editar-tipo-bebida');
    if (modal) modal.classList.add('hidden');
}

window.abrirModalEdicaoTipo = function(tipo) {
    const modal = document.getElementById('modal-editar-tipo-bebida');
    const btnSalvar = document.getElementById('btnSalvarEdicaoTipo'); 
    
    if (modal && btnSalvar) {
        document.getElementById('editTipoNome').value = tipo.nome || ''
        document.getElementById('editTipoVolume').value = tipo.volume || ''
        document.getElementById('editTipoTeor').value = tipo.teor_alcoolico || ''
        document.getElementById('editTipoIngredientes').value = tipo.ingredientes || ''
        document.getElementById('editTipoPreparo').value = tipo.modo_preparo || ''
        document.getElementById('editTipoPerfil').value = tipo.perfil_sabor || ''
        document.getElementById('editTipoDica').value = tipo.dica_delicia || ''
        
        btnSalvar.onclick = () => atualizarTipoBebida(tipo.id);
        
        modal.classList.remove('hidden');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaTiposBebida')) {
        listarTiposBebida();
    }
})
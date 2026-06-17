/**********************************************************************
 * Objetivo: Arquivo responsável pela integração da página de cargos
 * com a API do projeto Delícia Gelada.
 * Data: 19/06/2026
 * Autor: Diego de Pádua Bezerra de Lemos
 * Versão: 1.0
 **********************************************************************/

const API_CARGO = 'http://localhost:3000/v1/fynix/deliciagelada/cargo'

const tabelaCargos = document.getElementById('tabela-cargos')
const inputBuscarCargo = document.getElementById('buscar-cargo')
const modalEditarCargo = document.getElementById('modal-editar-cargo')
const inputEditarCargo = document.getElementById('editCargoNome')

let cargos = []
let idCargoEditando = null

async function listarCargos() {
    try {
        const response = await fetch(API_CARGO)
        const result = await response.json()

        cargos = result.response || []

        carregarTabelaCargos(cargos)

    } catch (error) {
        console.log(error)
        criarLinhaMensagem('Erro ao carregar cargos da API.', 'text-red-500')
    }
}

function limparTabela() {
    while (tabelaCargos.firstChild) {
        tabelaCargos.removeChild(tabelaCargos.firstChild)
    }
}

function criarLinhaMensagem(mensagem, corTexto) {
    limparTabela()

    const tr = document.createElement('tr')
    const td = document.createElement('td')

    td.colSpan = 2
    td.textContent = mensagem
    td.className = `py-6 text-center ${corTexto} font-semibold`

    tr.appendChild(td)
    tabelaCargos.appendChild(tr)
}

function carregarTabelaCargos(listaCargos) {
    limparTabela()

    if (!listaCargos || listaCargos.length === 0) {
        criarLinhaMensagem('Nenhum cargo encontrado.', 'text-gray-500')
        return
    }

    listaCargos.forEach(cargo => {
        const tr = document.createElement('tr')
        tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition'

        const tdNome = document.createElement('td')
        tdNome.className = 'py-4 px-6 text-sm font-semibold text-[#005A9C]'
        tdNome.textContent = cargo.nome

        const tdAcoes = document.createElement('td')
        tdAcoes.className = 'py-4 px-6 border-l border-gray-200'

        const divAcoes = document.createElement('div')
        divAcoes.className = 'flex items-center justify-center gap-5'

        const btnEditar = document.createElement('button')
        btnEditar.className = 'text-gray-800 hover:text-[#005A9C] transition'
        btnEditar.title = 'Editar'
        btnEditar.textContent = '✏️'
        btnEditar.addEventListener('click', () => {
            abrirModalEditarCargo(cargo.id, cargo.nome)
        })

        const btnExcluir = document.createElement('button')
        btnExcluir.className = 'text-gray-800 hover:text-red-600 transition'
        btnExcluir.title = 'Excluir'
        btnExcluir.textContent = '🗑️'
        btnExcluir.addEventListener('click', () => {
            excluirCargo(cargo.id)
        })

        divAcoes.appendChild(btnEditar)
        divAcoes.appendChild(btnExcluir)

        tdAcoes.appendChild(divAcoes)

        tr.appendChild(tdNome)
        tr.appendChild(tdAcoes)

        tabelaCargos.appendChild(tr)
    })
}

async function excluirCargo(id) {
    const confirmar = confirm('Deseja realmente excluir este cargo?')

    if (!confirmar) return

    try {
        const response = await fetch(`${API_CARGO}/${id}`, {
            method: 'DELETE'
        })

        const result = await response.json()

        if (response.ok) {
            alert('Cargo excluído com sucesso!')
            listarCargos()
        } else {
            alert(result.message || 'Erro ao excluir cargo.')
        }

    } catch (error) {
        console.log(error)
        alert('Erro de conexão com a API.')
    }
}

function abrirModalEditarCargo(id, nome) {
    idCargoEditando = id
    inputEditarCargo.value = nome
    modalEditarCargo.classList.remove('hidden')
}

function fecharModal() {
    modalEditarCargo.classList.add('hidden')
}

async function salvarEdicaoModal() {
    const nome = inputEditarCargo.value.trim()

    if (nome === '') {
        alert('Informe o nome do cargo.')
        return
    }

    try {
        const response = await fetch(`${API_CARGO}/${idCargoEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
        })

        const result = await response.json()

        if (response.ok) {
            alert('Cargo atualizado com sucesso!')
            fecharModal()
            listarCargos()
        } else {
            alert(result.message || 'Erro ao atualizar cargo.')
        }

    } catch (error) {
        console.log(error)
        alert('Erro de conexão com a API.')
    }
}

if (inputBuscarCargo) {
    inputBuscarCargo.addEventListener('input', function () {
        const texto = inputBuscarCargo.value.toLowerCase()

        const cargosFiltrados = cargos.filter(cargo =>
            cargo.nome.toLowerCase().includes(texto)
        )

        carregarTabelaCargos(cargosFiltrados)
    })
}

listarCargos()
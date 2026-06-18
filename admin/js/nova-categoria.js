/***********************************************************************************
 * Objetivo: Integração da página de cadastro de nova categoria
 * Data: 17/06/2026
 * Autora: Daniele Silva Santos
 * Versão: 1.0
 ***********************************************************************************/

'use strict'

const BASE_URL = 'http://localhost:3000/v1/fynix/deliciagelada'

function mostrarFeedback(mensagem, tipo = 'erro') {
    let feedback = document.getElementById('feedback-msg')

    if (!feedback) {
        feedback = document.createElement('div')
        feedback.id = 'feedback-msg'
        feedback.className = 'fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-sm font-bold transition-all'
        document.body.appendChild(feedback)
    }

    feedback.textContent = mensagem
    feedback.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white text-sm font-bold transition-all ${
        tipo === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
    }`
    feedback.style.display = 'block'

    setTimeout(() => { feedback.style.display = 'none' }, 4000)
}


async function postCategoria(){

    // Captura os valores do formulário
    const nome      = document.getElementById('nomeCategoria').value.trim()
    const descricao = document.getElementById('descricaoCategoria').value.trim()
    const foto      = document.getElementById('fotoCategoria').value.trim()
    const ativa     = document.getElementById('categoriaAtiva').checked
    const id_status = ativa ? 1 : 2

    // Validação básica no frontend (RNF018)
    if (!nome || nome.length > 50) {
        mostrarFeedback('O nome da categoria é obrigatório e deve ter no máximo 50 caracteres.')
        return
    } if (!descricao || descricao.length > 255) {
        mostrarFeedback('A descrição da categoria é obrigatória e deve ter no máximo 255 caracteres.')
        return
    } if (!foto) {
        mostrarFeedback('A foto é um campo obrigatório.')
        return
    }

    // Monta o corpo da requisição conforme a documentação da API
    const body = {
        nome: nome,
        descricao: descricao,
        foto: foto,
        id_status: id_status
    }

    try {
        const resposta = await fetch(`${BASE_URL}/categoria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (resposta.status === 201) {
            mostrarFeedback('Categoria cadastrada com sucesso!', 'sucesso')
            // limpa o formulário após salvar
            document.getElementById('nomeCategoria').value      = ''
            document.getElementById('descricaoCategoria').value = ''
            document.getElementById('fotoCategoria').value      = ''
            document.getElementById('categoriaAtiva').checked   = true
        } else {
            const erro = await resposta.json()
            console.error('Erro da API:', erro)
            mostrarFeedback('Erro ao cadastrar categoria. Tente novamente.')
        }

    } catch (erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    }
}


async function getListarCategoria(){
    try {
        const response = await fetch(`${BASE_URL}/categoria`)

        if(!response.ok) throw new Error('Erro ao buscar categorias cadastradas.')
        return response.json()

    } catch(erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível carregar as categorias.')
    }
}


async function getBuscarCategoria(id) {
    try {
        const response = await fetch(`${BASE_URL}/categoria/${id}`)

        if (!response.ok) throw new Error('Erro ao buscar categoria.')

        return response.json()

    } catch (erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível encontrar a categoria.')
    }
}


async function putCategoria(id, dadosAtualizados){
    try {
        const response = await fetch(`${BASE_URL}/categoria/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
        })

        if(!response.ok) throw new Error('Erro ao atualizar a categoria.')
        return response.json()

    } catch(erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível atualizar a categoria.')
    }
}


async function deleteCategoria(id){
    try {
        const response = await fetch(`${BASE_URL}/categoria/${id}`, {
            method: 'DELETE'
        })

        if(!response.ok) throw new Error('Erro ao deletar a categoria.')

        mostrarFeedback('Categoria removida com sucesso!', 'sucesso')

    } catch(erro) {
        console.error('Erro na requisição:', erro)
        mostrarFeedback('Não foi possível remover a categoria.')
    }
}
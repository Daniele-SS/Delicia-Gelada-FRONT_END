/**********************************************************************
 * Objetivo: Arquivo responsável por cadastrar um novo cargo
 * consumindo a API do projeto Delícia Gelada.
 * Data: 17/06/2026
 * Autor: Diego de Pádua Bezerra de Lemos
 * Versão: 1.0
 **********************************************************************/

const API_CARGO = 'http://localhost:3000/v1/fynix/deliciagelada/cargo'

async function salvarNovoCargo() {
    const inputNomeCargo = document.getElementById('nomeCargo')
    const nome = inputNomeCargo.value.trim()

    if (nome === '') {
        alert('Informe o nome do cargo.')
        return
    }

    try {
        const response = await fetch(API_CARGO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome
            })
        })

        const result = await response.json()

        if (response.ok) {
            alert('Cargo cadastrado com sucesso!')
            inputNomeCargo.value = ''
            window.location.href = './lista-cargos.html'
        } else {
            alert(result.message || 'Erro ao cadastrar cargo.')
        }

    } catch (error) {
        console.log(error)
        alert('Erro ao conectar com a API.')
    }
}
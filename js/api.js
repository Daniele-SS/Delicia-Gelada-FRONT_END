/*******************************************************************************************
objetivo: Arquivo responável por gerar funções get para popular a landingpage
autor: Mayara Martins
versão:1.0.0
data:17/06/2026
********************************************************************************************/

const URL = 'http://localhost:3000/v1/fynix/deliciagelada'
// const URL_BEBIDA = 'http://localhost:3000/v1/fynix/deliciagelada/bebida?maior_de_18=true'

let categorias = []
let bebidas = []
let tipos = []

export async function getCategorias() {
    //Esse trecho faz uma requisição para uma API usando fetch, verifica se a resposta deu certo e depois transforma os dados em JSON.
    //crie uma variavel com resposta do servidor
    //fetch é uma função do JavaScript usada para fazer requisições para uma API ou servido
    const response = await fetch(`${URL}/categoria`)

    categorias = response.json()
    //se não for ok ele vai disparar um erro 
    if (!response.ok) throw new Error('Erro ao buscar contatos') //função para ser usada por outros programadores, vvai gerar um erro se não encontrar os dados na api 
    //Se a resposta estiver correta, essa linha transforma a resposta da API em JSON.

    //não está no if
    return categorias
}

export async function getBebidas(status) {
    // Garantimos que a URL está correta (adicionando a barra /bebida)
    const URL_BEBIDA = `${URL}/bebida?maior_de_18=${status}`
    
    const response = await fetch(URL_BEBIDA)
    
    if (!response.ok) {
        console.error("Erro na busca de bebidas. Status:", response.status)
        return { response: [] } // Retorna vazio para não quebrar o resto do código
    }
    
    return await response.json()
}

export async function getTipos() {
    const response = await fetch(`${URL}/tipobebida`)
    tipos = response.json()
    return tipos
}
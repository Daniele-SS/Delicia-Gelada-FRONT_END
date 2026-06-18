/*******************************************************************************************
objetivo: Arquivo responsável por gerar funções get para popular a landingpage
autor: Mayara Martins
versão: 1.0.1
data: 17/06/2026

CORREÇÕES v1.0.1:
  - BUG #3: Adicionado "await" antes de response.json() em getCategorias() e getTipos()
            Sem o await, a variável recebia uma Promise pendente (não o dado real),
            causando json.response === undefined em todo o restante do código.
  - BUG #4: Movido o "if (!response.ok)" para ANTES de chamar response.json(),
            pois após consumir o body a verificação não funciona corretamente.
********************************************************************************************/

const URL = 'http://localhost:3000/v1/fynix/deliciagelada'

let categorias = []
let bebidas = []
let tipos = []

export async function getCategorias() {
    const response = await fetch(`${URL}/categoria`)

    // FIX BUG #4: verificar ok ANTES de ler o body
    if (!response.ok) throw new Error('Erro ao buscar categorias')

    // FIX BUG #3: adicionado "await" — sem ele retornava Promise não resolvida
    categorias = await response.json()
    return categorias
}

export async function getBebidas(status) {
    const URL_BEBIDA = `${URL}/bebida?maior_de_18=${status}`

    const response = await fetch(URL_BEBIDA)

    if (!response.ok) {
        console.error("Erro na busca de bebidas. Status:", response.status)
        return { response: [] }
    }

    return await response.json()
}

export async function getTipos() {
    const response = await fetch(`${URL}/tipobebida`)

    // FIX BUG #4: verificar ok ANTES de ler o body
    if (!response.ok) throw new Error('Erro ao buscar tipos de bebida')

    // FIX BUG #3: adicionado "await" — sem ele retornava Promise não resolvida
    tipos = await response.json()
    return tipos
}
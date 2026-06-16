/***********************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos elementos da página de ADMIN
 * Data: 12/06/2026
 * Autora: Daniele Silva Santos
 * Versão: 1.0
 ***********************************************************************************/

function toggleSenha() {
    const input = document.getElementById('inputSenha')
    input.type = input.type === 'password' ? 'text' : 'password'
  }
  
function irParaDashboard() {
    document.getElementById('tela-login').classList.add('hidden')
    document.getElementById('tela-dashboard').classList.remove('hidden')
    document.getElementById('tela-dashboard').classList.add('flex')

    document.getElementById('tela-adicionar-categoria').classList.add('hidden')
    document.getElementById('tela-adicionar-categoria').classList.add('flex')
}
  
function mostrarSecao(secao) {
    if (secao === 'bebida') {
      // Esconde a tela do dashboard
      document.getElementById('tela-dashboard').classList.add('hidden')
      document.getElementById('tela-dashboard').classList.remove('flex')
      
      // Exibe a tela de adicionar bebida
      document.getElementById('tela-adicionar-bebida').classList.remove('hidden')
      document.getElementById('tela-adicionar-bebida').classList.add('flex')

      // Exibe a tela de adicionar categoria
      document.getElementById('tela-adicionar-categoria'.classList.add('hidden'))
      document.getElementById('tela-adicionar-categoria').classList.add('flex')
    }
}
    // por enquanto só loga no console
    // aqui só vai conectar com as próximas telas/modais
    console.log('Seção clicada:', secao)

function voltarParaDashboard() {
      document.getElementById('tela-adicionar-bebida').classList.add('hidden')
      document.getElementById('tela-dashboard').classList.remove('hidden')
      document.getElementById('tela-dashboard').classList.add('flex')

      document.getElementById('tela-adicionar-categoria').classList.add('hidden')
      document.getElementById('tela-adicionar-categoria').classList.add('flex')
}
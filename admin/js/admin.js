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
  }
  
  function mostrarSecao(secao) {
    // por enquanto só loga no console
    // aqui você vai conectar com as próximas telas/modais
    console.log('Seção clicada:', secao)
  }